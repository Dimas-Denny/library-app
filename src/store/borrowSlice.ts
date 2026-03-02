import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/types/books";

export type BorrowItem = {
  book: Book;
  borrowDate: string;
  returnDate: string;
};

type BorrowState = {
  items: BorrowItem[];
};

const saved = localStorage.getItem("borrowed");

const initialState: BorrowState = {
  items: saved ? JSON.parse(saved) : [],
};

const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    addBorrow(
      state,
      action: PayloadAction<{
        books: Book[];
        borrowDate: string;
        returnDate: string;
      }>,
    ) {
      action.payload.books.forEach((book) => {
        state.items.unshift({
          book,
          borrowDate: action.payload.borrowDate,
          returnDate: action.payload.returnDate,
        });
      });

      localStorage.setItem("borrowed", JSON.stringify(state.items));
    },

    clearBorrow(state) {
      state.items = [];
      localStorage.removeItem("borrowed");
    },
  },
});

export const { addBorrow, clearBorrow } = borrowSlice.actions;
export default borrowSlice.reducer;
