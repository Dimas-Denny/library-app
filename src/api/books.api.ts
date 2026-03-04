import client from "@/lib/client";
import type { Book } from "@/types/books";

/* ================= USER BOOK TYPES ================= */

export type GetBooksParams = {
  categoryId?: number;
  authorId?: number;
};

export type GetBooksResponse = {
  books: Book[];
  total?: number;
  page?: number;
};

/* ================= USER BOOK API ================= */

export const getBooks = async (
  params?: GetBooksParams,
): Promise<GetBooksResponse> => {
  const res = await client.get("/books", { params });

  const data = res.data.data;

  return {
    books: data.books,
    total: data.total,
    page: data.page,
  };
};

export const getBookById = async (id: number): Promise<Book> => {
  const res = await client.get(`/books/${id}`);
  return res.data.data;
};

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

/* ================= ADMIN BOOK LIST ================= */

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

/* ================= ADMIN BOOK DETAIL ================= */

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

export const getAdminBookById = async (
  id: string,
): Promise<AdminBookDetailResponse> => {
  const res = await client.get(`/books/${id}`);
  return res.data.data;
};

/* ================= UPDATE BOOK ================= */

export type UpdateBookPayload = {
  title: string;
  description: string;
  pages: number;
  categoryId: number;
  authorId: number;
};

export const updateBook = async (id: string, payload: FormData) => {
  const res = await client.put(`/books/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

/* ================= AUTHORS ================= */

export type Author = {
  id: number;
  name: string;
};

export const getAuthors = async (): Promise<Author[]> => {
  const res = await client.get("/authors");
  return res.data.data.authors;
};

/* ================= CATEGORIES ================= */

export type Category = {
  id: number;
  name: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await client.get("/categories");
  return res.data.data.categories;
};

/* ================= DELETE BOOK ================= */

export const deleteBook = async (id: number) => {
  const res = await client.delete(`/books/${id}`);
  return res.data;
};

/* ================= ADD BOOK ================= */

export type CreateBookPayload = {
  title: string;
  isbn: string;
  description: string;
  pages: number;
  authorId: number;
  categoryId: number;
  totalCopies: number;
  coverImage?: string | null;
};

export async function createBook(payload: FormData) {
  const res = await client.post("/books", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
