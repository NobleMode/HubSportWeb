import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/common/Button";

/**
 * Order Success Page
 * Displayed after successful checkout
 */
const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Confetti animation or celebration effect could be added here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
        {/* Success Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-200 rounded-full opacity-20 -z-10"></div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Thank you for your order. We have received your request and will
            process it shortly.
          </p>
          {orderData?.orderId && (
            <p className="text-sm text-gray-500 mt-4">
              Order ID:{" "}
              <span className="font-mono font-semibold text-blue-600">
                #{orderData.orderId}
              </span>
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What's Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                We will contact you via phone/email to confirm the order details
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Your order will be prepared and shipped within 1-2 business days
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                You will receive a tracking number once your order is shipped
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate("/orders")}
            variant="outline"
            className="px-8"
          >
            View Order History
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@hubsport.com"
              className="text-blue-600 hover:underline font-medium"
            >
              support@hubsport.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
