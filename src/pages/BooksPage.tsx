import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";
import type { Book } from "@/types/books";

export default function BooksPage() {
  const [params] = useSearchParams();
  const category = params.get("category") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", category],
    queryFn: () => getBooks({ category }),
  });

  console.log("RAW:", data);

  const books: Book[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.items)
      ? data.data.items
      : [];

  return (
    <div className="px-4 md:px-16 py-6 space-y-6">
      <h1 className="text-xl font-bold capitalize">
        {category || "All Books"}
      </h1>
      {isLoading && <p>Loading books...</p>}
      {isError && <p className="text-red-500">Failed to load books.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="rounded-2xl bg-white p-3 shadow-sm">
            <img
              src={book.cover}
              alt={book.title}
              className="h-44 w-full rounded-xl object-cover"
            />

            <p className="mt-3 text-sm font-semibold line-clamp-2">
              {book.title}
            </p>

            <p className="text-xs text-black/50">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
