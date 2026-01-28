import React, { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation } from '../../services/productApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import ProductItemManagement from './ProductItemManagement';

const ProductManagement = () => {
    const { data, isLoading, error } = useGetProductsQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        imageUrl: '',
        type: 'SALE',
        stock: 0,
        salePrice: 0,
        rentalPrice: 0,
    });

    // Item Management State
    const [managingProduct, setManagingProduct] = useState(null);

    const products = data?.data || [];

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                category: product.category,
                brand: product.brand,
                imageUrl: product.imageUrl || '',
                type: product.type,
                stock: product.stock,
                salePrice: product.salePrice || 0,
                rentalPrice: product.rentalPrice || 0,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                category: '',
                brand: '',
                imageUrl: '',
                type: 'SALE',
                stock: 0,
                salePrice: 0,
                rentalPrice: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                salePrice: formData.type === 'SALE' ? formData.salePrice : undefined,
                rentalPrice: formData.type === 'RENTAL' ? formData.rentalPrice : undefined,
            };

            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, ...payload }).unwrap();
                showToast('Product updated successfully', 'success');
            } else {
                await createProduct(payload).unwrap();
                showToast('Product created successfully', 'success');
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            showToast(err.data?.message || `Failed to ${editingProduct ? 'update' : 'create'} product`, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                showToast('Product deleted successfully', 'success');
            } catch (err) {
                showToast('Failed to delete product', 'error');
            }
        }
    };

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (error) return <div className="text-red-500">Error loading products</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Button onClick={() => handleOpenModal()}>Add New Product</Button>
            </div>

            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search Products..." 
                    className="input-field max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {product.imageUrl ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.type === 'SALE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {product.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.type === 'SALE' 
                                        ? `${product.salePrice?.toLocaleString('vi-VN')} VND`
                                        : `${product.rentalPrice?.toLocaleString('vi-VN')} VND/day`
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {product.type === 'RENTAL' && (
                                        <Button 
                                            variant="ghost" 
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => setManagingProduct(product)}
                                        >
                                            Manage Items
                                        </Button>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        className="text-indigo-600 hover:text-indigo-900"
                                        onClick={() => handleOpenModal(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="input-field mt-1"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                required
                                className="input-field mt-1"
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                required
                                className="input-field mt-1"
                                value={formData.brand}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            className="input-field mt-1"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            className="input-field mt-1"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="type"
                                className="input-field mt-1"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="SALE">Sale</option>
                                <option value="RENTAL">Rental</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                required
                                className="input-field mt-1"
                                value={formData.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {formData.type === 'SALE' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sale Price (VND)</label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    min="0"
                                    required
                                    className="input-field mt-1"
                                    value={formData.salePrice}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rental Price (VND/Day)</label>
                                <input
                                    type="number"
                                    name="rentalPrice"
                                    min="0"
                                    required
                                    className="input-field mt-1"
                                    value={formData.rentalPrice}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>

             {/* Item Management Modal */}
             <Modal
                isOpen={!!managingProduct}
                onClose={() => setManagingProduct(null)}
                title=""
                className="max-w-4xl w-full"
            >
                {managingProduct && (
                    <ProductItemManagement 
                        product={managingProduct} 
                        onClose={() => setManagingProduct(null)} 
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductManagement;
