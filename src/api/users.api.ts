import client from "@/lib/client";

/* ================= USER TYPES ================= */

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  role: "USER" | "ADMIN";
};

export type MyProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
};

/* ================= USER SELF ================= */

export const getMyProfile = async (): Promise<MyProfile> => {
  const res = await client.get("/me");
  return res.data.data;
};

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  avatar?: string;
}) => {
  const res = await client.patch("/me", data);
  return res.data.data;
};

/* ================= ADMIN ================= */

export type PaginatedUsersResponse = {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getUsers = async (
  page: number,
  limit: number,
  search: string,
): Promise<PaginatedUsersResponse> => {
  const res = await client.get("/admin/users", {
    params: {
      page,
      limit,
      search,
      sort: "name",
      order: "asc",
    },
  });

  return res.data.data;
};
