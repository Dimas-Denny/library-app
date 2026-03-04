import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AuthorAvatar from "@/assets/svg/authors.svg";
import BookIcon from "@/assets/svg/books.svg";
import { getBooks, type GetBooksResponse } from "@/api/books.api";
import BookCard from "@/components/books/BookCard";

export default function AuthorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authorId = Number(id);

  const { data, isLoading } = useQuery<GetBooksResponse>({
    queryKey: ["all-books"],
    queryFn: () => getBooks(),
  });

  // semua buku
  const allBooks = data?.books ?? [];

  // filter buku berdasarkan author
  const books = allBooks.filter((b) => b.author?.id === authorId);

  const authorName = books[0]?.author?.name ?? "Author";

  return (
    <div className="px-4 md:px-16 py-8">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black transition"
      >
        ← Back
      </button>

      {/* AUTHOR CARD */}
      <div className="flex items-center gap-4 rounded-xl bg-white px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <img src={AuthorAvatar} alt={authorName} className="h-12 w-12" />
        </div>

        <div>
          <p className="text-base font-semibold">{authorName}</p>

          <div className="mt-1 flex items-center gap-2 text-sm text-black/50">
            <img src={BookIcon} alt="Books" className="h-4 w-4" />
            <span>{books.length} books</span>
          </div>
        </div>
      </div>

      {/* BOOK LIST */}
      <h2 className="mt-8 text-2xl font-bold">Book List</h2>

      {isLoading && (
        <p className="mt-4 text-sm text-black/50">Loading books...</p>
      )}

      {books.length === 0 && !isLoading && (
        <p className="mt-4 text-sm text-black/50">No books found.</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}
