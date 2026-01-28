import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

/**
 * Checkout Page
 * Handles shipping information and mock payment
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

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'CASH',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const finalTotal = totalAmount + totalDeposit;
  const isWalletInsufficient = formData.paymentMethod === 'WALLET' && user?.balance < finalTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isWalletInsufficient) return;
    
    setIsSubmitting(true);

    try {
        const orderData = {
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price || item.salePrice || item.rentalPrice, // Fallback logic
                depositFee: item.depositFee,
                type: item.type,
                rentalDays: item.rentalDays
            })),
            totalAmount,
            totalDeposit,
            paymentMethod: formData.paymentMethod,
            shippingAddress: `${formData.address}, ${formData.city}`,
            notes: formData.note ? `${formData.note} | Contact: ${formData.fullName}, ${formData.email}, ${formData.phone}` : `Contact: ${formData.fullName}, ${formData.email}, ${formData.phone}`
        };

        await createOrder(orderData).unwrap();
        
        dispatch(clearCart());
        navigate('/order-success');
    } catch (err) {
        console.error('Failed to place order:', err);
        alert(err.data?.message || 'Failed to place order. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="+84 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ho Chi Minh City"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="input-field"
                placeholder="123 Street Name, Ward, District"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Note (Optional)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="2"
                className="input-field"
                placeholder="Notes about your order, e.g. special notes for delivery."
              ></textarea>
            </div>

            <h2 className="text-xl font-bold mb-4 border-b pb-2 mt-8">Payment Method</h2>
             <div className="space-y-4">
                <div className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'CASH' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                    <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="CASH"
                        checked={formData.paymentMethod === 'CASH'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="cash" className="ml-3 block font-medium text-gray-900 w-full cursor-pointer">
                         Cash on Delivery / Pay at Store
                    </label>
                </div>

                <div className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'WALLET' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                    <input
                        type="radio"
                        id="wallet"
                        name="paymentMethod"
                        value="WALLET"
                        checked={formData.paymentMethod === 'WALLET'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex flex-col cursor-pointer w-full">
                         <label htmlFor="wallet" className="block font-medium text-gray-900 cursor-pointer">
                             Pay with Wallet
                         </label>
                         <span className="text-sm text-gray-500">
                             Current Balance: <span className="font-bold text-green-600">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.balance || 0)}
                             </span>
                         </span>
                    </div>
                </div>
             </div>
             
             {isWalletInsufficient && (
                 <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                     Insufficient wallet balance. Please choose another payment method or top up your wallet.
                 </div>
             )}
             
             <div className="mt-8">
                 <Button 
                    type="submit" 
                    className="w-full py-3 text-lg"
                    disabled={isSubmitting || isWalletInsufficient}
                 >
                     {isSubmitting ? 'Processing...' : `Place Order • ${finalTotal.toLocaleString('vi-VN')} VND`}
                 </Button>
             </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            
            <div className="max-h-96 overflow-y-auto mb-4 pr-1">
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between py-3 border-b last:border-0 border-gray-100">
                         <div className="flex items-start">
                             <div className="w-12 h-12 bg-gray-100 rounded mr-3 overflow-hidden flex-shrink-0">
                                 {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                             </div>
                             <div>
                                 <p className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</p>
                                 <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="font-medium text-sm text-gray-900">
                                 {item.type === 'RENTAL' 
                                    ? ((item.rentalPrice * (item.rentalDays || 1) * item.quantity).toLocaleString('vi-VN'))
                                    : ((item.salePrice * item.quantity).toLocaleString('vi-VN'))}
                             </p>
                         </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 space-y-2">
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
              <div className="flex justify-between text-gray-600 border-b pb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-2">
                <span>Total</span>
                <span className="text-primary-600">{(totalAmount + totalDeposit).toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
