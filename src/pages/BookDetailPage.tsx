import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/api/books.api";
import { getBookReviews } from "@/api/reviews.api";
import type { Book } from "@/types/books";
import type { BookReview } from "@/types/review";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* ================= BOOK ================= */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["book-detail", id],
    queryFn: () => getBookById(Number(id)),
    enabled: !!id,
  });

  const book: Book | undefined = data?.data;

  /* ================= REVIEWS ================= */
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<
    BookReview[]
  >({
    queryKey: ["book-reviews", id],
    queryFn: () => getBookReviews(Number(id)),
    enabled: !!id,
  });

  /* ================= RATING CALCULATION ================= */
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.star, 0) / reviews.length).toFixed(
          1,
        )
      : "0.0";

  /* ================= CART ================= */
  const [added, setAdded] = React.useState(false);

  function handleAddToCart() {
    if (!book) return;

    dispatch(addToCart(book));
    setAdded(true);

    setTimeout(() => setAdded(false), 1200);
  }

  /* ================= STATES ================= */
  if (isLoading) {
    return <div className="px-4 md:px-16 py-10">Loading book...</div>;
  }

  if (isError || !book) {
    return <div className="px-4 md:px-16 py-10">Book not found.</div>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="px-4 md:px-16 py-8 space-y-14">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm hover:text-primary-300 transition"
      >
        ← Back
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
              {book.category?.name}
            </span>

            <h1 className="mt-3 text-2xl md:text-3xl font-bold">
              {book.title}
            </h1>

            <p className="mt-1 text-sm text-black/60">{book.author?.name}</p>

            {/* ⭐ RATING */}
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{averageRating}</span>
            </div>
          </div>

          {/* 📊 STATS */}
          <div className="grid grid-cols-3 gap-6 border-y border-black/10 py-4 text-center">
            <div>
              <p className="text-lg font-semibold">{book.publishedYear}</p>
              <p className="text-xs text-black/50">Published</p>
            </div>

            <div>
              <p className="text-lg font-semibold">{averageRating}</p>
              <p className="text-xs text-black/50">Rating</p>
            </div>

            <div>
              <p className="text-lg font-semibold">{reviews.length}</p>
              <p className="text-xs text-black/50">Reviews</p>
            </div>
          </div>

          {/* STOCK INFO */}
          <div className="flex items-center gap-3 text-sm">
            {book.availableCopies > 0 ? (
              <>
                <span className="text-green-600 font-medium">
                  {book.availableCopies} copies available
                </span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          {/* 📖 DESCRIPTION */}
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="mt-2 text-sm text-black/60 leading-relaxed">
              {book.description ?? "No description available."}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={book.availableCopies === 0}
              className={`px-6 py-2 rounded-full border text-sm transition
    ${
      book.availableCopies === 0
        ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
        : added
          ? "border-green-500 text-green-600 bg-green-50"
          : "border-black/15 hover:bg-black hover:text-white"
    }
  `}
            >
              {book.availableCopies === 0
                ? "Out of Stock"
                : added
                  ? "Added ✓"
                  : "Add to Cart"}
            </button>

            <button
              disabled={book.availableCopies === 0}
              className={`px-6 py-2 rounded-full text-white text-sm transition
    ${
      book.availableCopies === 0
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-primary-300 hover:opacity-90"
    }
  `}
            >
              {book.availableCopies === 0 ? "Not Available" : "Borrow Book"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div>
        <h2 className="text-xl font-bold mb-6">Review</h2>

        {reviewsLoading ? (
          <p className="text-sm text-black/50">Loading reviews...</p>
        ) : reviews.length === 0 ? (
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

                <div className="mt-2 text-yellow-500 text-sm">
                  {"★".repeat(review.star ?? 0)}
                </div>

                <p className="mt-2 text-sm text-black/60">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
