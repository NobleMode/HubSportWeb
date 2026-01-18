import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../../features/auth/authSlice';
import { selectItemCount } from '../../features/cart/cartSlice';

/**
 * Header Component
 * Navigation bar with authentication status and cart
 */
const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const cartItemCount = useSelector(selectItemCount);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            SportHub Vietnam
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.name || user?.email}
                </span>
                <Link to="/orders" className="text-gray-700 hover:text-primary-600">
                    My Orders
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
