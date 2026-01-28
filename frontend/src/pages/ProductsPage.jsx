import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../services/productApi";
import { getImageUrl } from "../utils/imageUtils";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Button from "../components/common/Button";

/**
 * Products Page
 */
const ProductsPage = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        type: product.type,
        salePrice: product.salePrice,
        rentalPrice: product.rentalPrice,
        depositFee: product.depositFee,
        quantity: 1,
      }),
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r shadow-sm">
          <p className="font-bold">Error loading products</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-10">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore Our{" "}
            <span className="text-electricBlue-DEFAULT">Collection</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Discover top-tier sports equipment available for rent or purchase.
            Gear up and elevate your performance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
            >
              <Link
                to={`/products/${product.id}`}
                className="block relative h-64 overflow-hidden"
              >
                {product.imageUrl ? (
                  <img
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${
                      product.type === "SALE"
                        ? "bg-limeGreen-DEFAULT text-white"
                        : "bg-electricBlue-DEFAULT text-white"
                    }`}
                  >
                    {product.type}
                  </span>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Link>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-electricBlue-DEFAULT transition-colors mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[2.5rem]">
                    {product.description ||
                      "No description available for this premium item."}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    {product.rentalPrice && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase w-16">
                          Rent from
                        </span>
                        <span className="text-lg font-extrabold text-gray-900">
                          {product.rentalPrice.toLocaleString("vi-VN")}{" "}
                          <span className="text-xs text-gray-500 font-medium">
                            /day
                          </span>
                        </span>
                      </div>
                    )}
                    {product.salePrice && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-electricBlue-DEFAULT uppercase w-16">
                          Buy now
                        </span>
                        <span className="text-lg font-bold text-gray-700">
                          {product.salePrice.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button styled as circular icon on desktop, full button on mobile if needed */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        navigate("/login");
                        return;
                      }
                      handleAddToCart(product);
                    }}
                    className="!rounded-full !p-3 !bg-gray-900 hover:!bg-electricBlue-DEFAULT transition-colors shadow-lg"
                    title={product.type === "SALE" ? "Add to Cart" : "Rent Now"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any products in the catalog right now. Please
              check back later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
