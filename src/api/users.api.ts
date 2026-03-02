import client from "@/lib/client";
import { api } from "@/lib/api";

export const getMyProfile = async () => {
  const res = await client.get("/me");
  return res.data.data;
};
export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  avatar?: string;
}) => {
  const res = await api.patch("/me", data);
  return res.data;
};
