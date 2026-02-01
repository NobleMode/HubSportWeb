import React, { useState } from 'react';
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../services/couponApi';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const CouponManagementPage = () => {
    const { data: coupons, isLoading, refetch } = useGetCouponsQuery();
    const [createCoupon] = useCreateCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        usageLimit: '',
        perUserLimit: 1,
        isActive: true
    });

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                ...coupon,
                startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
                endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
                usageLimit: coupon.usageLimit || '',
                maxDiscountAmount: coupon.maxDiscountAmount || 0,
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                description: '',
                discountType: 'PERCENTAGE',
                discountValue: 0,
                minOrderValue: 0,
                maxDiscountAmount: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                usageLimit: '',
                perUserLimit: 1,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minOrderValue: parseFloat(formData.minOrderValue),
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                perUserLimit: formData.perUserLimit ? parseInt(formData.perUserLimit) : null,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            if (editingCoupon) {
                await updateCoupon({ id: editingCoupon.id, ...payload }).unwrap();
                showToast('Coupon updated successfully', 'success');
            } else {
                await createCoupon(payload).unwrap();
                showToast('Coupon created successfully', 'success');
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            showToast(error?.data?.message || 'Failed to save coupon', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await deleteCoupon(id).unwrap();
                showToast('Coupon deleted successfully', 'success');
                refetch();
            } catch (error) {
                showToast('Failed to delete coupon', 'error');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupon Management</h1>
                <Button onClick={() => handleOpenModal()}>Create Coupon</Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons?.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()}đ`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'No Expiry'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(coupon)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(coupon.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input type="text" name="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select name="discountType" value={formData.discountType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2">
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                                        <option value="SHIPPING">Shipping</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Value</label>
                                    <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min Order Value</label>
                                    <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                            </div>
                            
                            {formData.discountType === 'PERCENTAGE' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Discount Amount</label>
                                    <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Global Usage Limit</label>
                                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Unlimited" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Limit Per User</label>
                                    <input type="number" name="perUserLimit" value={formData.perUserLimit} onChange={handleChange} placeholder="Default 1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" rows="3"></textarea>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                    Cancel
                                </button>
                                <Button type="submit">
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagementPage;
