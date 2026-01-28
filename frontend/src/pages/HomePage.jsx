import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../services/productApi";
import { getImageUrl } from "../utils/imageUtils";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: productsData, isLoading } = useGetProductsQuery({
    limit: 8, // Fetch just a few for the homepage
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const categories = [
    { name: "Badminton", icon: "🏸", color: "bg-blue-100 text-blue-600" },
    { name: "Tennis", icon: "🎾", color: "bg-green-100 text-green-600" },
    { name: "Soccer", icon: "⚽", color: "bg-orange-100 text-orange-600" },
    { name: "Gym", icon: "🏋️", color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-20 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-electricBlue-DEFAULT opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-limeGreen-DEFAULT opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find Your <span className="text-limeGreen-DEFAULT">Game.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Rent top-tier equipment, book expert coaches, and dominate the
            field.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for rackets, balls, or gear..."
              className="w-full py-5 px-8 pr-16 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-limeGreen-DEFAULT shadow-lg text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-3 bg-electricBlue-DEFAULT text-white rounded-full hover:bg-electricBlue-hover transition duration-200"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className={`${cat.color} px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform duration-200 shadow-sm`}
              >
                <span className="mr-2">{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Gear</h2>
            <p className="text-gray-500 mt-1">Most popular rentals this week</p>
          </div>
          <Link
            to="/products"
            className="text-electricBlue-DEFAULT font-bold hover:underline"
          >
            View All &rarr;
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsData?.data?.slice(0, 4).map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-gray-400">
                        Rent from
                      </span>
                      <span className="text-electricBlue-DEFAULT font-bold text-lg">
                        {product.rentalPrice?.toLocaleString()}đ
                        <span className="text-xs text-gray-400 font-normal">
                          /day
                        </span>
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-electricBlue-DEFAULT group-hover:text-white transition-colors">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Promotions / Banner Section */}
      <div className="container mx-auto px-6 mt-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="relative z-10 md:w-1/2 text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Seasonal Sale: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricBlue-DEFAULT to-blue-600">
                Up to 50% Off
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Get the best deals on premium sports equipment. Limited time offer
              on select brands including Yonex, Wilson, and Adidas.
            </p>
            <Link
              to="/products?type=SALE"
              className="inline-block text-center text-black border  bg-electricBlue-DEFAULT text-white font-bold px-10 py-4 rounded-full hover:bg-electricBlue-hover hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Shop Sale Items
            </Link>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-lime-100 rounded-2xl transform rotate-3 scale-105 opacity-50 blur-lg"></div>
              <img
                src="https://cafefcdn.com/thumb_w/640/203337114487263232/2023/4/29/avatar1682735830114-1682735830476939526341.jpg"
                alt="Sports Equipment Sale"
                className="relative w-full rounded-2xl shadow-2xl transform hover:scale-[1.02] transition duration-500 object-cover aspect-video"
              />
            </div>
          </div>

          {/* Abstract background decor */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-lime-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
