import type { Book } from "@/types/books";
import client from "@/lib/client";
import { api } from "@/api/client";

const BASE_URL = "https://library-backend-production-b9cf.up.railway.app/api";

export type GetBooksParams = {
  categoryId?: number;
  authorId?: number;
};

export type GetBooksResponse = {
  success: boolean;
  message: string;
  data: {
    books: Book[];
  };
};

export async function getBooks(
  params?: GetBooksParams,
): Promise<GetBooksResponse> {
  const query = new URLSearchParams();

  if (params?.categoryId) {
    query.append("categoryId", String(params.categoryId));
  }

  if (params?.authorId) {
    query.append("authorId", String(params.authorId));
  }

  const res = await fetch(`${BASE_URL}/books?${query.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export type GetBookDetailResponse = {
  success: boolean;
  message: string;
  data: Book;
};

export async function getBookById(id: number): Promise<GetBookDetailResponse> {
  const res = await fetch(`${BASE_URL}/books/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch book detail");
  }

  return res.json();
}

/* ================= ADMIN TYPES ================= */

export type AdminBook = {
  id: number;
  title: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
};

export type PaginatedAdminBooksResponse = {
  books: AdminBook[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

/* ======================
   TYPES
====================== */

export type AdminBookDetailResponse = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  pages: number;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
};

/* ================= ADMIN GET BOOKS ================= */

export const getAdminBooks = async (
  page: number,
  limit: number,
  search: string,
): Promise<PaginatedAdminBooksResponse> => {
  const res = await client.get("/admin/books", {
    params: {
      page,
      limit,
      search,
      sort: "title",
      order: "asc",
    },
  });

  return res.data.data;
};

export async function getAdminBookById(
  id: string,
): Promise<AdminBookDetailResponse> {
  const res = await api<{
    success: boolean;
    data: AdminBookDetailResponse;
  }>(`/books/${id}`);

  return res.data;
}

export type UpdateBookPayload = {
  title: string;
  description: string;
  pages: number;
  categoryId: number;
  authorId: number;
};

export async function updateBook(id: string, payload: UpdateBookPayload) {
  const res = await api<{
    success: boolean;
    data: unknown;
  }>(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return res;
}

export type Author = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export async function getAuthors() {
  const res = await api<{
    success: boolean;
    message: string;
    data: {
      authors: Author[];
    };
  }>("/authors");

  return res.data.authors;
}

export async function getCategories() {
  const res = await api<{
    success: boolean;
    message: string;
    data: {
      categories: Category[];
    };
  }>("/categories");

  return res.data.categories;
}
