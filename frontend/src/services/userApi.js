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
      query: ({ role, params }) => ({
        url: `/users/role/${role}`,
        params,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    upgradeToExpert: builder.mutation({
      query: (data) => ({
        url: "/users/upgrade-expert",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate User cache to refresh profile/role
    }),
    updateExpertProfile: builder.mutation({
      query: (data) => ({
        url: "/users/expert-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByRoleQuery,
  useGetUserByIdQuery,
  useUpgradeToExpertMutation,
  useUpdateExpertProfileMutation,
  useUpdateUserRoleMutation,
} = userApi;
