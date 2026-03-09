import React, { useState } from "react";
import { useGetPendingPaymentProofsQuery, useApprovePaymentProofMutation, useRejectPaymentProofMutation } from "../../services/orderApi";
import { useToast } from "../../context/ToastContext";

/**
 * Payment Bill Review Component
 * Admin component to review and approve/reject payment bills
 */
const PaymentBillReview = () => {
  const { data: paymentProofs, isLoading, error, refetch } = useGetPendingPaymentProofsQuery();
  const [approvePaymentProof] = useApprovePaymentProofMutation();
  const [rejectPaymentProof] = useRejectPaymentProofMutation();
  const { showToast } = useToast();

  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async (proofId) => {
    setIsApproving(true);
    try {
      await approvePaymentProof(proofId).unwrap();
      showToast("Payment proof approved successfully!", "success");
      refetch();
    } catch (err) {
      console.error("Failed to approve payment proof:", err);
      showToast(err?.data?.message || "Failed to approve payment proof", "error");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = (proof) => {
    setSelectedProof(proof);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }

    setIsApproving(true);
    try {
      await rejectPaymentProof({
        proofId: selectedProof.id,
        reason: rejectReason,
      }).unwrap();
      showToast("Payment proof rejected successfully!", "success");
      setIsRejectModalOpen(false);
      setSelectedProof(null);
      refetch();
    } catch (err) {
      console.error("Failed to reject payment proof:", err);
      showToast(err?.data?.message || "Failed to reject payment proof", "error");
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading payment bills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading payment bills</p>
      </div>
    );
  }

  const proofs = paymentProofs?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Bill Review</h2>
          <p className="text-gray-600 mt-1">
            {proofs.length > 0 ? `${proofs.length} pending bill(s) for review` : "No pending bills"}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {proofs.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">All payment bills have been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proofs.map((proof) => (
            <div
              key={proof.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Bill Image */}
                <div className="flex-shrink-0">
                  {proof.billImageUrl ? (
                    <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={proof.billImageUrl}
                        alt="Payment bill"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm">No image</p>
                    </div>
                  )}
                </div>

                {/* Bill Details */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Order Details */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600">Order ID:</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {proof.order?.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Order Amount:</p>
                          <p className="font-semibold text-gray-900">
                            {(proof.order?.totalAmount || 0).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Order Status:</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-semibold">
                            {proof.order?.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Customer Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600">Name:</p>
                          <p className="font-semibold text-gray-900">
                            {proof.uploadedByUser?.name || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email:</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {proof.uploadedByUser?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Uploaded on:</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(proof.createdAt).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Bank Details</h3>
                      <div className="space-y-2 text-sm">
                        {proof.bankName && (
                          <div>
                            <p className="text-gray-600">Bank:</p>
                            <p className="font-semibold text-gray-900">{proof.bankName}</p>
                          </div>
                        )}
                        {proof.transactionId && (
                          <div>
                            <p className="text-gray-600">Transaction ID:</p>
                            <p className="font-semibold text-gray-900">{proof.transactionId}</p>
                          </div>
                        )}
                        {proof.accountNumber && (
                          <div>
                            <p className="text-gray-600">Account:</p>
                            <p className="font-semibold text-gray-900">****{proof.accountNumber}</p>
                          </div>
                        )}
                        {!proof.bankName && !proof.transactionId && !proof.accountNumber && (
                          <p className="text-gray-500 text-xs">No additional bank details provided</p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-gray-900">
                          {proof.order?.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(proof.id)}
                      disabled={isApproving}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-medium"
                    >
                      {isApproving ? "Processing..." : "✓ Approve"}{" "}
                    </button>
                    <button
                      onClick={() => handleRejectClick(proof)}
                      disabled={isApproving}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Payment Bill</h3>
            <form onSubmit={handleRejectSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Amount doesn't match, invalid receipt..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setSelectedProof(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium"
                >
                  {isApproving ? "Processing..." : "Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentBillReview;
