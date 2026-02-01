import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api", // Adjust if needed
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Adjust based on your auth slice
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => "/coupons",
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    validateCoupon: builder.mutation({
        query: (body) => ({
            url: "/coupons/validate",
            method: "POST",
            body
        })
    })
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation
} = couponApi;
