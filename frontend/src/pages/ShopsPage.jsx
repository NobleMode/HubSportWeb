import React from "react";
import { Link } from "react-router-dom";
import { useGetShopsQuery } from "../services/shopApi";
import { motion } from "framer-motion";

const ShopsPage = () => {
  const { data: shops, isLoading, isError } = useGetShopsQuery();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        Error loading shops.
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
            Cộng đồng <span className="text-amber-500">Người bán</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Khám phá các cửa hàng thể thao uy tín trên EXERCISER.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops?.data?.map((shop) => (
            <motion.div
              key={shop.id}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 group shadow-xl"
            >
              <div className="h-32 bg-gradient-to-r from-amber-600 to-orange-700 relative">
                {shop.coverUrl && (
                  <img
                    src={shop.coverUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
              </div>
              <div className="px-6 pb-8 pt-12 relative">
                <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl bg-gray-800 border-4 border-white/10 overflow-hidden shadow-lg">
                  {shop.avatarUrl ? (
                    <img
                      src={shop.avatarUrl}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-amber-500">
                      {shop.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {shop.name}
                </h3>
                <p className="mt-2 text-gray-400 line-clamp-2 text-sm leading-relaxed">
                  {shop.description || "Chưa có mô tả cho shop này."}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  {/* Rating could go here in Phase 4 */}
                  <div className="flex items-center text-amber-400 text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>New Shop</span>
                  </div>
                  <Link
                    to={`/shop/${shop.id}`}
                    className="px-5 py-2.5 bg-white/10 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Ghé Thăm
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {(!shops?.data || shops?.data?.length === 0) && (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/20">
              <p className="text-gray-500 text-lg">
                Chưa có shop nào được mở. Hãy trở thành người đầu tiên!
              </p>
              <Link
                to="/become-seller"
                className="mt-4 inline-block text-amber-500 font-bold hover:underline"
              >
                Mở Shop Ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopsPage;
