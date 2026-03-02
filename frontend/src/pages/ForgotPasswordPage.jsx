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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
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
        className="max-w-md w-full bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-gray-400 text-sm">
            Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "GỬI MÃ XÁC THỰC"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-500 hover:text-white transition-colors text-sm font-bold"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
