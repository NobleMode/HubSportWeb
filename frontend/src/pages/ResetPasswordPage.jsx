import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../services/authApi";
import { motion } from "framer-motion";
import Toast from "../components/common/Toast";
import { encryptData } from "../utils/security";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: "Mật khẩu không trùng khớp", type: "error" });
      return;
    }

    try {
      const encryptedPassword = encryptData(newPassword);
      await resetPassword({
        email,
        otp,
        newPassword: encryptedPassword,
      }).unwrap();
      setToast({ message: "Mật khẩu đã được cập nhật!", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setToast({
        message: err.data?.message || "Không thể đặt lại mật khẩu",
        type: "error",
      });
    }
  };

  if (!email || !otp) {
    navigate("/login");
    return null;
  }

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Mật khẩu mới
          </h2>
          <p className="text-gray-500 text-sm">
            Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-electricBlue text-white font-bold rounded-2xl hover:bg-electricBlue-hover transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? "Đang cập nhật..." : "ĐỔI MẬT KHẨU"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
