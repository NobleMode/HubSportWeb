import { baseApi } from './baseApi';

export const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => '/coupons',
            providesTags: ['Coupon'],
        }),
        getCouponById: builder.query({
            query: (id) => `/coupons/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
        }),
        createCoupon: builder.mutation({
            query: (couponData) => ({
                url: '/coupons',
                method: 'POST',
                body: couponData,
            }),
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/coupons/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Coupon', (_result, _error, { id }) => [{ type: 'Coupon', id }]],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'],
        }),
        validateCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupons/validate',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation,
} = couponApi;
