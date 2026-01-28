import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { encryptData } from "../utils/security";

/**
 * Login Page
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const encryptedPassword = encryptData(formData.password);

      const response = await login({
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
      setError(err.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Image/Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-electricBlue-800 to-electricBlue-900 relative hidden md:flex items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop"
            alt="Gym background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-electricBlue-900 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            Welcome Back,
            <br />
            Champion!
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            "Success isn't always about greatness. It's about consistency.
            Consistent hard work gains success."
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-electricBlue-800 bg-gray-300"
                ></div>
              ))}
            </div>
            <p className="text-sm font-medium">Join 5,000+ athletes today</p>
          </div>
        </div>

        {/* Decoration */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-limeGreen-DEFAULT rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-electricBlue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electricBlue-DEFAULT focus:border-transparent transition"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-electricBlue-DEFAULT hover:underline font-medium"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electricBlue-DEFAULT focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-black bg-limeGreen-DEFAULT hover:bg-limeGreen-hover text-white font-bold rounded-xl shadow-lg shadow-limeGreen-DEFAULT/30 transition transform hover:-translate-y-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-electricBlue-DEFAULT font-bold hover:underline"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
