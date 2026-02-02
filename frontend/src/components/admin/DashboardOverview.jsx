import React from 'react';
import { useGetProductsQuery } from '../../services/productApi';
import { useGetAllOrdersQuery } from '../../services/orderApi';
import { useGetUsersQuery } from '../../services/userApi';
import LoadingSpinner from '../common/LoadingSpinner';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const DashboardOverview = () => {
    const { data: productsData, isLoading: pLoading } = useGetProductsQuery();
    const { data: ordersData, isLoading: oLoading } = useGetAllOrdersQuery();
    const { data: usersData, isLoading: uLoading } = useGetUsersQuery();

    if (pLoading || oLoading || uLoading) return <LoadingSpinner />;

    const productsCount = productsData?.data?.length || 0;
    const ordersCount = ordersData?.data?.length || 0;
    const usersCount = usersData?.data?.length || 0;
    
    // Calculate total revenue from orders (simplified)
    const totalRevenue = ordersData?.data?.reduce((acc, order) => {
        return order.status !== 'CANCELLED' ? acc + order.totalAmount : acc;
    }, 0) || 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Orders" 
                    value={ordersCount} 
                    icon="📋" 
                    color="bg-blue-100 text-blue-600" 
                />
                <StatCard 
                    title="Total Products" 
                    value={productsCount} 
                    icon="📦" 
                    color="bg-purple-100 text-purple-600" 
                />
                <StatCard 
                    title="Total Users" 
                    value={usersCount} 
                    icon="👥" 
                    color="bg-green-100 text-green-600" 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`${(totalRevenue / 1000000).toFixed(1)}M VND`} 
                    icon="💰" 
                    color="bg-yellow-100 text-yellow-600" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                    <div className="text-gray-500 text-center py-8">
                        Chart placeholder
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Popular Products</h3>
                     <div className="text-gray-500 text-center py-8">
                        Chart placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
