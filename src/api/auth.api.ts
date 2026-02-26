import { api } from "./client";

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: "ADMIN" | "USER";
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function login(body: LoginBody) {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// register tidak return token, hanya user
export async function register(body: RegisterBody) {
  return api<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
