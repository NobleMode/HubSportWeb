import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, setCredentials, setLoading } from './features/auth/authSlice';
import { useGetProfileQuery, useRefreshTokenMutation } from './services/authApi';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import PlayersPage from './pages/PlayersPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';

import NotFoundPage from './pages/NotFoundPage';

// Layout
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

import RoleGuard from './components/common/RoleGuard';
import { ToastProvider } from './context/ToastContext';

/**
 * Main App Component
 * Configures routing with protected routes
 */
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(state => state.auth.loading);
  
  // Refresh token mutation
  const [refreshToken] = useRefreshTokenMutation();
  // Check authentication status on mount via Profile query
  // We intentionally remove 'skip' so this runs immediately. 
  // If 401, baseApi will handle the refresh.
  const { data: userProfile, isLoading: isProfileLoading, isSuccess: isProfileSuccess, isError: isProfileError } = useGetProfileQuery();

  // Handle Global Loading State
  useEffect(() => {
    // When the initial profile check is done (success or error), stop loading
    if (!isProfileLoading) {
        dispatch(setLoading(false));
    }
  }, [isProfileLoading, dispatch]);

  // Update user profile in store when profile query succeeds
  useEffect(() => {
    if (isProfileSuccess && userProfile) {
        // We already have token in store, just update user info
        // But setCredentials expects {user, token}. 
        // We can create a dedicated 'updateUser' action or just reuse setCredentials if we grab token from store.
        // Or simpler: The initial refreshToken call already returns user. 
        // This query might be redundant on initial load, but good for keeping data fresh.
        // Let's keep it simple for now. 
    }
  }, [isProfileSuccess, userProfile]);


  if (loading) {
      return (
          <div className="flex h-screen w-screen justify-center items-center">
              <LoadingSpinner size="lg" />
          </div>
      );
  }



  return (
    <Router>
      <ToastProvider>
        <MainLayout>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/players/:id" element={<PlayerDetailsPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminPage />
              </RoleGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <RoleGuard>
                <ProfilePage />
              </RoleGuard>
            }
          />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<div className="p-8 text-center text-red-600">Access Denied</div>} />


          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </MainLayout>
      </ToastProvider>
    </Router>
  );
}

export default App;
