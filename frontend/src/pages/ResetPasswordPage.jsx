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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
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
        className="max-w-md w-full bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Mật khẩu mới</h2>
          <p className="text-gray-400 text-sm">
            Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isLoading ? "Đang cập nhật..." : "ĐỔI MẬT KHẨU"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
