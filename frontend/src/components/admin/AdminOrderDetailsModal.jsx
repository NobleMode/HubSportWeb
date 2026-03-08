import { useState } from 'react';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { 
    useUpdateOrderItemImagesMutation, 
    useReportOrderItemIssueMutation,
    useUpdateOrderStatusMutation,
    useReturnOrderItemMutation
} from '../../services/orderApi';
import { getImageUrl } from '../../utils/imageUtils';

const AdminOrderDetailsModal = ({ order, onClose, onUpdate }) => {
    const { showToast } = useToast();
    const [updateImages] = useUpdateOrderItemImagesMutation();
    const [reportIssue] = useReportOrderItemIssueMutation();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
    const [returnItem] = useReturnOrderItemMutation();
    
    if (!order) return null;

    const items = order.orderItems || order.shopOrders?.flatMap(so => so.orderItems) || [];
    const rentalItems = items.filter(item => item.isRental);
    const saleItems = items.filter(item => !item.isRental);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        if (window.confirm(`Change order status to ${newStatus}?`)) {
            try {
                await updateStatus({ id: order.id, status: newStatus }).unwrap();
                showToast('Order status updated', 'success');
                if (onUpdate) onUpdate();
            } catch (err) {
                showToast('Failed to update status', 'error');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500 font-mono">#{order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Customer & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Customer</h3>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-sm text-gray-600">{order.user?.email}</p>
                            <p className="text-sm text-gray-600">{order.user?.phone}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Order Info</h3>
                            <p className="text-sm mb-1"><span className="text-gray-500">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="text-sm mb-2 text-gray-500">Status:</p>
                            <select 
                                className="w-full border-gray-300 rounded-md text-sm font-semibold p-1"
                                value={order.status}
                                onChange={handleStatusChange}
                                disabled={isUpdatingStatus}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="RETURNED">RETURNED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <p className="text-sm mt-2"><span className="text-gray-500">Payment:</span> {order.paymentMethod}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="font-semibold text-blue-800 mb-2">Financials</h3>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-blue-600">Total Order Amount:</span>
                                <span className="font-bold">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-blue-600">Total Deposit:</span>
                                <span className="font-bold">{order.totalDeposit.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-lg text-blue-900">
                                <span>Grand Total:</span>
                                <span>{(order.totalAmount + order.totalDeposit).toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    </div>

                    {/* Rental Items Section */}
                    {rentalItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Rental Items
                            </h3>
                            <div className="space-y-6">
                                {rentalItems.map(item => (
                                    <RentalItemRow 
                                        key={item.id} 
                                        item={item} 
                                        onUpdateImages={updateImages}
                                        onReportIssue={reportIssue}
                                        onReturnItem={returnItem}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sale Items Section */}
                    {saleItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Sale Items
                            </h3>
                            <div className="bg-white border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {saleItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={getImageUrl(item.product?.imageUrl)} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                                                    <span className="text-sm font-medium text-gray-900">{item.product?.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{item.price.toLocaleString('vi-VN')}đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

const RentalItemRow = ({ item, onUpdateImages, onReportIssue, onReturnItem }) => {
    // Determine status color
    const getStatusColor = (condition) => {
        switch(condition) {
            case 'GOOD': return 'bg-green-100 text-green-800';
            case 'DAMAGED': return 'bg-red-100 text-red-800';
            case 'LOST': return 'bg-gray-800 text-white';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <img src={getImageUrl(item.product?.imageUrl)} alt="" className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                    <div>
                        <h4 className="font-bold text-gray-900">{item.product?.name}</h4>
                        <p className="text-xs text-gray-500">Rental: {item.rentalDays} days | Qty: {item.quantity}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(item.condition || 'GOOD')}`}>
                                {item.condition || 'GOOD'}
                            </span>
                            {item.damageFee > 0 && (
                                <span className="text-xs font-medium text-red-600">Damage Fee: {item.damageFee.toLocaleString('vi-VN')}đ</span>
                            )}
                            {item.lateFee > 0 && (
                                <span className="text-xs font-medium text-orange-600">Late Fee: {item.lateFee.toLocaleString('vi-VN')}đ</span>
                            )}
                            {item.returnedAt && (
                                <span className="text-xs font-medium text-green-600">Returned</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-900">{(item.price * item.quantity * (item.rentalDays || 1)).toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-500">Deposit: {item.depositFee.toLocaleString('vi-VN')}đ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t pt-4">
                <ImageUploadSection 
                    title="Before Rent (Evidence)" 
                    images={item.rentalImagesBefore || []} 
                    onUpload={(imgs) => onUpdateImages({ itemId: item.id, type: 'BEFORE', images: imgs })}
                />
                <ImageUploadSection 
                    title="After Rent (Return)" 
                    images={item.rentalImagesAfter || []} 
                    onUpload={(imgs) => onUpdateImages({ itemId: item.id, type: 'AFTER', images: imgs })}
                />
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                {!item.returnedAt && <ReturnItemButton item={item} onReturn={onReturnItem} />}
                <ReportIssueButton item={item} onReport={onReportIssue} />
            </div>
        </div>
    );
};

const ImageUploadSection = ({ title, images, onUpload }) => {
    const handleAdd = () => {
        const url = window.prompt("Enter image URL (simulation):");
        if (url) {
            onUpload([...images, url]);
        }
    };

    return (
        <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-2">{title}</h5>
            <div className="flex flex-wrap gap-2">
                {images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 rounded border overflow-hidden hover:opacity-75">
                         <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                    </a>
                ))}
                <button onClick={handleAdd} className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const ReportIssueButton = ({ item, onReport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fee, setFee] = useState(item.damageFee || 0);
    const [notes, setNotes] = useState(item.notes || '');
    const [condition, setCondition] = useState(item.condition || 'DAMAGED');
    const { showToast } = useToast();

    if (!isOpen) {
        return (
             <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="text-red-600 border-red-200 hover:bg-red-50">
                Report Issue / Broken
             </Button>
        );
    }

    const handleSubmit = async () => {
        try {
            await onReport({ itemId: item.id, condition, damageFee: fee, notes }).unwrap();
            showToast('Issue reported successfully', 'success');
            setIsOpen(false);
        } catch (e) {
            showToast('Failed to report issue', 'error');
        }
    };

    return (
        <div className="bg-red-50 p-4 rounded-lg w-full border border-red-100 mt-2">
            <h4 className="font-bold text-red-800 mb-3">Report Damage / Issue</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                     <label className="block text-xs font-semibold text-red-700 mb-1">Condition</label>
                     <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500">
                         <option value="GOOD">Good (Resolved)</option>
                         <option value="DAMAGED">Damaged</option>
                         <option value="LOST">Lost</option>
                     </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-red-700 mb-1">Damage Fee (VND)</label>
                     <input type="number" min="0" value={fee} onChange={e => setFee(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                     <label className="block text-xs font-semibold text-red-700 mb-1">Notes</label>
                     <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="Describe damage..." />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button size="sm" variant="danger" onClick={handleSubmit}>Save Report</Button>
            </div>
        </div>
    );
};

const ReturnItemButton = ({ item, onReturn }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lateFee, setLateFee] = useState(item.lateFee || 0);
    const [notes, setNotes] = useState(item.notes || '');
    const [condition, setCondition] = useState(item.condition || 'GOOD');
    const { showToast } = useToast();

    if (!isOpen) {
        return (
             <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
                Return Product
             </Button>
        );
    }

    const handleSubmit = async () => {
        try {
            await onReturn({ itemId: item.id, data: { condition, lateFee, notes } }).unwrap();
            showToast('Item returned successfully', 'success');
            setIsOpen(false);
        } catch (e) {
            showToast('Failed to return item', 'error');
        }
    };

    return (
        <div className="bg-blue-50 p-4 rounded-lg w-full border border-blue-100 mt-2">
            <h4 className="font-bold text-blue-800 mb-3">Process Return</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                     <label className="block text-xs font-semibold text-blue-700 mb-1">Condition Upon Return</label>
                     <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                         <option value="GOOD">Good</option>
                         <option value="DAMAGED">Damaged</option>
                         <option value="LOST">Lost</option>
                     </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-blue-700 mb-1">Late Fee (VND) if any</label>
                     <input type="number" min="0" value={lateFee} onChange={e => setLateFee(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                     <label className="block text-xs font-semibold text-blue-700 mb-1">Return Notes</label>
                     <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full text-sm border-gray-300 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Returned 1 day late" />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button size="sm" variant="primary" onClick={handleSubmit}>Confirm Return</Button>
            </div>
        </div>
    );
};

export default AdminOrderDetailsModal;
