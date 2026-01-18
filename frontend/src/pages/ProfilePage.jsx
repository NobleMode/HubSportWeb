import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import Button from '../components/common/Button';

/**
 * Profile Page
 * Displays logged-in user's information
 */
const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="bg-primary-600 px-6 py-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold uppercase mx-auto mb-4 shadow-lg">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'User'}</h2>
            <p className="text-primary-100">{user.email}</p>
        </div>
        
        <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Account Details</h3>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase mb-1">Email Address</label>
                    <p className="text-gray-900 text-lg">{user.email}</p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase mb-1">Full Name</label>
                    <p className="text-gray-900 text-lg">{user.name || 'Not provided'}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase mb-1">Account Type</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'EXPERT' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {user.role}
                    </span>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase mb-1">Account Balance</label>
                    <p className="text-green-600 text-xl font-bold">{user.balance?.toLocaleString('vi-VN') || 0} VND</p>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase mb-1">Member Since</label>
                    <p className="text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="outline" onClick={() => alert('Edit Profile coming soon!')}>
                    Edit Profile
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
