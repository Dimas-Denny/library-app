import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AuthorAvatar from "@/assets/svg/authors.svg";
import BookIcon from "@/assets/svg/books.svg";
import { getBooks } from "@/api/books.api";
import type { Book } from "@/types/books";

export default function AuthorDetailPage() {
  const { id } = useParams();
  const authorId = Number(id);

  const { data, isLoading } = useQuery({
    queryKey: ["all-books"],
    queryFn: () => getBooks(),
  });

  const allBooks: Book[] = data?.data?.books ?? [];

  // 🔥 filter di frontend
  const books = allBooks.filter((b) => b.authorId === authorId);

  const authorName = books[0]?.author?.name ?? "Author";

  return (
    <div className="px-4 md:px-16 py-8">
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
              <p className="mt-1 text-xs text-black/45">{authorName}</p>

              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black/60">
                <span className="text-accent-yellow">★</span>
                <span>4.9</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
