import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import {
  getAdminBooks,
  deleteBook,
  type PaginatedAdminBooksResponse,
} from "@/api/books.api";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

/* ================= TYPES ================= */

type StatusFilter = "ALL" | "AVAILABLE" | "BORROWED" | "RETURNED";

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "AVAILABLE",
  "BORROWED",
  "RETURNED",
];

export default function AdminBookListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");

  const [menuOpenId, setMenuOpenId] = React.useState<number | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [deleteTitle, setDeleteTitle] = React.useState("");

  const limit = 10;

  /* ================= CLOSE MENU WHEN CLICK OUTSIDE ================= */

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CLOSE MENU WHEN SCROLL ================= */

  React.useEffect(() => {
    function closeMenu() {
      setMenuOpenId(null);
    }

    window.addEventListener("scroll", closeMenu);

    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  /* ================= FETCH BOOKS ================= */

  const { data, isLoading } = useQuery<PaginatedAdminBooksResponse>({
    queryKey: ["admin-books", page, search],
    queryFn: () => getAdminBooks(page, limit, search),
    placeholderData: (prev) => prev,
  });

  const books = data?.books ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  /* ================= DELETE MUTATION ================= */

  const deleteMutation = useMutation({
    mutationFn: deleteBook,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });

      toast.success("Book deleted successfully");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? "Failed to delete book";

      toast.error(message);
    },
  });

  /* ================= FILTER ================= */

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
      {/* HEADER */}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Book List</h2>

        <button
          onClick={() => navigate("/admin/books/create")}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-16 py-2 rounded-full text-sm font-medium"
        >
          Add Book
        </button>
      </div>

      {/* SEARCH */}

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

      {/* FILTER */}

      <div className="flex gap-3 overflow-x-auto">
        {STATUS_FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setStatusFilter(item)}
            className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${
              statusFilter === item
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "text-black/50 border-black/10"
            }`}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* BOOK LIST */}

      <div className="space-y-4">
        {filteredBooks.map((book, index) => {
          const number = (page - 1) * limit + index + 1;

          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex items-center justify-between relative"
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
                    ⭐ {book.rating}
                  </div>
                </div>
              </div>

              {/* DESKTOP BUTTONS (UNCHANGED) */}

              <div className="hidden md:flex gap-3">
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

                <button
                  onClick={() => {
                    setDeleteId(book.id);
                    setDeleteTitle(book.title);
                  }}
                  className="px-4 py-1.5 rounded-full border text-sm text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              {/* MOBILE MENU */}

              <div className="md:hidden relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === book.id ? null : book.id);
                  }}
                >
                  <MoreHorizontal size={20} />
                </button>

                {menuOpenId === book.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-8 w-36 bg-white border border-black/10 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                  >
                    <button
                      onClick={() => {
                        navigate(`/admin/books/${book.id}`);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-black/5"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => {
                        navigate(`/admin/books/${book.id}/edit`);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-black/5"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(book.id);
                        setDeleteTitle(book.title);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="text-center py-10 text-black/40">No books found</div>
        )}
      </div>

      {/* PAGINATION */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/60 pt-4">
        <span>
          {total === 0
            ? "Showing 0 entries"
            : `Showing ${(page - 1) * limit + 1} to ${Math.min(
                page * limit,
                total,
              )} of ${total}`}
        </span>

        <div className="flex gap-4">
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

      {/* CONFIRM DELETE */}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Book"
        description={`Delete "${deleteTitle}"? Once deleted, you won’t be able to recover this data.`}
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;

          deleteMutation.mutate(deleteId, {
            onSettled: () => setDeleteId(null),
          });
        }}
      />
    </div>
  );
}
