import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createReview } from "@/api/reviews.api";
import type { Book } from "@/types/books";
import type { AxiosError } from "axios";

type Props = {
  book: Book;
  onClose: () => void;
};

export default function ReviewModal({ book, onClose }: Props) {
  const [rating, setRating] = React.useState<number>(4);
  const [comment, setComment] = React.useState<string>("");

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      onClose();
    },
  });

  function handleSubmit() {
    if (!comment.trim()) return;

    mutation.mutate({
      bookId: book.id,
      star: rating, // 🔥 ganti key
      comment,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl relative">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Give Review</h2>

        <p className="text-sm text-black/50 mb-2 text-center">{book.title}</p>

        <p className="text-sm text-black/60 mb-2 text-center">Give Rating</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer transition ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about this book"
          className="w-full h-32 border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-200"
        />

        {mutation.isError && (
          <p className="text-red-500 text-xs mt-2">
            {(() => {
              const err = mutation.error as AxiosError<{
                message?: string;
              }>;

              return (
                err.response?.data?.message ??
                err.message ??
                "Failed to send review"
              );
            })()}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || mutation.isPending}
          className="w-full mt-5 py-3 rounded-full bg-primary-300 text-white text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {mutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
