import { Link } from "react-router-dom";
import type { Book } from "@/types/books";

type Props = {
  book: Book;
};

export default function BookCard({ book }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="
        group
        overflow-hidden rounded-xl bg-white
        shadow-[0_12px_30px_rgba(0,0,0,0.06)]
        transition-all duration-200
        hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]
        active:scale-[0.97]
      "
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={book.coverImage}
          alt={book.title}
          className="
      absolute inset-0 h-full w-full
      object-cover
      transition-transform duration-300
      group-hover:scale-105
    "
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold leading-snug line-clamp-2">
          {book.title}
        </p>

        <p className="mt-1 text-xs text-black/45">{book.author?.name}</p>

        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black/60">
          <span className="text-accent-yellow">★</span>
          <span>4.9</span>
        </div>
      </div>
    </Link>
  );
}
