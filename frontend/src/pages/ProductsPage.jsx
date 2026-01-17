import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../services/productApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import Button from '../components/common/Button';

/**
 * Products Page
 */
const ProductsPage = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const dispatch = useDispatch();

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
        Error loading products: {error.message}
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card group flex flex-col h-full">
            <Link to={`/products/${product.id}`} className="flex flex-1 flex-col">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>
            
              <div className="mb-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  product.type === 'SALE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {product.type}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {product.description}
              </p>

              <div className="mb-4 mt-auto">
                {product.type === 'SALE' ? (
                  <p className="text-xl font-bold text-primary-600">
                    {product.salePrice?.toLocaleString('vi-VN')} VND
                  </p>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-primary-600">
                      {product.rentalPrice?.toLocaleString('vi-VN')} VND/day
                    </p>
                    <p className="text-sm text-gray-500">
                      Deposit: {product.depositFee?.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                )}
              </div>
            </Link>

            <Button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation when clicking the button
                handleAddToCart(product);
              }}
              className="w-full mt-auto"
            >
              {product.type === 'SALE' ? 'Add to Cart' : 'Rent Now'}
            </Button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
