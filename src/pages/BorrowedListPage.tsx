import React from "react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyLoans, returnLoan, type Loan } from "@/api/loans.api";
import ReviewModal from "@/components/review/ReviewModal";
import type { Book } from "@/types/books";
import { getMyReviews } from "@/api/reviews.api";
import type { MyReview } from "@/types/review";

type FilterType = "ALL" | "BORROWED" | "RETURNED" | "OVERDUE";

export default function BorrowedListPage() {
  const queryClient = useQueryClient();

  const {
    data: loans = [],
    isLoading,
    isError,
  } = useQuery<Loan[]>({
    queryKey: ["my-loans"],
    queryFn: getMyLoans,
  });

  const { data: myReviews = [] } = useQuery<MyReview[]>({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
  });

  const returnMutation = useMutation({
    mutationFn: (loanId: number) => returnLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
    },
  });

  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [filter, setFilter] = React.useState<FilterType>("ALL");
  const [search, setSearch] = React.useState("");

  function formatDate(date?: string) {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(parsed);
  }

  function getStatusBadge(status: string) {
    if (status === "OVERDUE") return "bg-red-100 text-red-500";
    if (status === "RETURNED") return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
  }

  const filteredLoans = loans
    .filter((loan) => (filter === "ALL" ? true : loan.status === filter))
    .filter((loan) =>
      loan.book?.title?.toLowerCase().includes(search.toLowerCase()),
    );

  if (isLoading) return <div className="px-4 md:px-16 py-8">Loading...</div>;

  if (isError)
    return <div className="px-4 md:px-16 py-8">Error loading data</div>;

  function hasReviewed(bookId: number) {
    return myReviews.some((review) => review.book.id === bookId);
  }

  return (
    <div className="px-4 md:px-16 py-8 space-y-8">
      <ProfileTabs />

      <h1 className="text-2xl font-bold">Borrowed List</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search book"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border rounded-full px-4 py-2 text-sm"
      />

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">
        {(["ALL", "BORROWED", "RETURNED", "OVERDUE"] as FilterType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === type ? "bg-primary-300 text-white" : "bg-black/5"
              }`}
            >
              {type}
            </button>
          ),
        )}
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {filteredLoans.map((loan) => {
          const book = loan.book;
          if (!book) return null;

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl p-6 shadow space-y-4"
            >
              {/* TOP */}
              <div className="flex justify-between text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(
                    loan.status,
                  )}`}
                >
                  {loan.status}
                </span>

                <span>Due: {formatDate(loan.dueAt)}</span>
              </div>

              <hr />

              {/* CONTENT */}
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 rounded-md object-cover"
                  />

                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-black/50">{book.author?.name}</p>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {loan.status === "BORROWED" && (
                  <button
                    onClick={() => returnMutation.mutate(loan.id)}
                    className="px-6 py-2 rounded-full bg-black text-white text-sm"
                  >
                    Return Book
                  </button>
                )}

                {loan.status === "RETURNED" && (
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="px-6 py-2 rounded-full bg-primary-300 text-white text-sm hover:opacity-90 transition"
                  >
                    {hasReviewed(book.id) ? "Edit Review" : "Give Review"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REVIEW MODAL */}
      {selectedBook && (
        <ReviewModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
