import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/authApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const { data: user, isLoading: isUserLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    balance: 0,
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(user)
    if (user) {
        const data= user.data
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        email: data.email || '',
        balance: data.balance || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }).unwrap();
      
      setMessage('Profile updated successfully!');
      refetch();
    } catch (err) {
      setError(err.data?.message || 'Failed to update profile.');
    }
  };

  if (isUserLoading) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          <p className="text-primary-100">Manage your account information</p>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar / Read-only info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Account Details
                </h3>
                <div className="space-y-3">
                    <div>
                        <span className="block text-xs text-gray-400">Email</span>
                        <span className="font-medium text-gray-800 break-words">{formData.email}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-400">Balance</span>
                        <span className="font-bold text-green-600">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.balance)}
                        </span>
                    </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="+84..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="input-field w-full"
                                placeholder="123 Street, District, City..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
