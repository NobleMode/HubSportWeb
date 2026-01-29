import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectTotalAmount,
  selectTotalDeposit,
  updateQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import Button from "../components/common/Button";

/**
 * Cart Page
 * Displays shopping cart items and totals
 */
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalDeposit = useSelector(selectTotalDeposit);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // Placeholder for coupon functionality
    alert("Coupon functionality coming soon!");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back to Collection */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
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
          Back to Collection
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Table */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b bg-gray-50 font-semibold text-gray-700 text-sm">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Info */}
                    <div className="col-span-5 flex items-center w-full gap-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-8 h-8"
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
                        <h3 className="font-bold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            item.type === "RENTAL"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type === "RENTAL" ? "RENTAL" : "SALE"}
                        </span>
                        {item.type === "RENTAL" && (
                          <p className="text-xs text-gray-500 mt-1">
                            Deposit: {item.depositFee?.toLocaleString("vi-VN")}{" "}
                            VND
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center w-full md:w-auto">
                      <div className="flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-700">
                          Price:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {item.type === "RENTAL"
                            ? `${item.rentalPrice?.toLocaleString("vi-VN")} VND`
                            : `${item.salePrice?.toLocaleString("vi-VN")} VND`}
                        </span>
                      </div>
                      {item.type === "RENTAL" && (
                        <span className="text-xs text-gray-500">/Day</span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex items-center w-full md:w-auto justify-between md:justify-center">
                   
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: Math.max(1, item.quantity - 1),
                              }),
                            )
                          }
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-center min-w-[40px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Actions */}
                    <div className="col-span-2 text-right w-full md:w-auto">
                      <div className="flex justify-between md:block items-center">
                        <span className="md:hidden font-semibold text-gray-700">
                          Subtotal:
                        </span>
                        <div className="flex items-center gap-3 md:justify-end">
                          <div className="font-bold text-blue-600 text-lg">
                            {item.type === "RENTAL"
                              ? (
                                  item.rentalPrice *
                                  (item.rentalDays || 1) *
                                  item.quantity
                                ).toLocaleString("vi-VN")
                              : (item.salePrice * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}{" "}
                            VND
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 text-right w-full md:w-auto">
                      <div className="flex justify-between md:block items-center">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4">
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to clear your cart?")
                  ) {
                    cartItems.forEach((item) =>
                      dispatch(removeFromCart(item.id)),
                    );
                  }
                }}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {totalAmount.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                {totalDeposit > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Total Deposit</span>
                    <span className="font-semibold">
                      {totalDeposit.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {(totalAmount + totalDeposit).toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 mb-6"
              >
                Proceed to Checkout
              </Button>

              {/* Coupon Section */}
              <div className="border-t pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Have a coupon?
                </p>
                <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="px-6 text-sm"
                  >
                    Apply
                  </Button>
                </form>
                <p className="text-xs text-blue-600 font-medium">
                  Try:{" "}
                  <span className="bg-blue-50 px-2 py-1 rounded">SAVE10</span>,{" "}
                  <span className="bg-blue-50 px-2 py-1 rounded">SAVE20</span>,
                  or{" "}
                  <span className="bg-blue-50 px-2 py-1 rounded">WELCOME</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
