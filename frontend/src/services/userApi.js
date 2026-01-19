import { baseApi } from './baseApi';

/**
 * User API
 * RTK Query endpoints for users
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/auth/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userApi;
