import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminBooks,
  type PaginatedAdminBooksResponse,
} from "@/api/books.api";

export default function AdminBookListPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const limit = 10;

  const { data, isLoading } = useQuery<PaginatedAdminBooksResponse>({
    queryKey: ["admin-books", page, search],
    queryFn: () => getAdminBooks(page, limit, search),
    placeholderData: (prev) => prev,
  });

  const books = data?.books ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  if (isLoading && !data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Book List</h2>

      <input
        placeholder="Search book"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="w-full md:w-96 border rounded-full px-4 py-2 text-sm"
      />

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-black/60">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Cover</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Copies</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => {
                const number = (page - 1) * limit + index + 1;

                return (
                  <tr key={book.id} className="border-t">
                    <td className="p-4">{number}</td>

                    <td className="p-4">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-md"
                      />
                    </td>

                    <td className="p-4 font-medium">{book.title}</td>
                    <td className="p-4">{book.author?.name}</td>
                    <td className="p-4">{book.category?.name}</td>
                    <td className="p-4">
                      ⭐ {book.rating} ({book.reviewCount})
                    </td>
                    <td className="p-4">
                      {book.availableCopies} / {book.totalCopies}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARD ================= */}
        <div className="md:hidden space-y-4 p-4">
          {books.map((book, index) => {
            const number = (page - 1) * limit + index + 1;

            return (
              <div
                key={book.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-black/5 space-y-3"
              >
                <div className="flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-md"
                  />

                  <div className="space-y-1 text-sm">
                    <p className="text-xs text-black/40">#{number}</p>

                    <p className="font-semibold">{book.title}</p>
                    <p className="text-black/50">{book.author?.name}</p>
                    <p className="text-black/50">{book.category?.name}</p>

                    <p>
                      ⭐ {book.rating} ({book.reviewCount})
                    </p>

                    <p>
                      Copies: {book.availableCopies} / {book.totalCopies}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 text-sm text-black/60">
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

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 text-sm disabled:opacity-40"
            >
              ‹ Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 text-sm disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
