import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  setCredentials,
  setLoading,
  restoreSession,
} from "./features/auth/authSlice";
import {
  useGetProfileQuery,
  useRefreshTokenMutation,
} from "./services/authApi";
import { Analytics } from "@vercel/analytics/react";

// Layout & Core Components (Critical - No lazy load)
import MainLayout from "./components/layout/MainLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import RoleGuard from "./components/common/RoleGuard";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/common/ScrollToTop";

// ✅ PERFORMANCE: Lazy Load Pages (Code Splitting)
// Critical pages loaded immediately
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Non-critical pages lazy loaded
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const OrderFailPage = lazy(() => import("./pages/OrderFailPage"));
const PlayersPage = lazy(() => import("./pages/PlayersPage"));
const PlayerDetailsPage = lazy(() => import("./pages/PlayerDetailsPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const SellerRegistrationPage = lazy(
  () => import("./pages/SellerRegistrationPage"),
);
const ShopDetailsPage = lazy(() => import("./pages/ShopDetailsPage"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage"));
const VerifyOtpPage = lazy(() => import("./pages/VerifyOtpPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

/**
 * Main App Component
 * Configures routing with protected routes
 */
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector((state) => state.auth.loading);
  const token = useSelector((state) => state.auth.token);

  // Refresh token mutation
  const [refreshToken] = useRefreshTokenMutation();

  // ✅ FIX: Only fetch profile if we have a token (avoid retry loop)
  // Skip profile query when there's no token to prevent continuous 401 errors
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccess,
    isError: isProfileError,
  } = useGetProfileQuery(undefined, {
    skip: !token, // Skip if no token
  });

  // Handle Global Loading State
  useEffect(() => {
    // When the initial profile check is done (success or error), stop loading
    if (!isProfileLoading) {
      dispatch(setLoading(false));
    }
  }, [isProfileLoading, dispatch]);

  // ✅ Auto-refresh on mount if no token but cookies might exist
  useEffect(() => {
    const tryAutoRefresh = async () => {
      // If no token in Redux, try to refresh from cookie
      if (!token && !currentUser) {
        try {
          const result = await refreshToken().unwrap();
          if (result.data) {
            dispatch(setCredentials(result.data));
          }
        } catch (err) {
          // Silent fail - user just not authenticated
          console.log("No valid refresh token found");
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    tryAutoRefresh();
  }, []); // Only run once on mount

  // Update user profile in store when profile query succeeds
  useEffect(() => {
    if (isProfileSuccess && userProfile && userProfile.data) {
      dispatch(restoreSession(userProfile.data));
    }
  }, [isProfileSuccess, userProfile, dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <MainLayout>
          <Suspense
            fallback={
              <div className="flex h-screen w-screen justify-center items-center">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/order-fail" element={<OrderFailPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/players/:id" element={<PlayerDetailsPage />} />
              <Route path="/shop/:id" element={<ShopDetailsPage />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
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
              <Route
                path="/orders"
                element={
                  <RoleGuard>
                    <OrderHistoryPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/become-seller"
                element={
                  <RoleGuard allowedRoles={["CUSTOMER"]}>
                    <SellerRegistrationPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller-dashboard"
                element={
                  <RoleGuard allowedRoles={["SELLER"]}>
                    <SellerDashboardPage />
                  </RoleGuard>
                }
              />

              {/* Unauthorized Route */}
              <Route
                path="/unauthorized"
                element={
                  <div className="p-8 text-center text-red-600">
                    Access Denied
                  </div>
                }
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </ToastProvider>
      <Analytics />
    </Router>
  );
}

export default App;
