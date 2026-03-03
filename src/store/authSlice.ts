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

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
