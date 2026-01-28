import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { encryptData } from "../utils/security";

/**
 * Register Page
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const encryptedPassword = encryptData(formData.password);

      const response = await register({
        name: formData.name,
        email: formData.email,
        password: encryptedPassword,
      }).unwrap();

      // Save credentials to Redux store
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Image/Branding */}
      <div className="md:w-1/2 bg-gray-900 relative hidden md:flex items-center justify-center p-12 overflow-hidden order-1 md:order-2">
        <div className="absolute inset-0 z-0 opacity-50">
          <img
            src="https://images.unsplash.com/photo-1552674605-46d536d2e681?q=80&w=2073&auto=format&fit=crop"
            alt="Runner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-limeGreen-900 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg text-right">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            Start Your <br />
            <span className="text-limeGreen-DEFAULT">Journey Today</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            "The only bad workout is the one that didn't happen. Create an
            account and get moving."
          </p>
          {/* Decoration */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-electricBlue-DEFAULT rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 order-2 md:order-1">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500">
              Join the community of elite athletes
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-limeGreen-DEFAULT focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-limeGreen-DEFAULT focus:border-transparent transition"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-limeGreen-DEFAULT focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-limeGreen-DEFAULT focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-black bg-electricBlue-DEFAULT hover:bg-electricBlue-hover text-white font-bold rounded-xl shadow-lg shadow-electricBlue-DEFAULT/30 transition transform hover:-translate-y-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-limeGreen-DEFAULT font-bold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
