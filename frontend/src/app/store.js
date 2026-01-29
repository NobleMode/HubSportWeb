import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import { baseApi } from '../services/baseApi';
import { transactionApi } from '../services/transactionApi';

/**
 * Redux Store Configuration
 * Includes authSlice, cartSlice, and RTK Query API
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, transactionApi.middleware),
});

export default store;
