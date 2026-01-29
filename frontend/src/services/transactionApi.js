import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transaction', 'User'],
  endpoints: (builder) => ({
    getMyTransactions: builder.query({
      query: () => '/transactions',
      providesTags: ['Transaction'],
    }),
  }),
});

export const { useGetMyTransactionsQuery } = transactionApi;
