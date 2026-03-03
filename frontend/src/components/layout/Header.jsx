import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout as logoutAction,
} from "../../features/auth/authSlice";
import { selectItemCount } from "../../features/cart/cartSlice";
import { useLogoutMutation } from "../../services/authApi";

/**
 * Header Component
 * Navigation bar with authentication status and cart
 */
const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const cartItemCount = useSelector(selectItemCount);

  const [logoutApi] = useLogoutMutation();

  /* Dropdown State */
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(logoutAction());
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900 group"
          >
            Sport
            <span className="text-electricBlue group-hover:text-limeGreen transition-colors">
              Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-electricBlue font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-electricBlue font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/players"
              className="text-gray-600 hover:text-electricBlue font-medium transition-colors"
            >
              Players
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-electricBlue transition-colors"
            >
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
                <span className="absolute -top-2 -right-2 bg-red-500 text-white border border-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-electricBlue focus:outline-none py-2 font-medium"
                >
                  <span className="hidden sm:inline">
                    Welcome, {user?.name || user?.email}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 overflow-hidden">
                    {/* Placeholder Avatar or User Image could go here */}
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 transform origin-top-right border border-gray-100 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/players"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-electricBlue transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Find Players
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-electricBlue transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-electricBlue transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {user?.role !== "SELLER" && user?.role !== "ADMIN" && (
                      <Link
                        to="/become-seller"
                        className="block px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 font-medium transition-colors italic"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        ✨ Become a Seller
                      </Link>
                    )}
                    {user?.role === "SELLER" && (
                      <Link
                        to="/seller-dashboard"
                        className="block px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 font-semibold transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        🏪 Seller Dashboard
                      </Link>
                    )}
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-sm text-electricBlue hover:bg-blue-50 font-semibold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center  space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-electricBlue font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-gray-600 hover:text-electricBlue font-medium transition-colors"
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
