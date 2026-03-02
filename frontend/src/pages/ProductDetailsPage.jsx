import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "../services/productApi";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Toast from "../components/common/Toast";

/**
 * Product Details Page
 * Implements Rent-to-Buy flow with Tabs and Upsell Logic
 */
const ProductDetailsPage = () => {
  const urlParams = useParams();
  const id = urlParams.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isLoading, error } = useGetProductByIdQuery(id);

  const [activeTab, setActiveTab] = useState("RENT"); // 'RENT' or 'BUY'

  // Rent State
  const [rentCondition, setRentCondition] = useState("USED"); // 'LIKE_NEW' or 'USED'
  const [rentDuration, setRentDuration] = useState("DAY"); // 'DAY', 'WEEK', 'MONTH'

  // Buy State
  const [buyCondition, setBuyCondition] = useState("NEW"); // 'NEW' or 'USED'

  // Smart Popup State
  const [showUpsell, setShowUpsell] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Fetch related products with the same category
  const { data: relatedProductsData } = useGetProductsQuery(
    {
      category: data?.data?.category,
      limit: 8, // Fetch more to have options after filtering
    },
    {
      skip: !data?.data?.category, // Skip if we don't have the category yet
    },
  );

  // Always fetch some random products as fallback
  const { data: fallbackProductsData } = useGetProductsQuery(
    {
      limit: 8,
    },
    {
      skip: !data?.data, // Only skip if no product data at all
    },
  );

  // Get final related products list
  const getRelatedProducts = () => {
    if (!product) return [];

    // Start with same-category products
    let sameCategoryProducts = (relatedProductsData?.data || []).filter(
      (p) => p.id !== product.id,
    );

    // Get all other products
    let otherProducts = (fallbackProductsData?.data || []).filter(
      (p) => p.id !== product.id,
    );

    // Shuffle same category products
    const shuffledSameCategory = [...sameCategoryProducts].sort(
      () => Math.random() - 0.5,
    );

    // If we have enough from same category, use them
    if (shuffledSameCategory.length >= 4) {
      return shuffledSameCategory.slice(0, 4);
    }

    // Otherwise, combine with random products
    const shuffledOthers = [...otherProducts]
      .filter((p) => !shuffledSameCategory.find((sp) => sp.id === p.id)) // Avoid duplicates
      .sort(() => Math.random() - 0.5);

    const combined = [...shuffledSameCategory, ...shuffledOthers];
    return combined.slice(0, 4);
  };

  useEffect(() => {
    let timer;
    if (activeTab === "BUY") {
      // If user lingers on BUY tab for 5 seconds, show "Rent to Try" popup
      timer = setTimeout(() => {
        setShowUpsell(true);
      }, 5000);
    } else {
      setShowUpsell(false);
    }
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <Button onClick={() => navigate("/products")} variant="primary">
          Back to Collection
        </Button>
      </div>
    );
  }

  const product = data.data;

  // Calculate dynamic prices for display
  const getRentPrice = () => {
    let price = product.rentalPrice || 0;
    // Condition Adjustments
    if (rentCondition === "LIKE_NEW") price *= 1.2; // +20% for Like New

    return Math.round(price);
  };

  const getUserSelectedRentalDays = () => {
    switch (rentDuration) {
      case "WEEK":
        return 7;
      case "MONTH":
        return 30;
      default:
        return 1;
    }
  };

  const getRentTotal = () => {
    let dailyRate = getRentPrice();
    let days = getUserSelectedRentalDays();
    let total = dailyRate * days;

    // Apply Duration Discounts to the TOTAL
    if (rentDuration === "WEEK")
      total *= 0.9; // 10% off total
    else if (rentDuration === "MONTH") total *= 0.8; // 20% off total

    return Math.round(total);
  };

  const getBuyPrice = () => {
    let price = product.salePrice || 0;
    if (buyCondition === "USED") price *= 0.7; // 30% off for used
    return Math.round(price);
  };

  const handleAddToCart = (product) => {
    let finalPrice = 0;
    let type = activeTab === "RENT" ? "RENTAL" : "SALE";
    let rentalDays = 1;
    let variantId = product.id;
    let variantName = product.name;

    if (activeTab === "RENT") {
      const baseDaily = getRentPrice();
      rentalDays = getUserSelectedRentalDays();
      const totalAmount = getRentTotal();

      finalPrice = totalAmount / rentalDays;

      variantId = `${product.id}-RENT-${rentCondition}-${rentDuration}`;
      variantName = `${product.name} (Rent: ${rentCondition === "LIKE_NEW" ? "Like New" : "Used"} - ${rentDuration})`;
    } else {
      finalPrice = getBuyPrice();
      variantId = `${product.id}-BUY-${buyCondition}`;
      variantName = `${product.name} (Buy: ${buyCondition === "NEW" ? "New" : "Used"})`;
    }

    dispatch(
      addToCart({
        id: variantId, // Unique ID for this variant
        productId: product.id, // Reference to original product
        name: variantName,
        type: type,
        salePrice: activeTab === "BUY" ? finalPrice : 0,
        rentalPrice: activeTab === "RENT" ? finalPrice : 0,
        rentalDays: rentalDays,
        depositFee: product.depositFee,
        quantity: 1,
        imageUrl: product.imageUrl, // Ensure image is passed
        shop: product.shop, // Store shop reference for grouping
      }),
    );
    // Visual feedback
    setToast({ message: "Added to cart successfully!", type: "success" });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 flex items-center text-gray-500 hover:text-electricBlue transition-colors font-medium"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Collection
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* LEFT: Image Section */}
          <div className="md:w-1/2 bg-gray-100 relative">
            <div className="aspect-w-1 aspect-h-1 h-full min-h-[400px]">
              {product.imageUrl ? (
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Dynamic Badge */}
            <div className="absolute top-6 left-6">
              <span
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg shadow-md ${
                  activeTab === "RENT"
                    ? "bg-green-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {activeTab === "RENT"
                  ? "Available for Rent"
                  : "Available for Purchase"}
              </span>
            </div>
          </div>

          {/* RIGHT: Interaction Section */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col relative">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {product.name}
            </h1>
            {product.shop && (
              <Link
                to={`/shop/${product.shop.id}`}
                className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                  {product.shop.avatarUrl ? (
                    <img
                      src={product.shop.avatarUrl}
                      alt={product.shop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-amber-600 bg-amber-50">
                      {product.shop.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Cung cấp bởi
                  </p>
                  <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {product.shop.name}
                  </h4>
                </div>
                <div className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-amber-600 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  Ghé Shop
                </div>
              </Link>
            )}

            <p className="text-gray-500 mb-8 leading-relaxed">
              {product.description ||
                "Experience top-tier performance with this premium equipment."}
            </p>

            {/* MESSAGE: Cross-sell Logic */}
            {activeTab === "RENT" && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-blue-800">
                  <strong>Love this gear?</strong> We'll deduct 100% of your
                  rental fee if you decide to buy it within 7 days of returning!
                </p>
              </div>
            )}

            {/* TABS HEADER */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
              <button
                onClick={() => setActiveTab("RENT")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  activeTab === "RENT"
                    ? "bg-white text-electricBlue shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rent to Try
              </button>
              <button
                onClick={() => setActiveTab("BUY")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  activeTab === "BUY"
                    ? "bg-white text-limeGreen shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Buy to Own
              </button>
            </div>

            {/* TAB CONTENT: RENT */}
            {activeTab === "RENT" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Condition Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Condition
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRentCondition("LIKE_NEW")}
                      className={`flex-1 border rounded-xl p-3 text-left transition-all ${
                        rentCondition === "LIKE_NEW"
                          ? "border-electricBlue bg-blue-50/50 ring-1 ring-electricBlue"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-bold text-gray-900">
                        Like New (99%)
                      </span>
                      <span className="text-xs text-gray-500">
                        Premium experience
                      </span>
                    </button>
                    <button
                      onClick={() => setRentCondition("USED")}
                      className={`flex-1 border rounded-xl p-3 text-left transition-all ${
                        rentCondition === "USED"
                          ? "border-electricBlue bg-blue-50/50 ring-1 ring-electricBlue"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-bold text-gray-900">
                        Good (85%+)
                      </span>
                      <span className="text-xs text-gray-500">Best value</span>
                    </button>
                  </div>
                </div>

                {/* Duration Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["DAY", "WEEK", "MONTH"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setRentDuration(d)}
                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                          rentDuration === d
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="capitalize">{d.toLowerCase()}</span>
                        {d !== "DAY" && (
                          <span className="block text-[10px] font-normal opacity-80">
                            Save {d === "WEEK" ? "10%" : "20%"}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Total Estimate
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900">
                      {getRentTotal().toLocaleString("vi-VN")}{" "}
                      <span className="text-sm text-gray-500 font-medium">
                        / {rentDuration.toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      !isAuthenticated
                        ? navigate("/login")
                        : handleAddToCart(product)
                    }
                    className="bg-electricBlue hover:bg-electricBlue-hover px-8 py-4 rounded-xl shadow-lg shadow-electricBlue/30"
                  >
                    Rent Now
                  </Button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BUY */}
            {activeTab === "BUY" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Option Selector */}
                <div className="space-y-3">
                  <button
                    onClick={() => setBuyCondition("NEW")}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      buyCondition === "NEW"
                        ? "border-limeGreen bg-green-50/30 ring-1 ring-limeGreen"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-left">
                      <span className="block font-bold text-gray-900">
                        Buy Brand New
                      </span>
                      <span className="text-sm text-gray-500">
                        Original packaging, full warranty
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {(product.salePrice || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </button>

                  <button
                    onClick={() => setBuyCondition("USED")}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      buyCondition === "USED"
                        ? "border-limeGreen bg-green-50/30 ring-1 ring-limeGreen"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="block font-bold text-gray-900">
                          Buy Pre-owned
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">
                          Hot Deal
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Condition 90%+, verified by experts
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-limeGreen text-lg">
                        {Math.round(
                          (product.salePrice || 0) * 0.7,
                        ).toLocaleString("vi-VN")}{" "}
                        ₫
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {(product.salePrice || 0).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </button>
                </div>

                {/* Price & CTA */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Total Price
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900">
                      {getBuyPrice().toLocaleString("vi-VN")}{" "}
                      <span className="text-sm text-gray-500 font-medium">
                        VND
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      !isAuthenticated
                        ? navigate("/login")
                        : handleAddToCart(product)
                    }
                    className="bg-limeGreen hover:bg-limeGreen-hover px-8 py-4 rounded-xl shadow-lg shadow-limeGreen/30 text-white"
                  >
                    Purchase Now
                  </Button>
                </div>
              </div>
            )}

            {/* UPSELL POPUP (Displayed when hesitating on BUY tab) */}
            {showUpsell && activeTab === "BUY" && (
              <div className="absolute bottom-24 right-0 md:-right-4 w-72 bg-white p-4 rounded-2xl shadow-2xl border border-blue-100 animate-bounce-in z-20">
                <button
                  onClick={() => setShowUpsell(false)}
                  className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
                >
                  ✕
                </button>
                <div className="flex flex-col gap-2">
                  <span className="text-2xl">🤔</span>
                  <h4 className="font-bold text-gray-900">Not sure yet?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Why risk it? Rent this item for just{" "}
                    <span className="text-electricBlue font-bold">50k/day</span>{" "}
                    to test it out first!
                  </p>
                  <button
                    onClick={() => setActiveTab("RENT")}
                    className="text-sm font-bold text-electricBlue hover:underline text-left"
                  >
                    → Switch to Rental
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl mt-8">
          {/* Specifications Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Brand</span>
                <span className="text-gray-900 font-semibold">
                  {product.brand || "SportHub"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Model</span>
                <span className="text-gray-900 font-semibold">
                  {product.model || "Standard"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Type</span>
                <span className="text-gray-900 font-semibold">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Color</span>
                <span className="text-gray-900 font-semibold">
                  {product.color || "Multi-color"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Condition</span>
                <span className="text-gray-900 font-semibold">Excellent</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Stock Status</span>
                <span className="text-gray-900 font-semibold text-green-600">
                  In Stock
                </span>
              </div>
            </div>

            <div className="mt-10 bg-blue-50/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Professional grade material for durability",
                  "Ergonomic design for maximum comfort",
                  "Certified by international sports federations",
                  "Lightweight construction for agility",
                  "Weather-resistant coating",
                  "Includes standard 1-year warranty",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Related Products - Show products from same category or random if none available */}
              {getRelatedProducts().map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {relatedProduct.imageUrl ? (
                      <img
                        src={getImageUrl(relatedProduct.imageUrl)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg
                          className="w-10 h-10"
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
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-gray-500 font-medium mb-1">
                      {relatedProduct.category}
                    </span>
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                      {relatedProduct.name}
                    </h4>
                    <div className="mt-auto pt-2">
                      <span className="text-electricBlue font-bold block">
                        {relatedProduct.rentalPrice?.toLocaleString()}₫
                        <span className="text-xs text-gray-400 font-normal">
                          /day
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
