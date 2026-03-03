import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import {
  getAdminBookById,
  type AdminBookDetailResponse,
} from "@/api/books.api";

export default function AdminBookPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery<AdminBookDetailResponse>({
    queryKey: ["admin-book-detail", id],
    queryFn: () => getAdminBookById(id as string),
    enabled: !!id,
  });

  function handleDelete(): void {
    console.log("Delete book id:", id);
    alert("Delete clicked (dummy)");
  }

  if (isLoading) {
    return <div className="p-10">Loading book detail...</div>;
  }

  if (isError || !book) {
    return <div className="p-10 text-red-500">Failed to load book detail</div>;
  }

  return (
    <div className="px-4 md:px-16 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/admin", { state: { activeTab: "BOOK" } })}
        className="flex items-center gap-2 text-sm text-black/60 mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* COVER */}
        <div>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-64 rounded-xl shadow"
          />
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-5">
          <div>
            <span className="text-xs bg-black/5 px-2 py-1 rounded-full">
              {book.category?.name}
            </span>

            <h1 className="text-2xl font-semibold mt-3">{book.title}</h1>

            <p className="text-black/50">{book.author?.name}</p>

            <div className="mt-2">
              ⭐ {book.rating} ({book.reviewCount})
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-12 border-b pb-4">
            <div>
              <p className="font-semibold text-lg">{book.pages}</p>
              <p className="text-sm text-black/50">Page</p>
            </div>

            <div>
              <p className="font-semibold text-lg">{book.totalCopies}</p>
              <p className="text-sm text-black/50">Total Copies</p>
            </div>

            <div>
              <p className="font-semibold text-lg">{book.availableCopies}</p>
              <p className="text-sm text-black/50">Available</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>

            <p className="text-sm text-black/70 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate(`/admin/books/${id}/edit`)}
              className="px-6 py-2 rounded-full border text-sm hover:bg-black/5"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-6 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
