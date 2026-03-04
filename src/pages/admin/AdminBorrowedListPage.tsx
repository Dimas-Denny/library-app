import React from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getAdminLoans,
  type Loan,
  type PaginatedLoansResponse,
} from "@/api/borrows.api";

type Filter = "ALL" | "BORROWED" | "RETURNED" | "OVERDUE";

const FILTERS: Filter[] = ["ALL", "BORROWED", "RETURNED", "OVERDUE"];

export default function AdminBorrowedListPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("ALL");

  const limit = 10;

  const { data, isLoading, isError } = useQuery<PaginatedLoansResponse>({
    queryKey: ["admin-loans", page, search, filter],
    queryFn: () =>
      getAdminLoans({
        page,
        limit,
        search,
        status: filter === "ALL" ? undefined : filter,
      }),
    placeholderData: (prev) => prev,
  });

  React.useEffect(() => {
    if (isError) toast.error("Failed to load borrowed list");
  }, [isError]);

  const loans = data?.loans ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (isLoading) {
    return <div className="p-10 text-black/50">Loading borrowed list...</div>;
  }

  return (
    <div className="px-4 md:px-16 py-8 space-y-6">
      {/* HEADER */}

      <h2 className="text-2xl font-semibold">Borrowed List</h2>

      {/* SEARCH */}

      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
        />

        <input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-black/10 text-sm"
        />
      </div>

      {/* FILTER */}

      <div className="flex gap-3 overflow-x-auto">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => {
              setPage(1);
              setFilter(item);
            }}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              filter === item
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "text-black/50 border-black/10"
            }`}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* LIST */}

      <div className="space-y-5">
        {loans.map((loan: Loan) => {
          const cover =
            loan.book.coverImage ||
            "https://via.placeholder.com/120x180.png?text=Book";

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm p-5"
            >
              {/* STATUS */}

              <div className="flex justify-between items-center text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-black/50">Status</span>

                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600 font-medium">
                    {loan.displayStatus ?? loan.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-black/50">Due Date</span>

                  <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded">
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-black/10 mb-4" />

              {/* CONTENT */}

              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* BOOK */}

                <div className="flex gap-4">
                  <img
                    src={cover}
                    alt={loan.book.title}
                    className="w-16 h-24 object-cover rounded"
                  />

                  <div className="flex flex-col gap-1">
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-full w-fit">
                      {loan.book.category?.name ?? "Category"}
                    </span>

                    <h3 className="font-medium leading-snug">
                      {loan.book.title}
                    </h3>

                    <p className="text-sm text-black/50">
                      {loan.book.author?.name ?? "Author name"}
                    </p>

                    <p className="text-xs text-black/60">
                      {formatDate(loan.borrowedAt)} · Duration{" "}
                      {loan.durationDays ?? "-"} Days
                    </p>
                  </div>
                </div>

                {/* BORROWER */}

                <div className="mt-3 md:mt-0 md:text-right border-t md:border-0 border-black/10 pt-3 md:pt-0">
                  <p className="text-black/50 text-xs">borrower's name</p>

                  <p className="font-medium">{loan.borrower.name}</p>
                </div>
              </div>
            </div>
          );
        })}

        {loans.length === 0 && (
          <div className="text-center py-10 text-black/40">
            No borrowed books found
          </div>
        )}
      </div>

      {/* PAGINATION */}

      <div className="flex justify-between text-sm text-black/60">
        <span>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
          {total}
        </span>

        <div className="flex gap-4">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹ Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
