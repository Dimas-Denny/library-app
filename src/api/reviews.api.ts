import type { Review } from "@/types/review";

const BASE_URL = "https://library-backend-production-b9cf.up.railway.app/api";

export type GetBookReviewsResponse = {
  success: boolean;
  message: string;
  data: Review[];
};

export async function getBookReviews(
  bookId: number,
): Promise<GetBookReviewsResponse> {
  const res = await fetch(`${BASE_URL}/reviews/book/${bookId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return res.json();
}
