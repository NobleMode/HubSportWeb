import React, { useState } from 'react';
import {
  useGetAllWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useCompleteWithdrawalMutation,
  useRejectWithdrawalMutation,
  useGetPlatformStatisticsQuery,
} from '../../services/shopEarningsApi';
import { useToast } from '../../context/ToastContext';

/**
 * Withdrawal Management Component (Admin)
 * Manage shop withdrawal requests
 */
const WithdrawalManagement = () => {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, withdrawal: null, reason: '' });

  // Queries
  const { data: withdrawalsData, isLoading: isLoadingWithdrawals, refetch } = useGetAllWithdrawalsQuery({
    status: statusFilter,
    page,
    limit: 20,
  });
  const { data: statsData } = useGetPlatformStatisticsQuery();

  // Mutations
  const [approveWithdrawal] = useApproveWithdrawalMutation();
  const [completeWithdrawal] = useCompleteWithdrawalMutation();
  const [rejectWithdrawal] = useRejectWithdrawalMutation();

  const withdrawals = withdrawalsData?.data?.data || [];
  const pagination = withdrawalsData?.data?.pagination;
  const stats = statsData?.data;

  const handleApprove = async (withdrawalId) => {
    try {
      await approveWithdrawal(withdrawalId).unwrap();
      showToast('Withdrawal approved successfully!', 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to approve withdrawal', 'error');
    }
  };

  const handleComplete = async (withdrawalId) => {
    try {
      await completeWithdrawal(withdrawalId).unwrap();
      showToast('Withdrawal marked as completed!', 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to complete withdrawal', 'error');
    }
  };

  const handleRejectClick = (withdrawal) => {
    setRejectModal({ isOpen: true, withdrawal, reason: '' });
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal.reason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    try {
      await rejectWithdrawal({
        withdrawalId: rejectModal.withdrawal.id,
        reason: rejectModal.reason,
      }).unwrap();
      showToast('Withdrawal rejected!', 'success');
      setRejectModal({ isOpen: false, withdrawal: null, reason: '' });
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to reject withdrawal', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total Platform Fees</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {(stats.totalPlatformFees || 0).toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total Shop Earnings</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {(stats.totalShopEarnings || 0).toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total Withdrawn</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {(stats.totalWithdrawn || 0).toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Active Shops</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">{stats.totalShops || 0}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h2>
          <p className="text-gray-600 mt-1">Review and process shop withdrawal requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoadingWithdrawals ? (
          <div className="text-center py-12 text-gray-500">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No withdrawal requests found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shop</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Bank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Requested</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{withdrawal.shop?.name}</p>
                          <p className="text-sm text-gray-500">{withdrawal.shop?.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {withdrawal.amount.toLocaleString('vi-VN')}đ
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{withdrawal.bankName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ****{withdrawal.accountNumber?.slice(-4)}
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(withdrawal.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {withdrawal.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(withdrawal.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClick(withdrawal)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {withdrawal.status === 'APPROVED' && (
                            <button
                              onClick={() => handleComplete(withdrawal.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Withdrawal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Withdrawal: <strong>{rejectModal.withdrawal?.amount.toLocaleString('vi-VN')}đ</strong>
            </p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal({ isOpen: false, withdrawal: null, reason: '' })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement;
