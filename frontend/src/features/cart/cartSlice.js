import { createSlice } from "@reduxjs/toolkit";

/**
 * Cart Slice
 * Manages shopping cart state with auto-calculation of totalAmount and totalDeposit
 * Persists cart to localStorage for recovery
 */

// Helper functions for localStorage
const CART_STORAGE_KEY = "hubsport_cart";

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return {
    items: [],
    totalAmount: 0,
    totalDeposit: 0,
    itemCount: 0,
  };
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);

      // Save to localStorage
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);

      // Save to localStorage
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);

      // Save to localStorage
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalDeposit = 0;
      state.itemCount = 0;

      // Save to localStorage
      saveCartToStorage(state);
    },
    calculateTotals: (state) => {
      let totalAmount = 0;
      let totalDeposit = 0;
      let itemCount = 0;

      state.items.forEach((item) => {
        itemCount += item.quantity;

        // Calculate amount based on item type
        if (item.type === "RENTAL") {
          const rentalDays = item.rentalDays || 1;
          totalAmount += (item.rentalPrice || 0) * rentalDays * item.quantity;
          totalDeposit += (item.depositFee || 0) * item.quantity;
        } else {
          totalAmount += (item.salePrice || 0) * item.quantity;
        }
      });

      state.totalAmount = totalAmount;
      state.totalDeposit = totalDeposit;
      state.itemCount = itemCount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectTotalDeposit = (state) => state.cart.totalDeposit;
export const selectItemCount = (state) => state.cart.itemCount;
