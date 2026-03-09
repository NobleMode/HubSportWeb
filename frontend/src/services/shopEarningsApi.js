import { baseApi } from './baseApi';

/**
 * Shop Earnings API
 * RTK Query endpoints for shop earnings management
 */
export const shopEarningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopEarnings: builder.query({
      query: (shopId) => `/shop-earnings/${shopId}`,
      providesTags: (result, error, shopId) => [{ type: 'ShopEarnings', id: shopId }],
    }),
    getWithdrawalHistory: builder.query({
      query: ({ shopId, page = 1, limit = 20 }) =>
        `/shop-earnings/${shopId}/withdrawal-history?page=${page}&limit=${limit}`,
      providesTags: (result, error, { shopId }) => [{ type: 'WithdrawalHistory', id: shopId }],
    }),
    requestWithdrawal: builder.mutation({
      query: ({ shopId, withdrawalData }) => ({
        url: `/shop-earnings/${shopId}/withdrawal`,
        method: 'POST',
        body: withdrawalData,
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'ShopEarnings', id: shopId },
        { type: 'WithdrawalHistory', id: shopId },
      ],
    }),
    getAllWithdrawals: builder.query({
      query: ({ status = '', page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        params.append('page', page);
        params.append('limit', limit);
        return `/shop-earnings/admin/withdrawals?${params.toString()}`;
      },
      providesTags: ['AdminWithdrawals'],
    }),
    approveWithdrawal: builder.mutation({
      query: (withdrawalId) => ({
        url: `/shop-earnings/admin/withdrawal/${withdrawalId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminWithdrawals', 'ShopEarnings'],
    }),
    completeWithdrawal: builder.mutation({
      query: (withdrawalId) => ({
        url: `/shop-earnings/admin/withdrawal/${withdrawalId}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminWithdrawals', 'ShopEarnings'],
    }),
    rejectWithdrawal: builder.mutation({
      query: ({ withdrawalId, reason }) => ({
        url: `/shop-earnings/admin/withdrawal/${withdrawalId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['AdminWithdrawals', 'ShopEarnings'],
    }),
    getPlatformStatistics: builder.query({
      query: () => '/shop-earnings/admin/statistics',
      providesTags: ['PlatformStats'],
    }),
  }),
});

export const {
  useGetShopEarningsQuery,
  useGetWithdrawalHistoryQuery,
  useRequestWithdrawalMutation,
  useGetAllWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useCompleteWithdrawalMutation,
  useRejectWithdrawalMutation,
  useGetPlatformStatisticsQuery,
} = shopEarningsApi;
