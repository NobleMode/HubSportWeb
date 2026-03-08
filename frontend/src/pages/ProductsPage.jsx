import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../services/productApi";
import { getImageUrl } from "../utils/imageUtils";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import QuickRentModal from "../components/common/QuickRentModal";

/**
 * Products Page
 */
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  });

  const { data, isLoading, error } = useGetProductsQuery({
    search: searchTerm,
    ...filters,
  });

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm) prev.set("search", searchTerm);
        else prev.delete("search");
        return prev;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Update local state
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Update URL params
    setSearchParams((params) => {
      if (value) params.set(name, value);
      else params.delete(name);
      return params;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ minPrice: "", maxPrice: "", category: "", type: "" });
    setSearchParams({});
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { showToast } = useToast();
  
  // Quick Rent State
  const [quickRentProduct, setQuickRentProduct] = useState(null);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        type: product.type,
        salePrice: product.salePrice,
        rentalPrice: 0, 
        depositFee: product.depositFee,
        quantity: 1,
      }),
    );
     showToast("Added to cart successfully", "success");
  };

  const handleQuickRentAddToCart = (cartItem) => {
    dispatch(addToCart(cartItem));
    showToast("Added to cart successfully", "success");
    setQuickRentProduct(null);
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

  // Sort products based on selected option
  const getSortedProducts = () => {
    const productsCopy = [...products];

    switch (filters.sortBy) {
      case "price-low-high":
        return productsCopy.sort((a, b) => {
          const priceA = a.rentalPrice || a.salePrice || 0;
          const priceB = b.rentalPrice || b.salePrice || 0;
          return priceA - priceB;
        });

      case "price-high-low":
        return productsCopy.sort((a, b) => {
          const priceA = a.rentalPrice || a.salePrice || 0;
          const priceB = b.rentalPrice || b.salePrice || 0;
          return priceB - priceA;
        });

      case "most-popular":
        // Sort by stock quantity or a popularity metric if available
        return productsCopy.sort((a, b) => {
          const popularityA = a.stockQuantity || 0;
          const popularityB = b.stockQuantity || 0;
          return popularityB - popularityA;
        });

      case "newest":
      default:
        // Sort by createdAt or id (assuming higher id = newer)
        return productsCopy.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-10">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore Our <span className="text-electricBlue">Collection</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Discover top-tier sports equipment available for rent or purchase.
            Gear up and elevate your performance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 flex-shrink-0 space-y-8">
          {/* Search */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Data, equipment..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-electricBlue focus:border-transparent outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleFilterChange({
                    target: { name: "category", value: "" },
                  })
                }
                className={`flex items-center w-full text-left py-2 px-3 rounded-md transition-colors ${
                  filters.category === ""
                    ? "bg-blue-50 text-electricBlue font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Categories
              </button>
              {[
                "Badminton",
                "Tennis",
                "Soccer",
                "Basketball",
                "Gym",
                "Yoga",
                "Golf",
                "Electronics",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "category", value: cat },
                    })
                  }
                  className={`flex items-center w-full text-left py-2 px-3 rounded-md transition-colors ${
                    filters.category === cat
                      ? "bg-blue-50 text-electricBlue font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Type</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value=""
                  checked={filters.type === ""}
                  onChange={handleFilterChange}
                  className="form-radio text-electricBlue focus:ring-electricBlue h-4 w-4"
                />
                <span className="text-gray-700">All Products</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="SALE"
                  checked={filters.type === "SALE"}
                  onChange={handleFilterChange}
                  className="form-radio text-electricBlue focus:ring-electricBlue h-4 w-4"
                />
                <span className="text-gray-700">For Sale</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="RENTAL"
                  checked={filters.type === "RENTAL"}
                  onChange={handleFilterChange}
                  className="form-radio text-electricBlue focus:ring-electricBlue h-4 w-4"
                />
                <span className="text-gray-700">For Rent</span>
              </label>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Price Range</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Reset
              </button>
            </div>

            <div className="px-2">
              {/* Slider Visuals */}
              <div className="relative h-2 bg-gray-200 rounded-full mb-6">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={filters.minPrice || 0}
                  onChange={(e) => {
                    const val = Math.min(
                      Number(e.target.value),
                      Number(filters.maxPrice || 5000000) - 100000,
                    );
                    handleFilterChange({
                      target: { name: "minPrice", value: val },
                    });
                  }}
                  className="range-slider-input"
                />
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={filters.maxPrice || 5000000}
                  onChange={(e) => {
                    const val = Math.max(
                      Number(e.target.value),
                      Number(filters.minPrice || 0) + 100000,
                    );
                    handleFilterChange({
                      target: { name: "maxPrice", value: val },
                    });
                  }}
                  className="range-slider-input"
                />

                {/* Visual Track Highlight */}
                <div
                  className="absolute h-full bg-blue-500 rounded-full"
                  style={{
                    left: `${(Number(filters.minPrice || 0) / 5000000) * 100}%`,
                    right: `${100 - (Number(filters.maxPrice || 5000000) / 5000000) * 100}%`,
                  }}
                ></div>

                {/* Visual Thumbs */}
              </div>

              {/* Price Inputs Below Slider */}
              <div className="flex gap-3 justify-between">
                <div className="w-1/2">
                  <input
                    type="number"
                    value={filters.minPrice || ""}
                    placeholder="0"
                    onChange={(e) =>
                      handleFilterChange({
                        target: { name: "minPrice", value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-electricBlue transition-colors"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    value={filters.maxPrice || ""}
                    placeholder="5000000"
                    onChange={(e) =>
                      handleFilterChange({
                        target: { name: "maxPrice", value: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-electricBlue transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="w-full lg:w-3/4">
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <span className="text-gray-500 text-sm mb-4 sm:mb-0">
              Showing {products.length} of {products.length} products
            </span>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange({
                    target: { name: "sortBy", value: e.target.value },
                  })
                }
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer text-sm font-medium"
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="most-popular">Most Popular</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 relative"
              >
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

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
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm w-max ${
                        product.type === "SALE"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {product.type}
                    </span>
                    {product.isRecommended && (
                       <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm bg-yellow-400 text-yellow-900 w-max flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          Recommended
                       </span>
                    )}
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Category Pill */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded">
                      {product.category || "General"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-electricBlue transition-colors mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5rem] mb-2">
                      {product.description ||
                        "High-performance gear for professional athletes."}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center text-xs mb-4">
                      <span className="font-bold text-gray-900 mr-1">4.5</span>
                      <div className="flex text-yellow-400">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                      <span className="text-gray-400 ml-1">(128)</span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-50 pt-4">
                    {/* Dual Price Column */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                          Rent
                        </span>
                        <span className="block font-bold text-gray-900">
                          {product.rentalPrice?.toLocaleString()}₫
                        </span>
                        <span className="text-[10px] text-gray-400">/day</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                          Buy
                        </span>
                        <span className="block font-bold text-gray-900">
                          {product.salePrice?.toLocaleString()}₫
                        </span>
                      </div>
                    </div>

                    {/* Dual Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Button 1: Rent (Priority) or Buy */}
                      <div className="col-span-1">
                        {product.rentalPrice > 0 ? (
                           <Button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isAuthenticated) { navigate("/login"); return; }
                                setQuickRentProduct(product);
                              }}
                              className="w-full !py-2 !px-0 text-sm bg-electricBlue hover:bg-blue-700"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Rent
                              </span>
                           </Button>
                        ) : (
                           <Button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isAuthenticated) { navigate("/login"); return; }
                                handleAddToCart(product);
                              }}
                              className="w-full !py-2 !px-0 text-sm bg-limeGreen hover:bg-lime-700 text-white"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buy
                              </span>
                           </Button>
                        )}
                      </div>

                      {/* Button 2: Buy (If both) or Details */}
                      <div className="col-span-1">
                        {product.rentalPrice > 0 && product.salePrice > 0 ? (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isAuthenticated) { navigate("/login"); return; }
                                handleAddToCart(product);
                              }}
                              className="w-full !py-2 !px-0 text-sm bg-limeGreen hover:bg-lime-700 text-white"
                            >
                              <span className="flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Buy
                              </span>
                           </Button>
                        ) : (
                            <Link
                              to={`/products/${product.id}`}
                              className="block w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              Details
                            </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(products.length === 0) && (
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
                We couldn&apos;t find any products in the catalog right now. Please
                check back later or contact support.
              </p>
            </div>
          )}
        </main>
      </div>

      <QuickRentModal 
        isOpen={!!quickRentProduct} 
        product={quickRentProduct} 
        onClose={() => setQuickRentProduct(null)} 
        onAddToCart={handleQuickRentAddToCart} 
      />
    </div>
  );
};

export default ProductsPage;
