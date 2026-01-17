import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Base API Configuration with RTK Query
 * Automatically injects JWT token from Redux store into all requests
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux store
      const token = getState().auth.token;
      
      // If token exists, add it to headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Order', 'Booking', 'Expert'],
  endpoints: () => ({}),
});

export default baseApi;
