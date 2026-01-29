import React from 'react';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../services/orderApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

/**
 * Order History Page
 * Displays a list of user's past orders
 */
const OrderHistoryPage = () => {
    const { data, isLoading, error } = useGetMyOrdersQuery();
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const orders = data?.data || [];

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelOrder(orderId).unwrap();
                showToast('Order cancelled successfully', 'success');
            } catch (err) {
                console.error('Failed to cancel order:', err);
                showToast(err.data?.message || 'Failed to cancel order', 'error');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading orders: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">You have n't placed any orders yet.</p>
                    <Button onClick={() => navigate('/products')}>Start Shopping</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">{order.id.slice(0, 8)}...</span></p>
                                    <p className="text-sm text-gray-500">Placed on: <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                        {order.status === 'PENDING' && (
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-1 text-xs h-auto"
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={isCancelling}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                    <p className="font-bold text-lg text-primary-600">
                                        Total: {(order.totalAmount + order.totalDeposit).toLocaleString('vi-VN')} VND
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center flex-1">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
                                                    {item.product?.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.isRental ? `Rental (${item.rentalDays} days)` : 'Sale'} | Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    {(item.price * (item.isRental ? (item.rentalDays || 1) : 1) * item.quantity).toLocaleString('vi-VN')} VND
                                                </p>
                                                {item.depositFee > 0 && (
                                                    <p className="text-xs text-gray-500">Deposit: {item.depositFee.toLocaleString('vi-VN')} VND</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {order.shippingAddress && (
                                    <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                        <p><span className="font-medium">Shipping to:</span> {order.shippingAddress}</p>
                                        {order.billingAddress && <p className="mt-1"><span className="font-medium">Billing to:</span> {order.billingAddress}</p>}
                                        {order.notes && <p className="mt-1"><span className="font-medium">Note:</span> {order.notes}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
