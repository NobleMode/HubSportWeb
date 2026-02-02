import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Manage Products', icon: '📦' },
    { id: 'orders', label: 'View Orders', icon: '📋' },
    { id: 'users', label: 'Manage Users', icon: '👥' },
  ];

  return (
    <div className="bg-white w-64 min-h-[calc(100vh-64px)] shadow-md flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-primary-50 text-primary-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          Sporthub Admin v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
