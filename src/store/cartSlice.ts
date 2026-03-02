import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/types/books";

type CartItem = {
  book: Book;
};

type CartState = {
  items: CartItem[];
};

/* ================= LOAD FROM LOCAL STORAGE ================= */

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

/* ================= INITIAL STATE ================= */

const initialState: CartState = {
  items: loadCart(),
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Book>) {
      const exists = state.items.find(
        (item) => item.book.id === action.payload.id,
      );

      if (!exists) {
        state.items.push({ book: action.payload });
        saveCart(state.items);
      }
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.book.id !== action.payload,
      );
      saveCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
