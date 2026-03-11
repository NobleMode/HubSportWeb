import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetShopByIdQuery } from "../services/shopApi";
import { useGetProductsQuery } from "../services/productApi";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/imageUtils";
import ShopLocationMap from "../components/shop/ShopLocationMap";

const ShopDetailsPage = () => {
  const { id } = useParams();
  const { data: shopData, isLoading: isShopLoading } = useGetShopByIdQuery(id);
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery({ shopId: id });

  const shop = shopData?.data;
  const products = productsData?.data;

  if (isShopLoading || isProductsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  if (!shop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Shop not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image */}
      <div className="h-64 md:h-80 bg-gradient-to-r from-gray-800 to-gray-900 relative overflow-hidden">
        {shop.coverUrl && (
          <img
            src={shop.coverUrl}
            alt={shop.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Shop Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gray-800 border-8 border-white overflow-hidden shadow-2xl">
              {shop.avatarUrl ? (
                <img
                  src={shop.avatarUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-amber-500">
                  {shop.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {shop.name}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600 uppercase tracking-wider">
                  Đối tác Uy tín
                </span>
              </div>
              <p className="mt-4 text-gray-500 max-w-2xl text-lg leading-relaxed">
                {shop.description ||
                  "Chào mừng bạn đến với cửa hàng của chúng tôi!"}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="font-bold text-gray-900 mr-1">
                    {shop._count?.products || 0}
                  </span>{" "}
                  Sản phẩm
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"
                    />
                  </svg>
                  Tham gia từ{" "}
                  {new Date(shop.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>

              {shop.address && (
                <div className="mt-4 flex items-start text-sm text-gray-600 max-w-2xl">
                  <span className="text-amber-500 mr-2 shrink-0">📍</span>
                  <span>{shop.address}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl">
                Theo Dõi
              </button>
              <button className="flex-1 md:flex-none px-8 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl">
                Chat Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShopLocationMap shop={shop} />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Sản phẩm của Shop
          </h2>
          <div className="flex gap-4">
            {/* Filters placeholder */}
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>Mới nhất</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {product.type === "SALE" ? "Bán" : "Cho Thuê"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 capitalize">
                      {product.category}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-amber-600">
                        {product.type === "SALE"
                          ? `${product.salePrice?.toLocaleString("vi-VN")}đ`
                          : `${product.rentalPrice?.toLocaleString("vi-VN")}đ /ngày`}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">Shop chưa đăng tải sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailsPage;
