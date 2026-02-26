import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  search: string;
  categoryId: string | null;
};

const initialState: UiState = {
  search: "",
  categoryId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategoryId(state, action: PayloadAction<string | null>) {
      state.categoryId = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.categoryId = null;
    },
  },
});

export const { setSearch, setCategoryId, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;
