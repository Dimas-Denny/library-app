import type { Category } from "@/types/books";

const BASE_URL = "https://library-backend-production-b9cf.up.railway.app/api";

export type GetCategoriesResponse = {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
  };
};

export async function getCategories(): Promise<GetCategoriesResponse> {
  const res = await fetch(`${BASE_URL}/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}
