import { baseApi } from "./baseApi";

/**
 * Product API
 * RTK Query endpoints for products
 */
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          ...params,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 0, // Disable caching to ensure fresh results on filter change
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    
    // Product Items
    getProductItems: builder.query({
      query: (productId) => `/products/${productId}/items`,
      providesTags: ['ProductItem'],
    }),
    createProductItem: builder.mutation({
      query: (data) => ({
        url: '/product-items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductItem', 'Product'],
    }),
    updateProductItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product-items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ProductItem'],
    }),
    logMaintenance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product-items/${id}/maintenance`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductItem'],
    }),
    liquidateItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product-items/${id}/liquidate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductItem', 'Product'],
    }),
    getItemHistory: builder.query({
      query: (id) => `/product-items/${id}/history`,
      providesTags: ['ProductItem'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductItemsQuery,
  useCreateProductItemMutation,
  useUpdateProductItemMutation,
  useLogMaintenanceMutation,
  useLiquidateItemMutation,
  useGetItemHistoryQuery,
} = productApi;
