import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUsersQuery, useUpdateUserRoleMutation } from '../../services/userApi';
import { selectCurrentUser } from '../../features/auth/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';

const UserManagement = () => {
    const { data, isLoading, error } = useGetUsersQuery();
    const currentUser = useSelector(selectCurrentUser);
    const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleToUpdate, setRoleToUpdate] = useState('');

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setRoleToUpdate(user.role);
        setIsModalOpen(true);
    };

    const handleSaveRole = async () => {
        if (!selectedUser) return;
        try {
            await updateUserRole({ id: selectedUser.id, role: roleToUpdate }).unwrap();
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role');
        }
    };

    const users = data?.data || [];

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (error) return <div className="text-red-500">Error loading users</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>

            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search by Name or Email..." 
                    className="input-field max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr 
                                key={user.id} 
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleRowClick(user)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'EXPERT' ? 'bg-indigo-100 text-indigo-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.balance?.toLocaleString('vi-VN')} VND
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="User Details"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold">{selectedUser.name}</h4>
                                <p className="text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500 block">Phone</span>
                                <span className="font-medium">{selectedUser.phone || 'N/A'}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500 block">Address</span>
                                <span className="font-medium truncate" title={selectedUser.address}>{selectedUser.address || 'N/A'}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500 block">Joined Date</span>
                                <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500 block">Balance</span>
                                <span className="font-medium">{selectedUser.balance?.toLocaleString('vi-VN')} VND</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Role
                            </label>
                            <select
                                value={roleToUpdate}
                                onChange={(e) => setRoleToUpdate(e.target.value)}
                                disabled={selectedUser.id === currentUser?.id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="EXPERT">EXPERT</option>
                                <option value="SHIPPER">SHIPPER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            {selectedUser.id === currentUser?.id && (
                                <p className="text-sm text-red-500 mt-1">
                                    You cannot change your own role.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRole}
                                disabled={isUpdating || selectedUser.id === currentUser?.id}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
