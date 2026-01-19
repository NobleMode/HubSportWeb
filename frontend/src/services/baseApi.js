import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../features/auth/authSlice';
import { Mutex } from 'async-mutex';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const refreshResult = await baseQuery(
            { url: '/auth/refresh-token', method: 'POST' },
            api, 
            extraOptions
        );


        console.log("chạy tới đây");
        if (refreshResult.data) {
          // Store the new token
          const { token, user } = refreshResult.data.data;
          api.dispatch(setCredentials({ token, user }));
          
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed
          api.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // Double check: If result is still 401 after possible retry, force logout
  // This handles cases where refresh failed or the retried request also failed
  if (result.error && result.error.status === 401) {
      // Avoid infinite loop if the unauthorized request IS the logout/refresh request itself
      if (args.url !== '/auth/login' && args.url !== '/auth/refresh-token') {
          api.dispatch(logout());
      }
  }

  return result;
};

/**
 * Base API Configuration with RTK Query
 * Automatically injects JWT token from Redux store into all requests
 * Handles auto-logout on 401 errors
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Order', 'Booking', 'Expert'],
  endpoints: () => ({}),
});

export default baseApi;
