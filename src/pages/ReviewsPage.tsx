import ProfileTabs from "@/components/profile/ProfileTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "@/api/reviews.api";
import type { MyReview } from "@/types/review";

export default function ReviewsPage() {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<MyReview[]>({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
  });

  function formatDate(date?: string) {
    if (!date) return "-";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(parsed);
  }

  if (isLoading) {
    return (
      <div className="px-4 md:px-16 py-8">
        <p className="text-sm text-black/50">Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 md:px-16 py-8">
        <p className="text-sm text-red-500">Failed to load reviews.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-16 py-8 space-y-8">
      <ProfileTabs />

      <h1 className="text-2xl font-bold">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-sm text-black/50">
          You haven't written any reviews yet.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const book = review.book;

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-4"
              >
                {/* BOOK INFO */}
                <div className="flex items-start gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />

                  <div>
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-md">
                      {book.category?.name ?? "Category"}
                    </span>

                    <p className="mt-2 font-semibold">{book.title}</p>

                    <p className="text-sm text-black/50">
                      {book.author?.name ?? "-"}
                    </p>
                  </div>
                </div>

                <hr />

                {/* REVIEW INFO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-500 text-sm">
                      {"★".repeat(review.star)}
                    </div>

                    <span className="text-xs text-black/50">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-black/70">{review.comment}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
