import React, { useState } from 'react';
import {
  useGetShopEarningsQuery,
  useGetWithdrawalHistoryQuery,
  useRequestWithdrawalMutation,
} from '../../services/shopEarningsApi';
import { useToast } from '../../context/ToastContext';

/**
 * Shop Earnings Dashboard Component
 * Displays shop earnings, balance, and withdrawal management
 */
const ShopEarningsDashboard = ({ shopId }) => {
  const { showToast } = useToast();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  // Queries
  const { data: earningsData, isLoading: isLoadingEarnings } = useGetShopEarningsQuery(shopId);
  const { data: historyData, isLoading: isLoadingHistory } = useGetWithdrawalHistoryQuery({
    shopId,
    page: 1,
    limit: 10,
  });

  // Mutations
  const [requestWithdrawal, { isLoading: isRequestingWithdrawal }] = useRequestWithdrawalMutation();

  const earnings = earningsData?.data;
  const history = historyData?.data?.data || [];

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();

    if (!withdrawalForm.amount || !withdrawalForm.bankName || !withdrawalForm.accountNumber || !withdrawalForm.accountName) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await requestWithdrawal({
        shopId,
        withdrawalData: {
          amount: parseFloat(withdrawalForm.amount),
          bankName: withdrawalForm.bankName,
          accountNumber: withdrawalForm.accountNumber,
          accountName: withdrawalForm.accountName,
        },
      }).unwrap();

      showToast('Withdrawal request submitted successfully!', 'success');
      setIsWithdrawalModalOpen(false);
      setWithdrawalForm({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
      });
    } catch (err) {
      showToast(err?.data?.message || 'Failed to request withdrawal', 'error');
    }
  };

  if (isLoadingEarnings) {
    return <div className="text-center py-8">Loading earnings data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings & Withdrawals</h2>
          <p className="text-gray-600 mt-1">Manage your shop earnings and request withdrawals</p>
        </div>
        <button
          onClick={() => setIsWithdrawalModalOpen(true)}
          disabled={!earnings || earnings.availableBalance <= 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          Request Withdrawal
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Balance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Balance</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {earnings ? (earnings.currentBalance || 0).toLocaleString('vi-VN') : 0}đ
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Available Balance</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {earnings ? (earnings.availableBalance || 0).toLocaleString('vi-VN') : 0}đ
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {earnings ? (earnings.totalEarnings || 0).toLocaleString('vi-VN') : 0}đ
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Platform Fee (10%)</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {earnings ? (earnings.totalPlatformFees || 0).toLocaleString('vi-VN') : 0}đ
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> You receive 90% of each order value. 10% platform fee is deducted automatically. You can request withdrawal anytime. Admin will review and process your request within 1-2 business days.
        </p>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Withdrawal History</h3>
        {isLoadingHistory ? (
          <p className="text-center text-gray-500 py-8">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No withdrawal requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {withdrawal.amount.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          withdrawal.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : withdrawal.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : withdrawal.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{withdrawal.bankName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">****{withdrawal.accountNumber?.slice(-4)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(withdrawal.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Request Modal */}
      {isWithdrawalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Withdrawal</h3>
            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount (đ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={withdrawalForm.amount}
                  onChange={handleWithdrawalChange}
                  min="0"
                  step="1000"
                  max={earnings?.availableBalance}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {earnings ? (earnings.availableBalance || 0).toLocaleString('vi-VN') : 0}đ
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={withdrawalForm.bankName}
                  onChange={handleWithdrawalChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Vietcombank"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={withdrawalForm.accountNumber}
                  onChange={handleWithdrawalChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={withdrawalForm.accountName}
                  onChange={handleWithdrawalChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsWithdrawalModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequestingWithdrawal}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {isRequestingWithdrawal ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopEarningsDashboard;
