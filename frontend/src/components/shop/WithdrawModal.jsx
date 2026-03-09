import { useState } from "react";
import { useRequestWithdrawalMutation } from "../../services/shopApi";
import { useToast } from "../../context/ToastContext";

const WithdrawModal = ({ isOpen, onClose, currentBalance }) => {
  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const amount = parseFloat(formData.amount);

      if (amount < 50000) {
        showToast("Số tiền rút tối thiểu là 50,000 VND", "error");
        return;
      }

      if (amount > currentBalance) {
        showToast("Số dư không đủ", "error");
        return;
      }

      await requestWithdrawal({
        amount,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      }).unwrap();

      showToast("Yêu cầu rút tiền đã được gửi thành công!", "success");
      setFormData({
        amount: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });
      onClose();
    } catch (err) {
      showToast(err.data?.message || "Có lỗi xảy ra khi rút tiền", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-electricBlue to-limeGreen">
          <h2 className="text-xl font-bold text-white">Rút tiền</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
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
        <div className="p-6">
          <div className="mb-6 p-4 bg-limeGreen/10 rounded-xl border border-limeGreen/20">
            <p className="text-sm text-gray-600 mb-1">Số dư khả dụng</p>
            <p className="text-2xl font-black text-limeGreen">
              {currentBalance?.toLocaleString("vi-VN")}đ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số tiền rút (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min="50000"
                step="1000"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                placeholder="Tối thiểu 50,000 VND"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên ngân hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                placeholder="VD: Vietcombank"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                placeholder="Nhập số tài khoản"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên chủ tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none"
                placeholder="VD: NGUYEN VAN A"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-electricBlue to-limeGreen text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Yêu cầu rút tiền sẽ được xử lý trong vòng 24-48 giờ làm việc
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
