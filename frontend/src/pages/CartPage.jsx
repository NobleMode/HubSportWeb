import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectTotalAmount,
  selectTotalDeposit,
  updateQuantity,
  removeFromCart,
} from '../features/cart/cartSlice';
import Button from '../components/common/Button';

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
    alert('Coupon functionality coming soon!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-semibold text-gray-700">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center w-full">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.type}</p>
                      {item.type === 'RENTAL' && (
                         <p className="text-xs text-gray-500">Deposit: {item.depositFee?.toLocaleString('vi-VN')} VND</p>
                      )}
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 text-sm hover:text-red-700 mt-1 md:hidden"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:block">
                    <span className="md:hidden font-semibold">Price:</span>
                    <span>
                      {item.type === 'RENTAL' 
                        ? `${item.rentalPrice?.toLocaleString('vi-VN')} /day` 
                        : `${item.salePrice?.toLocaleString('vi-VN')}`}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center w-full md:w-auto justify-between md:justify-center">
                     <span className="md:hidden font-semibold">Qty:</span>
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-center min-w-[30px]">{item.quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block">
                     <span className="md:hidden font-semibold">Subtotal:</span>
                    <div className="font-bold text-primary-600">
                      {item.type === 'RENTAL'
                        ? ((item.rentalPrice * (item.rentalDays || 1) * item.quantity).toLocaleString('vi-VN'))
                        : ((item.salePrice * item.quantity).toLocaleString('vi-VN'))}
                    </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-700 text-sm hidden md:block text-right ml-auto mt-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
           <div className="mt-6">
                <Button onClick={() => navigate('/products')} variant="outline" className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                </Button>
            </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{totalAmount.toLocaleString('vi-VN')} VND</span>
              </div>
              {totalDeposit > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Total Deposit</span>
                  <span>{totalDeposit.toLocaleString('vi-VN')} VND</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{(totalAmount + totalDeposit).toLocaleString('vi-VN')} VND</span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} className="w-full py-3 text-lg mb-4">
              Proceed to Checkout
            </Button>

            <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Have a coupon?</p>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Coupon code" 
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <Button type="submit" variant="secondary" className="px-4 text-sm">Apply</Button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
