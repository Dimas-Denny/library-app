import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import {
  getAdminBooks,
  type PaginatedAdminBooksResponse,
} from "@/api/books.api";
import { useNavigate } from "react-router-dom";

/* =======================
   TYPES
======================= */

type StatusFilter = "ALL" | "AVAILABLE" | "BORROWED" | "RETURNED";

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "AVAILABLE",
  "BORROWED",
  "RETURNED",
];

/* =======================
   COMPONENT
======================= */

export default function AdminBookListPage() {
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");

  const limit = 10;

  const { data, isLoading } = useQuery<PaginatedAdminBooksResponse>({
    queryKey: ["admin-books", page, search],
    queryFn: () => getAdminBooks(page, limit, search),
    placeholderData: (prev) => prev,
  });

  const books = data?.books ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  const navigate = useNavigate();

  /* =======================
     LOCAL FILTER (UI only)
     (kalau backend belum support status filter)
  ======================= */

  const filteredBooks =
    statusFilter === "ALL"
      ? books
      : books.filter((book) => {
          const borrowed = book.availableCopies < book.totalCopies;
          const returned =
            book.availableCopies === book.totalCopies && book.totalCopies > 0;

          if (statusFilter === "AVAILABLE") return book.availableCopies > 0;

          if (statusFilter === "BORROWED") return borrowed;

          if (statusFilter === "RETURNED") return returned;

          return true;
        });

  if (isLoading && !data) return <div>Loading...</div>;

  return (
    <div className="px-4 md:px-16 py-8 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Book List</h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium">
          Add Book
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
        />

        <input
          placeholder="Search book"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-3">
        {STATUS_FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setStatusFilter(item)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              statusFilter === item
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "text-black/50 border-black/10"
            }`}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* ================= BOOK LIST ================= */}
      <div className="space-y-4">
        {filteredBooks.map((book, index) => {
          const number = (page - 1) * limit + index + 1;

          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex items-center justify-between"
            >
              {/* LEFT */}
              <div className="flex gap-4 items-center">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-full">
                      {book.category?.name}
                    </span>

                    <span className="text-xs text-black/40">#{number}</span>
                  </div>

                  <h3 className="font-medium">{book.title}</h3>

                  <p className="text-sm text-black/50">{book.author?.name}</p>

                  <div className="flex items-center gap-1 mt-1 text-sm">
                    ⭐ {book.rating} ({book.reviewCount})
                  </div>

                  <div className="text-sm text-black/50 mt-1">
                    Copies: {book.availableCopies} / {book.totalCopies}
                  </div>
                </div>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/admin/books/${book.id}`)}
                  className="px-4 py-1.5 rounded-full border text-sm text-black/60 hover:bg-black/5"
                >
                  Preview
                </button>

                <button
                  onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                  className="px-4 py-1.5 rounded-full border text-sm text-black/60 hover:bg-black/5"
                >
                  Edit
                </button>

                <button className="px-4 py-1.5 rounded-full border text-sm text-red-500 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="text-center py-10 text-black/40">No books found</div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/60 pt-4">
        <span>
          {total === 0 ? (
            "Showing 0 to 0 of 0 entries"
          ) : (
            <>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} entries
            </>
          )}
        </span>

        <div className="flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            ‹ Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
