import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import {
  getAdminBookById,
  deleteBook,
  type AdminBookDetailResponse,
} from "@/api/books.api";

export default function AdminBookPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = React.useState(false);

  /* ================= FETCH BOOK ================= */

  const { data: book, isLoading } = useQuery<AdminBookDetailResponse>({
    queryKey: ["admin-book-detail", id],
    queryFn: () => getAdminBookById(id as string),
    enabled: !!id,
  });

  /* ================= DELETE ================= */

  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(Number(id)),

    onSuccess: () => {
      toast.success("Book deleted");

      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });

      navigate("/admin", {
        state: { activeTab: "BOOK" },
      });
    },

    onError: () => {
      toast.error("Failed to delete book");
    },
  });

  /* ================= LOADING ================= */

  if (isLoading || !book) {
    return <div className="p-10">Loading...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="px-4 md:px-16 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* HEADER */}

        <button
          onClick={() =>
            navigate("/admin", {
              state: { activeTab: "BOOK" },
            })
          }
          className="flex items-center gap-2 mb-8 text-black/60"
        >
          <ArrowLeft size={18} />
          <span className="text-2xl font-extrabold">Book Detail</span>
        </button>

        {/* CARD */}

        <div className="bg-white rounded-2xl border border-black/10 p-8 space-y-6">
          {/* COVER */}

          <img
            src={book.coverImage}
            alt={book.title}
            className="w-40 rounded-lg shadow"
          />

          {/* TITLE */}

          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>

            <p className="text-sm text-black/50 mt-1">by {book.author?.name}</p>
          </div>

          {/* INFO GRID */}

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-black/50">Category</p>
              <p className="font-medium">{book.category?.name}</p>
            </div>

            <div>
              <p className="text-black/50">Pages</p>
              <p className="font-medium">{book.pages}</p>
            </div>

            <div>
              <p className="text-black/50">Rating</p>
              <p className="font-medium">{book.rating ?? 0}</p>
            </div>

            <div>
              <p className="text-black/50">Reviews</p>
              <p className="font-medium">{book.reviewCount ?? 0}</p>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <p className="text-black/50 text-sm mb-2">Description</p>

            <p className="text-sm leading-relaxed text-black/80">
              {book.description}
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate(`/admin/books/${id}/edit`)}
              className="px-5 py-2 rounded-full border text-sm hover:bg-black/5"
            >
              Edit
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-5 py-2 rounded-full border border-red-200 text-red-500 text-sm hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ================= DELETE CONFIRM ================= */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[320px] space-y-4">
            <h2 className="text-lg font-semibold">Delete Book</h2>

            <p className="text-sm text-black/60">
              Once deleted, you won’t be able to recover this data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-full text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteMutation.mutate()}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
