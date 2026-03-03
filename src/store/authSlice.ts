import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: "ADMIN" | "USER";
};

type AuthState = {
  token: string | null;
  user: User | null;
};

// ✅ restore dari localStorage saat pertama load
const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const userFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  token: tokenFromStorage ?? null,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
