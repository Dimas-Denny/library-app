import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";

import BookCard from "@/components/books/BookCard";

export default function BooksPage() {
  const [params] = useSearchParams();
  const initialCategoryId = params.get("categoryId");

  const { data, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: () => getBooks(),
  });

  const books = data?.books ?? [];

  const [minRating, setMinRating] = React.useState<number | null>(null);

  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    initialCategoryId ? [Number(initialCategoryId)] : [],
  );

  const [showFilter, setShowFilter] = React.useState(false);

  const filteredBooks = books.filter((b) => {
    const ratingPass = minRating !== null ? 4.9 >= minRating : true;

    const categoryPass =
      selectedCategories.length > 0
        ? selectedCategories.includes(b.categoryId)
        : true;

    return ratingPass && categoryPass;
  });

  return (
    <div className="px-4 md:px-16 py-8">
      <h2 className="text-2xl font-bold">Book List</h2>

      {/* ================= MOBILE FILTER ================= */}
      <div className="mt-4 md:hidden relative">
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        >
          <span className="text-sm font-semibold">FILTER</span>

          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-black/60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
        </button>

        {showFilter && (
          <div
            className="
              absolute left-0 top-full mt-3 w-full
              rounded-2xl bg-white
              shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              z-50
            "
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <h3 className="text-sm font-semibold">Filter</h3>

              <button
                onClick={() => setShowFilter(false)}
                className="text-sm text-black/60"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <FilterSidebar
                minRating={minRating}
                setMinRating={setMinRating}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="mt-6 flex gap-10">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block md:w-72 lg:w-80 shrink-0">
          <FilterSidebar
            minRating={minRating}
            setMinRating={setMinRating}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </aside>

        {/* BOOK GRID */}
        <div className="flex-1">
          {isLoading && (
            <p className="text-sm text-black/50">Loading books...</p>
          )}

          {filteredBooks.length === 0 && !isLoading && (
            <p className="text-sm text-black/50">No books found.</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
            {filteredBooks.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FILTER SIDEBAR ================= */

function FilterSidebar({
  minRating,
  setMinRating,
  selectedCategories,
  setSelectedCategories,
}: {
  minRating: number | null;
  setMinRating: (v: number | null) => void;
  selectedCategories: number[];
  setSelectedCategories: (v: number[]) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
      <h3 className="text-base md:text-lg font-semibold mb-6">Filter</h3>

      {/* CATEGORY */}
      <div className="mb-8">
        <p className="text-sm md:text-base font-semibold mb-3">Category</p>

        {[
          { id: 1, label: "Fiction" },
          { id: 2, label: "Non-Fiction" },
          { id: 7, label: "Self-Improvement" },
          { id: 3, label: "Finance" },
          { id: 4, label: "Science" },
          { id: 5, label: "Education" },
        ].map((cat) => {
          const checked = selectedCategories.includes(cat.id);

          return (
            <label
              key={cat.id}
              className="flex items-center gap-3 text-sm md:text-base mb-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    setSelectedCategories(
                      selectedCategories.filter((id) => id !== cat.id),
                    );
                  } else {
                    setSelectedCategories([...selectedCategories, cat.id]);
                  }
                }}
                className="h-4 w-4"
              />
              {cat.label}
            </label>
          );
        })}
      </div>

      {/* RATING */}
      <div>
        <p className="text-sm md:text-base font-semibold mb-3">Rating</p>

        {[5, 4, 3, 2, 1].map((r) => (
          <label
            key={r}
            className="flex items-center gap-3 text-sm md:text-base mb-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={minRating === r}
              onChange={() => setMinRating(minRating === r ? null : r)}
              className="h-4 w-4"
            />
            <span className="text-yellow-500">★</span>
            {r}+
          </label>
        ))}
      </div>
    </div>
  );
}
