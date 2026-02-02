import React, { useState } from 'react';
import { useGetAllOrdersQuery, useCancelOrderMutation } from '../../services/orderApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import AdminOrderDetailsModal from './AdminOrderDetailsModal';

const OrderManagement = () => {
    const { data, isLoading, error } = useGetAllOrdersQuery();
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = data?.data || [];
    
    // Filter orders
    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCancel = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelOrder(orderId).unwrap();
                showToast('Order cancelled successfully', 'success');
            } catch (err) {
                showToast('Failed to cancel order', 'error');
            }
        }
    };

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (error) return <div className="text-red-500">Error loading orders</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>
            
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search by Order ID, Name or Email..." 
                    className="input-field max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Fee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(order.totalAmount).toLocaleString('vi-VN')} VND
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.totalDeposit > 0 ? `${order.totalDeposit.toLocaleString('vi-VN')} VND` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="mr-2"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        Details
                                    </Button>
                                    {order.status === 'PENDING' && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleCancel(order.id)}
                                            size="sm"
                                            className="text-red-600 hover:text-red-900"
                                            disabled={isCancelling}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
            {/* Order Details Modal */}
            {selectedOrder && (
                <AdminOrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                    onUpdate={() => {
                        // Ideally trigger a refetch here if needed, or rely on RTK Query cache invalidation
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default OrderManagement;
