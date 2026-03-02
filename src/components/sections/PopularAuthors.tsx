import { useQuery } from "@tanstack/react-query";
import AuthorAvatar from "@/assets/svg/authors.svg";
import BookIcon from "@/assets/svg/books.svg";
import { getPopularAuthors } from "@/api/authors.api";
import { Link } from "react-router-dom";

export default function PopularAuthors() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["popular-authors"],
    queryFn: getPopularAuthors,
  });

  const authors = data?.data?.authors ?? [];

  return (
    <section className="py-2 space-y-4 border-b border-black/10 pb-24">
      <h2 className="text-2xl font-bold">Popular Authors</h2>

      {isLoading && <p className="text-sm text-black/50">Loading authors...</p>}

      {isError && (
        <p className="text-sm text-red-500">Failed to load authors.</p>
      )}

      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-6">
        {authors.map((author) => (
          <Link
            to={`/authors/${author.id}`}
            key={author.id}
            className="
    flex items-center gap-4
    rounded-xl bg-white
    px-4 py-3
    shadow-[0_10px_24px_rgba(0,0,0,0.06)]
    transition
    hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)]
  "
          >
            {/* Avatar */}
            <div className="h-12 w-12 overflow-hidden rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <img
                src={AuthorAvatar}
                alt={author.name}
                className="h-10 w-10 object-contain"
              />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{author.name}</p>

              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-black/50">
                <img src={BookIcon} alt="Books" className="h-4 w-4" />
                <span>{author.bookCount} books</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
