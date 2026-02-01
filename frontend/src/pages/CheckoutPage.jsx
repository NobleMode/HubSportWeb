import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectTotalAmount,
  selectTotalDeposit,
  clearCart,
} from '../features/cart/cartSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useCreateOrderMutation } from '../services/orderApi';
import { useGetProfileQuery } from '../services/authApi';
import Button from '../components/common/Button';
import { getImageUrl } from '../utils/imageUtils';
import { useToast } from '../context/ToastContext';

/**
 * Checkout Page
 * 3-step checkout: Shipping, Payment, Review
 */
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalDeposit = useSelector(selectTotalDeposit);
  const currentUser = useSelector(selectCurrentUser);
  
  // Fetch fresh profile data to ensure balance is up to date
  const { data: profileResponse } = useGetProfileQuery();
  const user = profileResponse?.data || currentUser;

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Shipping
    shippingFullName: user?.name || "",
    shippingEmail: user?.email || "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    // Other
    note: "",
    paymentMethod: "CASH",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirect if cart is empty (but not during order submission)
  React.useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      navigate("/cart");
    }
  }, [cartItems, navigate, isSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const { showToast } = useToast();

  const steps = [
    { number: 1, title: "Shipping Address" },
    { number: 2, title: "Payment Method" },
    { number: 3, title: "Review Order" },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/cart");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isWalletInsufficient) return;

    if (currentStep < 3) {
      handleNext();
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems.map((item) => {
          // Determine price based on specific type if price is not explicitly set
          let finalPrice = item.price;
          if (!finalPrice) {
            if (item.type === 'RENTAL') {
              finalPrice = item.rentalPrice;
            } else {
              finalPrice = item.salePrice;
            }
          }

          return {
            productId: item.productId || item.id, // Handle both 'id' as productId or 'productId' field
            quantity: item.quantity,
            price: finalPrice,
            depositFee: item.depositFee,
            type: item.type,
            rentalDays: item.rentalDays,
          };
        }),
        totalAmount,
        totalDeposit,
        paymentMethod: formData.paymentMethod,
        shippingAddress: `${formData.shippingAddress}, ${formData.shippingCity}`,
        billingAddress: `${formData.shippingAddress}, ${formData.shippingCity}`,
        notes: formData.note
          ? `${formData.note} | Contact: ${formData.shippingFullName}, ${formData.shippingEmail}, ${formData.shippingPhone}`
          : `Contact: ${formData.shippingFullName}, ${formData.shippingEmail}, ${formData.shippingPhone}`,
      };

      const response = await createOrder(orderData).unwrap();

      dispatch(clearCart());
      showToast('Order placed successfully!', 'success');
      console.log("chạy tới đây", response);
      navigate("/order-success", {
        state: {
          orderData: {
            orderId:
              response?.data?.id ||
              Math.random().toString(36).substr(2, 9).toUpperCase(),
            ...orderData,
          },
        },
      });
      console.log("chạy tới đây1", response);
    } catch (err) {
      console.error("Failed to place order:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "An unexpected error occurred while processing your order. Please try again.";
      showToast(errorMessage, 'error');
      // Navigate to fail page with error message
      navigate("/order-fail", {
        state: { errorMessage },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock coupon database - In production, this should be an API call
  const availableCoupons = {
    SAVE10: {
      code: "SAVE10",
      discount: 10,
      type: "percentage",
      description: "10% off",
    },
    SAVE20: {
      code: "SAVE20",
      discount: 20,
      type: "percentage",
      description: "20% off",
    },
    WELCOME: {
      code: "WELCOME",
      discount: 50000,
      type: "fixed",
      description: "50,000đ off",
    },
    FREESHIP: {
      code: "FREESHIP",
      discount: 50000,
      type: "shipping",
      description: "Free shipping",
    },
  };
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setIsApplyingCoupon(true);
    setCouponError("");

    // Simulate API call
    setTimeout(() => {
      const coupon = availableCoupons[couponCode.toUpperCase()];

      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
        setAppliedCoupon(null);
      }
      setIsApplyingCoupon(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === "percentage") {
      return Math.round(
        (totalAmount + totalDeposit) * (appliedCoupon.discount / 100),
      );
    } else if (appliedCoupon.type === "fixed") {
      return appliedCoupon.discount;
    } else if (appliedCoupon.type === "shipping") {
      return shippingFee;
    }
    return 0;
  };

  const shippingFee = 50000;
  const discount = calculateDiscount();
  const subtotalBeforeTax =
    totalAmount +
    totalDeposit +
    (appliedCoupon?.type === "shipping" ? 0 : shippingFee) -
    discount;
  const tax = Math.round(subtotalBeforeTax * 0.1);
  const finalTotal = subtotalBeforeTax + tax;
  const isWalletInsufficient = formData.paymentMethod === 'WALLET' && user?.balance < finalTotal;


  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back to Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Cart
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step.number < currentStep
                        ? "bg-green-500 text-white"
                        : step.number === currentStep
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${step.number === currentStep ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 mx-2 ${step.number < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="lg:w-2/3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100"
            >
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Shipping Address
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="shippingFullName"
                          value={formData.shippingFullName}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="shippingEmail"
                          value={formData.shippingEmail}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="shippingPhone"
                          value={formData.shippingPhone}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+84 123 456 789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ho Chi Minh City"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Street Name, Ward, District"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* QR Code Payment */}
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === "QR"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "QR" })
                      }
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          id="qr"
                          name="paymentMethod"
                          value="QR"
                          checked={formData.paymentMethod === "QR"}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              className="w-8 h-8 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                            <label
                              htmlFor="qr"
                              className="font-bold text-lg text-gray-900 cursor-pointer"
                            >
                              QR Code Payment
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 ml-11">
                            Scan QR code to pay with your mobile banking app
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === "CASH"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "CASH" })
                      }
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          id="cash"
                          name="paymentMethod"
                          value="CASH"
                          checked={formData.paymentMethod === "CASH"}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <label
                              htmlFor="cash"
                              className="font-bold text-lg text-gray-900 cursor-pointer"
                            >
                              Cash on Delivery
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 ml-11">
                            Pay with cash when your order is delivered
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Payment */}
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === "WALLET"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "WALLET" })
                      }
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          id="wallet"
                          name="paymentMethod"
                          value="WALLET"
                          checked={formData.paymentMethod === "WALLET"}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              className="w-8 h-8 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            <label
                              htmlFor="wallet"
                              className="font-bold text-lg text-gray-900 cursor-pointer"
                            >
                              Pay with Wallet
                            </label>
                          </div>
                          <span className="text-sm text-gray-600 ml-11">
                            Current Balance:{" "}
                            <span className="font-bold text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(user?.balance || 0)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Note */}
                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                    ></textarea>
                  </div>

                  {/* QR Code Display */}
                  {formData.paymentMethod === "QR" && (
                    <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
                        Scan QR Code to Pay
                      </h3>
                      <div className="flex flex-col items-center">
                        {/* QR Code Image - You can replace this with actual QR code */}
                        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                            <svg
                              className="w-48 h-48 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Bank Account Info */}
                        <div className="w-full bg-white rounded-lg p-4 border border-blue-200">
                          <h4 className="font-bold text-gray-900 mb-3 text-center">
                            Bank Account Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank:</span>
                              <span className="font-semibold text-gray-900">
                                Vietcombank
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Account Number:
                              </span>
                              <span className="font-semibold text-gray-900">
                                1234567890
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Account Name:
                              </span>
                              <span className="font-semibold text-gray-900">
                                LUONG PHAM MINH
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-bold text-blue-600 text-lg">
                                {finalTotal.toLocaleString("vi-VN")}
                                đ
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Content:</span>
                              <span className="font-semibold text-gray-900">
                                HUBSPORT {user?.id || "ORDER"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 text-center mt-4">
                          Please transfer the exact amount and include the
                          content above
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wallet Insufficient Warning */}
                  {isWalletInsufficient && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      Insufficient wallet balance. Please choose another payment method or top up your wallet.
                    </div>
                  )}
                </div>
              )}


              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Review Your Order
                  </h2>

                  <div className="space-y-6">
                    {/* Shipping Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-700">
                        {formData.shippingFullName}
                      </p>
                      <p className="text-sm text-gray-700">
                        {formData.shippingEmail} | {formData.shippingPhone}
                      </p>
                      <p className="text-sm text-gray-700">
                        {formData.shippingAddress}, {formData.shippingCity}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Payment Method
                      </h3>
                      <p className="text-sm text-gray-700 font-medium">
                        {formData.paymentMethod === "QR"
                          ? "QR Code Payment"
                          : formData.paymentMethod === "WALLET"
                            ? "Wallet Payment"
                            : "Cash on Delivery"}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
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
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Order Items ({cartItems.length})
                      </h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 bg-white rounded-lg p-3"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.imageUrl ? (
                                <img
                                  src={getImageUrl(item.imageUrl)}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm text-gray-900">
                                {item.type === "RENTAL"
                                  ? (
                                      item.rentalPrice *
                                      (item.rentalDays || 1) *
                                      item.quantity
                                    ).toLocaleString("vi-VN")
                                  : (
                                      item.salePrice * item.quantity
                                    ).toLocaleString("vi-VN")}
                                đ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-8"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : currentStep === 3
                      ? "Place Order"
                      : "Next Step"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="max-h-64 overflow-y-auto mb-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        {item.type === "RENTAL"
                          ? (
                              item.rentalPrice *
                              (item.rentalDays || 1) *
                              item.quantity
                            ).toLocaleString("vi-VN")
                          : (item.salePrice * item.quantity).toLocaleString(
                              "vi-VN",
                            )}
                        đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Have a coupon?
                </p>
                {!appliedCoupon ? (
                  <>
                    <form
                      onSubmit={handleApplyCoupon}
                      className="flex gap-2 mb-3"
                    >
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        className="px-4 text-sm"
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </Button>
                    </form>
                    {couponError && (
                      <p className="text-xs text-red-600 mb-2">{couponError}</p>
                    )}
                    <p className="text-xs text-blue-600 font-medium">
                      Try:{" "}
                      <button
                        type="button"
                        onClick={() => setCouponCode("SAVE10")}
                        className="bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        SAVE10
                      </button>
                      ,{" "}
                      <button
                        type="button"
                        onClick={() => setCouponCode("SAVE20")}
                        className="bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        SAVE20
                      </button>
                      , or{" "}
                      <button
                        type="button"
                        onClick={() => setCouponCode("WELCOME")}
                        className="bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        WELCOME
                      </button>
                    </p>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-700">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {totalDeposit > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Deposit</span>
                    <span className="font-semibold">
                      {totalDeposit.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={`font-semibold ${appliedCoupon?.type === "shipping" ? "line-through text-gray-400" : ""}`}
                  >
                    {shippingFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">
                      -{discount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">
                    {tax.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {finalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {discount > 0 && (
                  <p className="text-xs text-green-600 text-right mt-1">
                    You saved {discount.toLocaleString("vi-VN")}đ!
                  </p>
                )}
              </div>

              {/* Secure Checkout Badge */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Secure Checkout
                  </p>
                  <p className="text-xs text-green-700">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
