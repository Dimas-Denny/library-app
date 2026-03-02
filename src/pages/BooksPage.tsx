import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books.api";

const CATEGORY_LABELS: Record<number, string> = {
  1: "Fiction",
  2: "Non-Fiction",
  7: "Self-Improvement",
  3: "Finance",
  4: "Science",
  5: "Education",
};

export default function BooksPage() {
  const [params] = useSearchParams();
  const categoryIdParam = params.get("categoryId");

  const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", categoryId],
    queryFn: () => getBooks(categoryId ? { categoryId } : {}),
  });

  const books = data?.data.books ?? [];

  // 🔥 Ini bagian penting
  const pageTitle = categoryId
    ? (CATEGORY_LABELS[categoryId] ?? "Category")
    : "All Books";

  return (
    <div className="px-4 md:px-16 py-6 space-y-6">
      <h1 className="text-xl font-bold">{pageTitle}</h1>

      {isLoading && <p>Loading books...</p>}

      {isError && <p className="text-red-500">Failed to load books.</p>}

      {!isLoading && books.length === 0 && <p>No books found.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="rounded-2xl bg-white p-3 shadow-sm">
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-44 w-full rounded-xl object-cover"
            />

            <p className="mt-3 text-sm font-semibold line-clamp-2">
              {book.title}
            </p>

            <p className="text-xs text-black/50">{book.author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
