import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";
import type { Book } from "@/types/books";

export default function RecommendationSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommendation-books"],
    queryFn: () => getBooks(),
  });

  const books: Book[] = data?.data?.books ?? [];

  // 🔥 jumlah yang ditampilkan
  const [visibleCount, setVisibleCount] = React.useState(10);

  const visibleBooks = books.slice(0, visibleCount);

  function handleLoadMore() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <section className="mt-8 border-b border-black/10 pb-10">
      <h2 className="text-2xl font-bold">Recommendation</h2>

      {isLoading && (
        <p className="mt-4 text-sm text-black/50">Loading books...</p>
      )}

      {isError && (
        <p className="mt-4 text-sm text-red-500">Failed to load books.</p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
        {visibleBooks.map((b) => (
          <div
            key={b.id}
            className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] active:scale-[0.99]"
          >
            <div className="relative h-52 md:h-44">
              <img
                src={b.coverImage}
                alt={b.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="p-3">
              <p className="text-sm font-semibold leading-snug">{b.title}</p>
              <p className="mt-1 text-xs text-black/45">{b.author?.name}</p>

              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black/60">
                <span className="text-accent-yellow">★</span>
                <span>4.9</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < books.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            type="button"
            className="h-9 rounded-full border border-black/10 bg-white px-10 text-sm font-medium transition hover:bg-primary-100"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
