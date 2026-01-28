import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/productApi";
import { getImageUrl } from "../utils/imageUtils";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

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

  const handleAddToCart = (product) => {
    // Determine final price based on selection
    let finalPrice = 0;
    let type = activeTab === "RENT" ? "RENTAL" : "SALE";

    if (activeTab === "RENT") {
      // Calculation logic for demo
      let basePrice = product.rentalPrice;
      if (rentCondition === "LIKE_NEW") basePrice *= 1.2; // 20% premium

      if (rentDuration === "WEEK")
        basePrice *= 7 * 0.9; // 10% off for week
      else if (rentDuration === "MONTH") basePrice *= 30 * 0.8; // 20% off for month

      finalPrice = Math.round(basePrice);
    } else {
      finalPrice =
        buyCondition === "NEW"
          ? product.salePrice
          : Math.round(product.salePrice * 0.7); // 30% off for used
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        type: type,
        // For cart simplicity, we just use the calculated price as "salePrice" and store details in metadata if needed
        // But to fit current schema, we map back to simple fields:
        salePrice: activeTab === "BUY" ? finalPrice : 0,
        rentalPrice: activeTab === "RENT" ? finalPrice : 0,
        depositFee: product.depositFee,
        quantity: 1,
      }),
    );

    // Simple visual feedback could go here
    alert("Added to card");
  };

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
    if (rentCondition === "LIKE_NEW") price *= 1.2;
    return Math.round(price);
  };

  const getBuyPrice = () => {
    let price = product.salePrice || 0;
    if (buyCondition === "USED") price *= 0.7;
    return Math.round(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 flex items-center text-gray-500 hover:text-electricBlue-DEFAULT transition-colors font-medium"
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
                    ? "bg-electricBlue-DEFAULT text-white"
                    : "bg-limeGreen-DEFAULT text-white"
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
                    ? "bg-white text-electricBlue-DEFAULT shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rent to Try
              </button>
              <button
                onClick={() => setActiveTab("BUY")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  activeTab === "BUY"
                    ? "bg-white text-limeGreen-DEFAULT shadow-sm"
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
                          ? "border-electricBlue-DEFAULT bg-blue-50/50 ring-1 ring-electricBlue-DEFAULT"
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
                          ? "border-electricBlue-DEFAULT bg-blue-50/50 ring-1 ring-electricBlue-DEFAULT"
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
                      {getRentPrice().toLocaleString("vi-VN")}{" "}
                      <span className="text-sm text-gray-500 font-medium">
                        /day
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      !isAuthenticated
                        ? navigate("/login")
                        : handleAddToCart(product)
                    }
                    className="bg-electricBlue-DEFAULT hover:bg-electricBlue-hover px-8 py-4 rounded-xl shadow-lg shadow-electricBlue-DEFAULT/30"
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
                        ? "border-limeGreen-DEFAULT bg-green-50/30 ring-1 ring-limeGreen-DEFAULT"
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
                        ? "border-limeGreen-DEFAULT bg-green-50/30 ring-1 ring-limeGreen-DEFAULT"
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
                      <span className="block font-bold text-limeGreen-DEFAULT text-lg">
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
                    className="bg-limeGreen-DEFAULT hover:bg-limeGreen-hover px-8 py-4 rounded-xl shadow-lg shadow-limeGreen-DEFAULT/30 text-white"
                  >
                    Purchase Now
                  </Button>
                </div>
              </div>
            )}

            {/* UPSELL POPUP (Displayed when hesitating on BUY tab) */}
            {showUpsell && activeTab === "BUY" && (
              <div className="absolute bottom-24 right-0 md:-right-4 w-72 bg-white p-4 rounded-2xl shadow-2xl border border-electricBlue-100 animate-bounce-in z-20">
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
                    <span className="text-electricBlue-DEFAULT font-bold">
                      50k/day
                    </span>{" "}
                    to test it out first!
                  </p>
                  <button
                    onClick={() => setActiveTab("RENT")}
                    className="text-sm font-bold text-electricBlue-DEFAULT hover:underline text-left"
                  >
                    → Switch to Rental
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
