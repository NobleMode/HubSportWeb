import React, { useState, useEffect } from "react";
import Button from "./Button";
import { getImageUrl } from "../../utils/imageUtils";

/**
 * QuickRentModal
 * Allows users to select rental options (Duration, Condition) before adding to cart.
 */
const QuickRentModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [duration, setDuration] = useState("DAY");
  const [condition, setCondition] = useState("USED");

  // Reset state when product changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setDuration("DAY");
      setCondition("USED");
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Pricing Logic (Mirrors ProductDetailsPage)
  const getRentPrice = () => {
    let price = product.rentalPrice || 0;
    if (condition === "LIKE_NEW") price *= 1.2;
    return Math.round(price);
  };

  const getRentTotal = () => {
    let dailyRate = getRentPrice();
    let days = 1;
    if (duration === "WEEK") days = 7;
    if (duration === "MONTH") days = 30;

    let total = dailyRate * days;
    if (duration === "WEEK") total *= 0.9;
    else if (duration === "MONTH") total *= 0.8;

    return Math.round(total);
  };

  const handleConfirm = () => {
    const rentTotal = getRentTotal();
    let days = 1;
    if (duration === "WEEK") days = 7;
    if (duration === "MONTH") days = 30;
    
    // Calculate effective daily rate for the cart item
    const effectiveDailyRate = Math.round(rentTotal / days);

    const variantId = `${product.id}-RENT-${condition}-${duration}`;
    const variantName = `${product.name} (Rent: ${condition === "LIKE_NEW" ? "Like New" : "Used"} - ${duration})`;

    onAddToCart({
      id: variantId, // Unique ID for this variant
      productId: product.id,
      name: variantName,
      type: "RENTAL",
      rentalPrice: effectiveDailyRate,
      salePrice: 0,
      rentalDays: days,
      depositFee: product.depositFee,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">Quick Rent</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* content */}
        <div className="p-6 overflow-y-auto">
          {/* Product Summary */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
               {product.imageUrl ? (
                  <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
               )}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 line-clamp-2">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.category}</p>
                 <p className="text-electricBlue font-bold mt-1">
                    {(product.rentalPrice || 0).toLocaleString()}₫ <span className="text-xs font-normal text-gray-400">/ day (base)</span>
                 </p>
            </div>
          </div>

          {/* Condition Selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Condition</label>
            <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => setCondition("USED")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === "USED" ? "border-electricBlue bg-blue-50 text-electricBlue" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                 >
                    Good (Used)
                 </button>
                 <button
                    onClick={() => setCondition("LIKE_NEW")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === "LIKE_NEW" ? "border-electricBlue bg-blue-50 text-electricBlue" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                 >
                    Like New (+20%)
                 </button>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Duration</label>
            <div className="grid grid-cols-3 gap-2">
                {['DAY', 'WEEK', 'MONTH'].map(d => (
                    <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all flex flex-col items-center justify-center ${duration === d ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                        <span>{d}</span>
                        {d !== 'DAY' && <span className="text-[10px] opacity-80">-{d === 'WEEK' ? '10%' : '20%'}</span>}
                    </button>
                ))}
            </div>
          </div>
          
           {/* Total Price */}
           <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-end">
                <div>
                    <span className="text-xs text-gray-500 font-medium">Est. Total</span>
                    <div className="text-2xl font-extrabold text-gray-900 leading-none mt-1">
                        {getRentTotal().toLocaleString()}₫
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">
                        Deposit: {(product.depositFee || 0).toLocaleString()}₫
                    </span>
                </div>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
            <Button onClick={handleConfirm} className="w-full py-3 bg-electricBlue hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                Add to Cart - {getRentTotal().toLocaleString()}₫
            </Button>
        </div>

      </div>
    </div>
  );
};

export default QuickRentModal;
