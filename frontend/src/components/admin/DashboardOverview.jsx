import { useMemo } from 'react';
import { useGetProductsQuery } from '../../services/productApi';
import { useGetAllOrdersQuery } from '../../services/orderApi';
import { useGetUsersQuery } from '../../services/userApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
        className={`bg-white rounded-lg shadow-sm p-6 flex items-center ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={onClick}
    >
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const DashboardOverview = ({ setActiveTab }) => {
    const { data: productsData, isLoading: pLoading } = useGetProductsQuery();
    const { data: ordersData, isLoading: oLoading } = useGetAllOrdersQuery();
    const { data: usersData, isLoading: uLoading } = useGetUsersQuery();

    const recentOrdersData = useMemo(() => {
        if (!ordersData?.data) return [];
        
        // Get last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const ordersByDate = ordersData.data.reduce((acc, order) => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return last7Days.map(date => ({
            date: date.split('-').slice(1).join('/'), // MM/DD
            orders: ordersByDate[date] || 0
        }));
    }, [ordersData]);

    const popularProductsData = useMemo(() => {
        if (!ordersData?.data) return [];
        
        const productSales = {};
        
        ordersData.data.forEach(order => {
            if (order.status !== 'CANCELLED') {
                const items = order.orderItems || order.shopOrders?.flatMap(so => so.orderItems) || [];
                items.forEach(item => {
                    const productName = item.product?.name || 'Unknown';
                    productSales[productName] = (productSales[productName] || 0) + item.quantity;
                });
            }
        });

        return Object.entries(productSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
   }, [ordersData]);

    if (pLoading || oLoading || uLoading) return <LoadingSpinner />;

    const productsCount = productsData?.data?.length || 0;
    const ordersCount = ordersData?.data?.length || 0;
    const usersCount = usersData?.data?.length || 0;
    
    // Calculate total revenue and total deposits from orders
    const { totalRevenue, totalDeposits } = ordersData?.data?.reduce((acc, order) => {
        if (order.status !== 'CANCELLED') {
            acc.totalRevenue += order.totalAmount || 0;
            acc.totalDeposits += order.totalDeposit || 0;
        }
        return acc;
    }, { totalRevenue: 0, totalDeposits: 0 }) || { totalRevenue: 0, totalDeposits: 0 };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard 
                    title="Total Orders" 
                    value={ordersCount} 
                    icon="📋" 
                    color="bg-blue-100 text-blue-600"
                    onClick={() => setActiveTab && setActiveTab('orders')}
                />
                <StatCard 
                    title="Total Products" 
                    value={productsCount} 
                    icon="📦" 
                    color="bg-purple-100 text-purple-600" 
                    onClick={() => setActiveTab && setActiveTab('products')}
                />
                <StatCard 
                    title="Total Users" 
                    value={usersCount} 
                    icon="👥" 
                    color="bg-green-100 text-green-600" 
                    onClick={() => setActiveTab && setActiveTab('users')}
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`${(totalRevenue / 1000).toLocaleString()}k ₫`} 
                    icon="💰" 
                    color="bg-yellow-100 text-yellow-600" 
                    onClick={() => setActiveTab && setActiveTab('orders')}
                />
                <StatCard 
                    title="Total Deposits Held" 
                    value={`${(totalDeposits / 1000).toLocaleString()}k ₫`} 
                    icon="🛡️" 
                    color="bg-indigo-100 text-indigo-600" 
                    onClick={() => setActiveTab && setActiveTab('orders')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Orders (Last 7 Days)</h3>
                    <div className="h-80 w-full">
                        {recentOrdersData.length > 0 && ordersCount > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={recentOrdersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="orders" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-4xl mb-2">📊</span>
                                <p>No orders in the last 7 days</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Top 5 Popular Products</h3>
                     <div className="h-80 w-full">
                        {popularProductsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={popularProductsData} 
                                    layout="vertical" 
                                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" axisLine={false} tickLine={false} />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        width={140} 
                                        tick={{fontSize: 12}} 
                                        axisLine={false} 
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar 
                                        dataKey="sales" 
                                        name="Units Sold" 
                                        fill="#8b5cf6" 
                                        radius={[0, 4, 4, 0]}
                                        barSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-4xl mb-2">📦</span>
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
