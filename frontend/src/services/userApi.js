import { baseApi } from "./baseApi";

/**
 * User API
 * RTK Query endpoints for users
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUsersByRole: builder.query({
      query: (role) => `/users/role/${role}`,
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUsersByRoleQuery, useGetUserByIdQuery } =
  userApi;
