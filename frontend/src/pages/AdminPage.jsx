import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import DiscountManagement from '../components/admin/DiscountManagement';

/**
 * Admin Page (Protected - Admin Only)
 */
const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview setActiveTab={setActiveTab} />;
            case 'products':
                return <ProductManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'users':
                return <UserManagement />;
            case 'discounts':
                return <DiscountManagement />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPage;
