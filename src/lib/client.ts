import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // JWT based auth
});

/* ================= REQUEST INTERCEPTOR ================= */

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Auto logout kalau token expired / invalid
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default client;
