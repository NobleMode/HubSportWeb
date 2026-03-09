import { baseApi } from "./baseApi";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query({
      query: (params) => ({
        url: "/shops",
        params,
      }),
      providesTags: ["Shop"],
    }),
    getShopById: builder.query({
      query: (id) => `/shops/${id}`,
      providesTags: (result, error, id) => [{ type: "Shop", id }],
    }),
    getMyShop: builder.query({
      query: () => "/shops/my-shop",
      providesTags: ["Shop"],
    }),
    registerShop: builder.mutation({
      query: (shopData) => ({
        url: "/shops",
        method: "POST",
        body: shopData,
      }),
      invalidatesTags: ["Shop", "User"],
    }),
    updateShop: builder.mutation({
      query: (shopData) => ({
        url: "/shops/my-shop",
        method: "PUT",
        body: shopData,
      }),
      invalidatesTags: ["Shop"],
    }),
    getMyShopOrders: builder.query({
      query: () => "/shops/my-orders",
      providesTags: ["ShopOrder"],
    }),
    settleShopOrder: builder.mutation({
      query: (id) => ({
        url: `/shops/orders/${id}/settle`,
        method: "PATCH",
      }),
      invalidatesTags: ["ShopOrder", "Shop"],
    }),
    requestWithdrawal: builder.mutation({
      query: (withdrawalData) => ({
        url: "/shops/withdraw",
        method: "POST",
        body: withdrawalData,
      }),
      invalidatesTags: ["Shop", "Withdrawal"],
    }),
    getWithdrawalHistory: builder.query({
      query: () => "/shops/withdrawals",
      providesTags: ["Withdrawal"],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopByIdQuery,
  useGetMyShopQuery,
  useRegisterShopMutation,
  useUpdateShopMutation,
  useGetMyShopOrdersQuery,
  useSettleShopOrderMutation,
  useRequestWithdrawalMutation,
  useGetWithdrawalHistoryQuery,
} = shopApi;
