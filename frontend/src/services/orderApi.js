import { baseApi } from './baseApi';

/**
 * Order API
 * RTK Query endpoints for orders
 */
export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'], // Invalidate order cache if we fetch orders later
    }),
    cancelOrder: builder.mutation({
        query: (orderId) => ({
            url: `/orders/${orderId}/cancel`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
} = orderApi;
