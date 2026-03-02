import React, { useState } from "react";
import { useCreateProductMutation } from "../../services/productApi";
import Button from "../common/Button";
import axios from "axios";

const AddProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "SALE",
    category: "Cầu lông",
    brand: "",
    salePrice: "",
    rentalPrice: "",
    depositFee: "",
    stock: "1",
    imageOption: "url", // "url" or "file"
    imageUrl: "",
    imageFile: null,
  });

  const categories = [
    "Cầu lông",
    "Tennis",
    "Quần áo",
    "Giày thể thao",
    "Phụ kiện",
    "Khác",
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    // Check if we use token auth for upload
    const token = localStorage.getItem("token"); // or import from auth state
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const res = await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data.fileUrl || res.data.url || res.data; // adjust based on backend response
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.imageUrl;

      if (formData.imageOption === "file" && formData.imageFile) {
        setIsUploading(true);
        // Upload logic
        const url = await uploadImage(formData.imageFile);
        finalImageUrl = typeof url === "string" ? url : url.url; // Handle potential response schemas
        setIsUploading(false);
      }

      const productPayload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock, 10),
        imageUrl: finalImageUrl,
      };

      if (formData.type === "SALE") {
        productPayload.salePrice = parseFloat(formData.salePrice);
      } else {
        productPayload.rentalPrice = parseFloat(formData.rentalPrice);
        productPayload.depositFee = parseFloat(formData.depositFee);
      }

      await createProduct(productPayload).unwrap();

      if (onProductCreated) {
        onProductCreated();
      }
      onClose(); // Close modal on success

      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "SALE",
        category: "Cầu lông",
        brand: "",
        salePrice: "",
        rentalPrice: "",
        depositFee: "",
        stock: "1",
        imageOption: "url",
        imageUrl: "",
        imageFile: null,
      });
    } catch (err) {
      console.error("Failed to create product:", err);
      setIsUploading(false);
      alert(
        err.data?.message || err.message || "Đã xảy ra lỗi khi tạo sản phẩm",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Thêm Sản phẩm mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form
            id="addProductForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Ví dụ: Vợt cầu lông Yonex"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Ví dụ: Yonex"
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số lượng kho *
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại hình kinh doanh *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="SALE"
                    checked={formData.type === "SALE"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="font-medium text-gray-700">
                    Bán đứt (Sale)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="RENTAL"
                    checked={formData.type === "RENTAL"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="font-medium text-gray-700">
                    Cho thuê (Rental)
                  </span>
                </label>
              </div>
            </div>

            {/* Pricing Details based on Type */}
            {formData.type === "SALE" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Giá bán (VNĐ) *
                </label>
                <input
                  type="number"
                  name="salePrice"
                  min="0"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Ví dụ: 1500000"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Giá thuê / ngày (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="rentalPrice"
                    min="0"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Ví dụ: 50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1">
                    Phí cọc (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="depositFee"
                    min="0"
                    value={formData.depositFee}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Ví dụ: 1000000"
                  />
                </div>
              </div>
            )}

            {/* Image */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Hình ảnh sản phẩm *
              </label>
              <div className="flex gap-4 mb-3 pb-3 border-b border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageOption"
                    value="url"
                    checked={formData.imageOption === "url"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Sử dụng URL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageOption"
                    value="file"
                    checked={formData.imageOption === "file"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">
                    Tải lên từ máy tính
                  </span>
                </label>
              </div>

              {formData.imageOption === "url" ? (
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                placeholder="Nhập mô tả chi tiết sản phẩm..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isCreating || isUploading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="addProductForm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isCreating || isUploading}
          >
            {isUploading
              ? "Đang tải ảnh..."
              : isCreating
                ? "Đang tạo..."
                : "Lưu Sản phẩm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
