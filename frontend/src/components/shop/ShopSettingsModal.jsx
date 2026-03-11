import React, { useState, useEffect } from "react";
import { useUpdateMyShopMutation } from "../../services/shopApi";
import { useToast } from "../../context/ToastContext";
import LocationPicker from "../common/LocationPicker";

const ShopSettingsModal = ({ isOpen, onClose, shopData }) => {
  const [updateMyShop, { isLoading }] = useUpdateMyShopMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatarUrl: "",
    coverUrl: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (shopData) {
      setFormData({
        name: shopData.name || "",
        description: shopData.description || "",
        avatarUrl: shopData.avatarUrl || "",
        coverUrl: shopData.coverUrl || "",
        address: shopData.address || "",
        latitude: shopData.latitude || null,
        longitude: shopData.longitude || null,
      });
    }
  }, [shopData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyShop(formData).unwrap();
      showToast("Cập nhật thông tin cửa hàng thành công!", "success");
      onClose();
    } catch (err) {
      showToast(err.data?.message || "Có lỗi xảy ra khi cập nhật", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-electricBlue to-limeGreen rounded-t-3xl">
          <h2 className="text-xl font-bold text-white">Cài đặt Cửa hàng</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <form id="shop-settings-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Cửa hàng *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                  placeholder="Nhập tên cửa hàng của bạn"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả Cửa hàng</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                  placeholder="Giới thiệu ngắn gọn về cửa hàng..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Ảnh đại diện</label>
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Ảnh cover</label>
                <input
                  type="text"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>📍 Vị trí Cửa hàng trên Bản đồ</span>
                  <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-md">Cho phép khách hàng dễ dàng tìm thấy bạn</span>
                </label>
                
                <LocationPicker 
                  initialLocation={
                    formData.latitude && formData.longitude 
                      ? { lat: formData.latitude, lng: formData.longitude } 
                      : null
                  }
                  onLocationSelect={handleLocationSelect}
                />
                
                <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ chi tiết (có thể chỉnh sửa hoặc tự động điền)</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-electricBlue text-gray-700 focus:border-transparent outline-none bg-white"
                      placeholder="Số nhà, Tên đường, Quận, Thành phố..."
                    />
                </div>
              </div>
            </div>
          </form>

        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex gap-4 justify-end">
            <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 flex-1 md:flex-none justify-center rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
            >
                Hủy thay đổi
            </button>
            <button
                type="submit"
                form="shop-settings-form"
                disabled={isLoading}
                className="px-8 py-3 flex-1 md:flex-none justify-center bg-gradient-to-r from-electricBlue to-limeGreen text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
            >
                {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsModal;
