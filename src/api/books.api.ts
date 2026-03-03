import type { Book } from "@/types/books";
import client from "@/lib/client";

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
