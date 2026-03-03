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

  const { data: loans = [], isLoading } = useQuery<Loan[]>({
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
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusStyle(status: string) {
    if (status === "OVERDUE") return "bg-red-100 text-red-500";
    if (status === "RETURNED") return "bg-green-100 text-green-600";
    return "bg-green-100 text-green-600";
  }

  const filteredLoans = loans
    .filter((loan) => (filter === "ALL" ? true : loan.status === filter))
    .filter((loan) =>
      loan.book?.title?.toLowerCase().includes(search.toLowerCase()),
    );

  function hasReviewed(bookId: number) {
    return myReviews.some((review) => review.book.id === bookId);
  }

  if (isLoading) return <div className="px-4 md:px-16 py-8">Loading...</div>;

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

      {/* FILTER PILLS */}
      <div className="flex gap-3 flex-wrap">
        {(["ALL", "BORROWED", "RETURNED", "OVERDUE"] as FilterType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                filter === type
                  ? "border-primary-300 text-primary-300 bg-primary-50"
                  : "border-black/10 text-black/60 bg-white"
              }`}
            >
              {type === "ALL"
                ? "All"
                : type === "BORROWED"
                  ? "Active"
                  : type === "RETURNED"
                    ? "Returned"
                    : "Overdue"}
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
              {/* STATUS + DUE */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-black/60">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                      loan.status,
                    )}`}
                  >
                    {loan.status === "BORROWED"
                      ? "Active"
                      : loan.status === "RETURNED"
                        ? "Returned"
                        : "Overdue"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-black/60">Due Date</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-500">
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-black/5" />

              {/* CONTENT */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 rounded-md object-cover"
                  />

                  <div>
                    <span className="text-xs px-3 py-1 bg-black/5 rounded-full">
                      {book.category?.name ?? "Category"}
                    </span>

                    <p className="font-semibold mt-2">{book.title}</p>
                    <p className="text-sm text-black/50">{book.author?.name}</p>

                    <p className="text-xs mt-2 text-black/60">
                      {formatDate(loan.borrowedAt)} · Duration 3 Days
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {loan.status === "BORROWED" && (
                  <button
                    onClick={() => returnMutation.mutate(loan.id)}
                    className="w-full md:w-auto px-6 py-2 rounded-full bg-black text-white text-sm"
                  >
                    Return Book
                  </button>
                )}

                {loan.status === "RETURNED" && (
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="w-full md:w-auto px-6 py-2 rounded-full bg-primary-300 text-white text-sm"
                  >
                    {hasReviewed(book.id) ? "Edit Review" : "Give Review"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBook && (
        <ReviewModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
