import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../services/authApi";
import { motion } from "framer-motion";
import Toast from "../components/common/Toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setToast({
        message: "Mã OTP đã được gửi đến email của bạn",
        type: "success",
      });
      setTimeout(
        () => navigate("/verify-otp", { state: { email, isReset: true } }),
        2000,
      );
    } catch (err) {
      setToast({
        message: err.data?.message || "Không tìm thấy người dùng với email này",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-100 shadow-sm"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-electricBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-electricBlue/20">
            <svg
              className="w-10 h-10 text-electricBlue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.999-5.999A6 6 0 006.999 7m4 0a2 2 0 11-4 0m4 0V5m6 4v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-gray-500 text-sm">
            Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent transition"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-electricBlue text-white font-bold rounded-2xl hover:bg-electricBlue-hover transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "GỬI MÃ XÁC THỰC"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-500 hover:text-electricBlue transition-colors text-sm font-bold"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
