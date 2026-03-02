import client from "@/lib/client";
import type { BookReview, MyReview } from "@/types/review";

/* ================= GET REVIEWS BY BOOK ================= */
export const getBookReviews = async (bookId: number): Promise<BookReview[]> => {
  const res = await client.get(`/reviews/book/${bookId}`);

  const payload = res.data?.data;

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.reviews)) return payload.reviews;

  return [];
};

/* ================= GET MY REVIEWS ================= */
export const getMyReviews = async (): Promise<MyReview[]> => {
  const res = await client.get("/me/reviews");

  const payload = res.data?.data;

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.reviews)) return payload.reviews;

  return [];
};

/* ================= CREATE REVIEW ================= */
export const createReview = async (payload: {
  bookId: number;
  star: number;
  comment: string;
}) => {
  await client.post("/reviews", payload);
};
