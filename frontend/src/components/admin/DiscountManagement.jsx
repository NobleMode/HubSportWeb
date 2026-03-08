import { useState } from 'react';
import { useGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../services/couponApi';
import LoadingSpinner from '../common/LoadingSpinner';

const DiscountManagement = () => {
    const { data: couponsData, isLoading, refetch } = useGetCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        isPercentage: true,
        maxDiscount: '',
        minOrderValue: '',
        usageLimit: '',
        endDate: ''
    });

    if (isLoading) return <LoadingSpinner />;

    const coupons = couponsData?.data || [];

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
            const dataToSubmit = {
                code: formData.code.toUpperCase(),
                discountValue: parseFloat(formData.discountValue),
                isPercentage: formData.isPercentage,
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            await createCoupon(dataToSubmit).unwrap();
            setIsModalOpen(false);
            setFormData({
                code: '', discountValue: '', isPercentage: true, maxDiscount: '', minOrderValue: '', usageLimit: '', endDate: ''
            });
            refetch();
        } catch (error) {
            console.error("Failed to create coupon", error);
            alert(error?.data?.message || "Failed to create coupon");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await deleteCoupon(id).unwrap();
                refetch();
            } catch(e) {
                console.error("Failed to delete", e);
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Discount Management</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    + Create Coupon
                </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-bold font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{coupon.code}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {coupon.isPercentage ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()} ₫`}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Min order: {coupon.minOrderValue.toLocaleString()} ₫
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{coupon.usageCount} / {coupon.usageLimit || '∞'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(coupon.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No coupons created yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Create New Coupon</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                <input type="text" name="code" required value={formData.code} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 uppercase" placeholder="SUMMER2026"/>
                            </div>
                            
                            <div className="flex items-center mt-2">
                                <input type="checkbox" id="isPercentage" name="isPercentage" checked={formData.isPercentage} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"/>
                                <label htmlFor="isPercentage" className="ml-2 block text-sm text-gray-900">Is Percentage Discount?</label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                                    <input type="number" name="discountValue" required value={formData.discountValue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min Order Value (₫)</label>
                                    <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Discount (₫)</label>
                                    <input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} disabled={!formData.isPercentage} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Leave blank for infinite" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isCreating} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
                                    {isCreating ? 'Creating...' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountManagement;
