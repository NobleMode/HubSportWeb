import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../services/authApi";
import { motion } from "framer-motion";
import Toast from "../components/common/Toast";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const isReset = location.state?.isReset || false;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [toast, setToast] = useState(null);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        setToast({ message: "Vui lòng nhập đủ 6 chữ số", type: "error" });
        return;
      }

      if (isReset) {
        // If it's for reset password, we navigate to reset page with the OTP
        navigate("/reset-password", { state: { email, otp: otpCode } });
        return;
      }

      await verifyOtp({ email, otp: otpCode }).unwrap();
      setToast({ message: "Xác thực thành công!", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setToast({
        message: err.data?.message || "Mã OTP không chính xác",
        type: "error",
      });
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setTimer(60);
      setToast({ message: "Mã OTP mới đã được gửi", type: "success" });
    } catch (err) {
      setToast({ message: "Không thể gửi lại mã OTP", type: "error" });
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
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Xác thực Email
          </h2>
          <p className="text-gray-500">Mã xác thực đã được gửi đến</p>
          <p className="text-electricBlue font-bold mt-1">{email}</p>
        </div>

        <div className="flex justify-between gap-2 mb-10">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="w-12 h-16 bg-gray-50 border border-gray-200 text-gray-900 text-center text-2xl font-bold rounded-xl focus:border-electricBlue focus:ring-2 focus:ring-electricBlue outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-4 bg-electricBlue text-white font-bold rounded-2xl hover:bg-electricBlue-hover transition-all shadow-md disabled:opacity-50"
        >
          {isVerifying ? "Đang xác thực..." : "XÁC NHẬN"}
        </button>

        <div className="mt-8 text-center">
          {timer > 0 ? (
            <p className="text-gray-500 text-sm">
              Gửi lại mã sau{" "}
              <span className="text-gray-900 font-bold">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-electricBlue font-bold hover:text-electricBlue-hover transition-colors text-sm"
            >
              GỬI LẠI MÃ OTP
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
