import axios from "axios";
import { store } from "@/store";

const client = axios.create({
  baseURL: "https://library-backend-production-b9cf.up.railway.app/api",
});

client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
