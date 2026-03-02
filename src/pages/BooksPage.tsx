import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";
import type { Book } from "@/types/books";

export default function BooksPage() {
  const [params] = useSearchParams();
  const initialCategoryId = params.get("categoryId");

  // 🔥 Ambil semua books (tidak lagi berdasarkan categoryId)
  const { data, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: () => getBooks(),
  });

  const books: Book[] = data?.data?.books ?? [];

  // ⭐ Rating filter (single)
  const [minRating, setMinRating] = React.useState<number | null>(null);

  // 📚 Category filter (multi)
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    initialCategoryId ? [Number(initialCategoryId)] : [],
  );

  // 📱 Mobile filter toggle
  const [showFilter, setShowFilter] = React.useState(false);

  // 🔥 FINAL FILTER LOGIC
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

      {/* MOBILE FILTER BUTTON */}
      {/* MOBILE FILTER CARD */}
      <div className="mt-4 md:hidden">
        <div
          onClick={() => setShowFilter((v) => !v)}
          className="
      flex items-center justify-between
      rounded-xl bg-white
      px-4 py-3
      shadow-[0_8px_20px_rgba(0,0,0,0.06)]
      cursor-pointer
    "
        >
          <span className="text-sm font-semibold">FILTER</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        </div>
      </div>

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

        {/* MOBILE FILTER PANEL */}
        {showFilter && (
          <div className="md:hidden mb-6 w-full">
            <FilterSidebar
              minRating={minRating}
              setMinRating={setMinRating}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        )}

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
              <div
                key={b.id}
                className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-52 md:h-44">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="mt-1 text-xs text-black/45">{b.author?.name}</p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-black/60">
                    <span className="text-yellow-500">★</span>
                    <span>4.9</span>
                  </div>
                </div>
              </div>
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
