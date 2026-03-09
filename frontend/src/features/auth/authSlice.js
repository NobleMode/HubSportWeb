import { createSlice } from '@reduxjs/toolkit';

/**
 * Auth Slice
 * Manages authentication state: user, token, isAuthenticated
 */
const initialState = {
  user: null,
  token: null,
  rememberMe: false,
  isAuthenticated: false,
  loading: true, // Start with loading true to check session
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, rememberMe } = action.payload;
      state.user = user;
      state.token = token;
      state.rememberMe = rememberMe || false;
      state.isAuthenticated = true;
      state.error = null;
      // Persist to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.rememberMe = false;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('remember_me');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    restoreSession: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      const rememberMe = localStorage.getItem('remember_me') === 'true';
      
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.rememberMe = rememberMe;
        state.isAuthenticated = true;
      }
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  updateUser,
  restoreSession,
  loadFromStorage,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectRememberMe = (state) => state.auth.rememberMe;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
