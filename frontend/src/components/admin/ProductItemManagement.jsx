import React, { useState } from 'react';
import { 
    useGetProductItemsQuery, 
    useCreateProductItemMutation, 
    useLogMaintenanceMutation,
    useLiquidateItemMutation 
} from '../../services/productApi';
import Button from '../common/Button';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import ItemHistory from './ItemHistory';

const ProductItemManagement = ({ product, onClose }) => {
    const { data, isLoading } = useGetProductItemsQuery(product.id, {
        skip: !product,
    });
    const [createItem] = useCreateProductItemMutation();
    const [logMaintenance] = useLogMaintenanceMutation();
    const [liquidateItem] = useLiquidateItemMutation();
    
    const { showToast } = useToast();
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMaintainModalOpen, setIsMaintainModalOpen] = useState(false);
    const [isLiquidateModalOpen, setIsLiquidateModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [newItemSerial, setNewItemSerial] = useState('');
    
    const [maintenanceData, setMaintenanceData] = useState({
        type: 'ROUTINE',
        description: '',
        cost: 0,
        performedBy: '',
        status: 'COMPLETED'
    });

    const [liquidationReason, setLiquidationReason] = useState('');

    const items = data?.data || [];

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try {
            await createItem({
                productId: product.id,
                serialNumber: newItemSerial,
                status: 'AVAILABLE',
                condition: 'NEW'
            }).unwrap();
            showToast('Item added successfully', 'success');
            setIsAddModalOpen(false);
            setNewItemSerial('');
        } catch (err) {
            showToast(err.data?.message || 'Failed to add item', 'error');
        }
    };

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        try {
            await logMaintenance({
                id: selectedItem.id,
                ...maintenanceData
            }).unwrap();
            showToast('Maintenance logged successfully', 'success');
            setIsMaintainModalOpen(false);
            setMaintenanceData({
                type: 'ROUTINE',
                description: '',
                cost: 0,
                performedBy: '',
                status: 'COMPLETED'
            });
        } catch (err) {
            showToast(err.data?.message || 'Failed to log maintenance', 'error');
        }
    };

    const handleLiquidateSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!confirm('Are you sure you want to liquidate this item? This action marks it as disposed.')) return;
            
            await liquidateItem({
                id: selectedItem.id,
                reason: liquidationReason
            }).unwrap();
            showToast('Item liquidated successfully', 'success');
            setIsLiquidateModalOpen(false);
            setLiquidationReason('');
        } catch (err) {
            showToast(err.data?.message || 'Failed to liquidate item', 'error');
        }
    };

    const openMaintenance = (item) => {
        setSelectedItem(item);
        setIsMaintainModalOpen(true);
    };

    const openLiquidate = (item) => {
        setSelectedItem(item);
        setIsLiquidateModalOpen(true);
    };

    const openHistory = (item) => {
        setSelectedItem(item);
        setIsHistoryModalOpen(true);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold">Manage Items: {product.name}</h3>
                    <p className="text-sm text-gray-500">Total Stock: {items.filter(i => i.status !== 'LOST' && i.status !== 'LIQUIDATED' && i.condition !== 'DISPOSED').length}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAddModalOpen(true)}>Add Item</Button>
                </div>
            </div>

            <div className="overflow-x-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No items found. Add one to get started.</td>
                            </tr>
                        ) : items.map((item) => (
                            <tr key={item.id} className={item.condition === 'DISPOSED' ? 'bg-gray-100 opacity-60' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                                        item.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {item.status} {item.isForLiquidation ? '(Liq)' : ''}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.condition}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {item.lastMaintenanceDate 
                                        ? new Date(item.lastMaintenanceDate).toLocaleDateString() 
                                        : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    {item.condition !== 'DISPOSED' && (
                                        <>
                                            <Button variant="ghost" size="sm" onClick={() => openMaintenance(item)}>
                                                Maintenance
                                            </Button>
                                        </>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={() => openHistory(item)}>
                                        History
                                    </Button>
                                    {item.condition !== 'DISPOSED' && (
                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openLiquidate(item)}>
                                            Liquidate
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Item Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Item">
                <form onSubmit={handleCreateItem}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                        <input 
                            type="text" 
                            required 
                            className="input-field mt-1"
                            value={newItemSerial}
                            onChange={(e) => setNewItemSerial(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Item</Button>
                    </div>
                </form>
            </Modal>
            
            {/* Maintenance Modal */}
            <Modal isOpen={isMaintainModalOpen} onClose={() => setIsMaintainModalOpen(false)} title={`Log Maintenance: ${selectedItem?.serialNumber}`}>
                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select 
                            className="input-field mt-1"
                            value={maintenanceData.type}
                            onChange={(e) => setMaintenanceData({...maintenanceData, type: e.target.value})}
                        >
                            <option value="ROUTINE">Routine Check</option>
                            <option value="REPAIR">Repair</option>
                            <option value="CLEANING">Cleaning</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            className="input-field mt-1"
                            rows="2"
                            value={maintenanceData.description}
                            onChange={(e) => setMaintenanceData({...maintenanceData, description: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cost (VND)</label>
                        <input 
                            type="number" 
                            className="input-field mt-1"
                            value={maintenanceData.cost}
                            onChange={(e) => setMaintenanceData({...maintenanceData, cost: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status After Maintenance</label>
                        <select 
                            className="input-field mt-1"
                            value={maintenanceData.status}
                            onChange={(e) => setMaintenanceData({...maintenanceData, status: e.target.value})}
                        >
                            <option value="COMPLETED">Completed (Item Available)</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="SCHEDULED">Scheduled</option>
                        </select>
                    </div>
                     <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsMaintainModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Log Maintenance</Button>
                    </div>
                </form>
            </Modal>

            {/* Liquidation Modal */}
            <Modal isOpen={isLiquidateModalOpen} onClose={() => setIsLiquidateModalOpen(false)} title="Liquidate Item">
                 <form onSubmit={handleLiquidateSubmit} className="space-y-4">
                    <p className="text-red-600 text-sm">Warning: This will mark the item as DISPOSED and remove it from active inventory.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea 
                            required
                            className="input-field mt-1"
                            rows="2"
                            value={liquidationReason}
                            onChange={(e) => setLiquidationReason(e.target.value)}
                            placeholder="e.g., Irreparable damage, End of life"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsLiquidateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">Confirm Liquidation</Button>
                    </div>
                </form>
            </Modal>

            {/* History Modal */}
            <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`Item History: ${selectedItem?.serialNumber}`}>
                {selectedItem && <ItemHistory itemId={selectedItem.id} />}
                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ProductItemManagement;
