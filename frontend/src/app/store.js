import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import { baseApi } from '../services/baseApi';
import { transactionApi } from '../services/transactionApi';
import { couponApi } from '../services/couponApi';

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
    [couponApi.reducerPath]: couponApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, transactionApi.middleware, couponApi.middleware),
});

export default store;
