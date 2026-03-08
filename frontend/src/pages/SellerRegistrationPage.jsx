import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRegisterShopMutation,
  useGetMyShopQuery,
} from "../services/shopApi";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";

const SellerRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatarUrl: "",
    coverUrl: "",
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: myShop, isLoading: isCheckingShop } = useGetMyShopQuery();
  const [registerShop, { isLoading: isRegistering }] =
    useRegisterShopMutation();

  useEffect(() => {
    if (myShop?.success) {
      showToast("You already have a shop!", "info");
      navigate("/profile");
    }
  }, [myShop, navigate, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerShop(formData).unwrap();
      showToast("Chào mừng bạn đến với cộng đồng người bán!", "success");
      navigate("/profile");
    } catch (err) {
      showToast(err.data?.message || "Có lỗi xảy ra khi đăng ký shop", "error");
    }
  };

  if (isCheckingShop)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 sm:text-5xl">
            Bắt đầu kinh doanh cùng EXERCISER
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Mở shop của bạn ngay hôm nay và tiếp cận hàng ngàn khách hàng yêu
            thể thao.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Tên cửa hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                placeholder="Ví dụ: Sport Master Store"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Mô tả cửa hàng
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                placeholder="Mô tả ngắn gọn về cửa hàng của bạn..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="avatarUrl"
                  className="block text-sm font-medium text-gray-300"
                >
                  URL Ảnh đại diện shop
                </label>
                <input
                  type="text"
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="coverUrl"
                  className="block text-sm font-medium text-gray-300"
                >
                  URL Ảnh bìa
                </label>
                <input
                  type="text"
                  id="coverUrl"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100`}
              >
                {isRegistering ? "Đang xử lý..." : "Mở Shop Ngay"}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500">
              Bằng cách nhấn nút "Mở Shop Ngay", bạn đồng ý với Điều khoản và
              Quy định của Marketplace EXERCISER.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerRegistrationPage;
