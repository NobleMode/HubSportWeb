import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

/**
 * Admin Page (Protected - Admin Only)
 */
const AdminPage = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
        <p className="text-gray-600">
          This is the admin dashboard. Here you can manage products, users, orders, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-4">
            Add, edit, or remove products from the catalog
          </p>
          <button className="btn-primary">
            Go to Products
          </button>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600 mb-4">
            View and manage user accounts and roles
          </p>
          <button className="btn-primary">
            Go to Users
          </button>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">View Orders</h3>
          <p className="text-gray-600 mb-4">
            Track and manage customer orders
          </p>
          <button className="btn-primary">
            Go to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
