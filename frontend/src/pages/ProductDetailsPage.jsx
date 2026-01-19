import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../services/productApi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Product Details Page
 * Displays detailed information about a single product
 */
const ProductDetailsPage = () => {
  const urlParams = useParams();
  const id = urlParams.id; // accessing id from useParams result
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isLoading, error } = useGetProductByIdQuery(id);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      type: product.type,
      salePrice: product.salePrice,
      rentalPrice: product.rentalPrice,
      depositFee: product.depositFee,
      quantity: 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading product: {error.message}
        <div className="mt-2">
           <Button onClick={() => navigate('/products')} variant="outline">
             Back to Products
           </Button>
        </div>
      </div>
    );
  }

  const product = data?.data;

  if (!product) {
    return (
        <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Product not found</p>
            <Button onClick={() => navigate('/products')} variant="primary">
                Back to Products
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => navigate('/products')} 
        variant="ghost" 
        className="mb-6 flex items-center text-gray-600 hover:text-primary-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Products
      </Button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="aspect-w-16 aspect-h-9 md:aspect-h-12 bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                    product.type === 'SALE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {product.type}
                </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-6">
               <h3 className="text-sm font-medium text-gray-900">Description</h3>
               <p className="text-gray-600 mt-2 leading-relaxed">
                 {product.description || 'No description available for this product.'}
               </p>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              {product.type === 'SALE' ? (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary-600">
                    {product.salePrice?.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-primary-600">
                      {product.rentalPrice?.toLocaleString('vi-VN')} VND
                    </span>
                    <span className="text-gray-500 ml-2">/ day</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Deposit fee: <span className="font-semibold">{product.depositFee?.toLocaleString('vi-VN')} VND</span>
                  </p>
                </div>
              )}
            </div>

             <div className="pb-4 mb-4 border-b border-gray-200">
                 <p className="text-sm text-gray-500 mb-2">Availability: 
                    <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                 </p>
                 {product.stock > 0 && (
                     <p className="text-sm text-gray-500">Stock: {product.stock} items</p>
                 )}
             </div>

            <div className="mt-auto">
              <Button
                onClick={() => {
                   if (!isAuthenticated) {
                       navigate('/login');
                       return;
                   }
                   handleAddToCart(product);
                }}
                className="w-full md:w-auto md:min-w-[200px] text-lg py-3"
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? 'Out of Stock' : (product.type === 'SALE' ? 'Add to Cart' : 'Rent Now')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
