import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/api/books.api";
import type { Book } from "@/types/books";
import { getBookReviews } from "@/api/reviews.api";
import type { Review } from "@/types/review";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book-detail", id],
    queryFn: () => getBookById(Number(id)),
    enabled: !!id,
  });

  const book: Book | undefined = data?.data;

  const { data: reviewData } = useQuery({
    queryKey: ["book-reviews", id],
    queryFn: () => getBookReviews(Number(id)),
    enabled: !!id,
  });

  const reviews: Review[] = Array.isArray(reviewData?.data)
    ? reviewData?.data
    : [];

  if (isLoading) {
    return <div className="px-4 md:px-16 py-10">Loading book...</div>;
  }

  if (isError || !book) {
    return <div className="px-4 md:px-16 py-10">Book not found.</div>;
  }

  if (!book) {
    return <div className="px-4 md:px-16 py-10">Book not found.</div>;
  }

  return (
    <div className="px-4 md:px-16 py-8 space-y-14">
      {/* 🔥 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-black hover:text-primary-300 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* COVER */}
        <div className="flex justify-center md:justify-start">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-60 md:w-80 rounded-xl shadow-lg"
          />
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <div>
            <span className="text-xs bg-black/5 px-2 py-1 rounded-md">
              {book.category.name}
            </span>

            <h1 className="mt-3 text-2xl md:text-3xl font-bold">
              {book.title}
            </h1>

            <p className="mt-1 text-sm text-black/60">{book.author.name}</p>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-accent-yellow">★</span>
              <span>{book.reviewCount > 0 ? "4.9" : "0.0"}</span>
            </div>
          </div>

          {/* STATS (pakai field yg ada di type kamu) */}
          <div className="grid grid-cols-3 gap-6 border-y border-black/10 py-4 text-center">
            <div>
              <p className="text-lg font-semibold">{book.publishedYear}</p>
              <p className="text-xs text-black/50">Published</p>
            </div>

            <div>
              <p className="text-lg font-semibold">{book.reviewCount}</p>
              <p className="text-xs text-black/50">Reviews</p>
            </div>

            <div>
              <p className="text-lg font-semibold">{book.availableCopies}</p>
              <p className="text-xs text-black/50">Available</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="mt-2 text-sm text-black/60 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* EXTRA INFO */}
          <div className="text-sm text-black/60 space-y-1">
            <p>ISBN: {book.isbn}</p>
            <p>Total Copies: {book.totalCopies}</p>
            <p>Borrowed: {book.borrowCount} times</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-2 rounded-full border border-black/15 text-sm">
              Add to Cart
            </button>

            <button className="px-6 py-2 rounded-full bg-primary-300 text-white text-sm">
              Borrow Book
            </button>
          </div>
        </div>
      </div>

      {/* ================= REVIEW SECTION ================= */}
      <div>
        <h2 className="text-xl font-bold mb-6">Review</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-black/50">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl bg-white p-4 shadow-sm border border-black/5"
              >
                <p className="font-semibold text-sm">
                  {review.user?.name ?? "User"}
                </p>

                <p className="text-xs text-black/50 mt-1">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </p>

                <div className="mt-2 text-accent-yellow text-sm">
                  {"★".repeat(review.rating ?? 0)}
                </div>

                <p className="mt-2 text-sm text-black/60">
                  {review.comment ?? ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RELATED BOOKS (dummy dulu) ================= */}
      <div>
        <h2 className="text-xl font-bold mb-6">Related Books</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="h-40 bg-gray-200 rounded-md mb-2" />
              <p className="text-sm font-semibold">Book Name</p>
              <p className="text-xs text-black/50">Author</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
