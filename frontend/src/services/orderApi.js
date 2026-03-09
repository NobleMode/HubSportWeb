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
    getAllOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderItemImages: builder.mutation({
      query: ({ itemId, type, images }) => ({
        url: `/orders/items/${itemId}/images`,
        method: 'PATCH',
        body: { type, images },
      }),
      invalidatesTags: ['Order'],
    }),
    reportOrderItemIssue: builder.mutation({
      query: ({ itemId, condition, damageFee, notes }) => ({
        url: `/orders/items/${itemId}/report`,
        method: 'PATCH',
        body: { condition, damageFee, notes },
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    returnOrderItem: builder.mutation({
      query: ({ itemId, data }) => ({
        url: `/orders/items/${itemId}/return`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    uploadPaymentProof: builder.mutation({
      query: ({ orderId, paymentProofData }) => ({
        url: `/orders/${orderId}/payment-proof`,
        method: 'POST',
        body: paymentProofData,
      }),
      invalidatesTags: ['Order'],
    }),
    getPendingPaymentProofs: builder.query({
      query: () => '/orders/payment-proofs/pending',
      providesTags: ['Order'],
    }),
    approvePaymentProof: builder.mutation({
      query: (proofId) => ({
        url: `/orders/payment-proofs/${proofId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order'],
    }),
    rejectPaymentProof: builder.mutation({
      query: ({ proofId, reason }) => ({
        url: `/orders/payment-proofs/${proofId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderItemImagesMutation,
  useReportOrderItemIssueMutation,
  useUpdateOrderStatusMutation,
  useReturnOrderItemMutation,
  useUploadPaymentProofMutation,
  useGetPendingPaymentProofsQuery,
  useApprovePaymentProofMutation,
  useRejectPaymentProofMutation,
} = orderApi;
