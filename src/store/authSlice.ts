import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type AuthState = {
  token: string | null;
  user: User | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setToken, clearAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
