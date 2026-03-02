import type { Book } from "@/types/books";

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
