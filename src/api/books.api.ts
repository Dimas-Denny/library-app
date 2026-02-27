import { api } from "@/api/client";
import type { Book } from "@/types/books";
import type { ApiResponse } from "@/types/api";

export async function getBooks(params?: { category?: string }) {
  const query = new URLSearchParams();

  if (params?.category) {
    query.append("category", params.category);
  }

  const url = query.toString() ? `/books?${query.toString()}` : "/books";

  return api<ApiResponse<Book[]>>(url);
}
