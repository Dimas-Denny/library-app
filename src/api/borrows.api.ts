import client from "@/lib/client";

/* ================= TYPES ================= */

export type LoanStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export type Loan = {
  id: number;

  status: LoanStatus;
  displayStatus: string;

  borrowedAt: string;
  dueAt: string;
  returnedAt?: string | null;

  durationDays?: number;

  book: {
    id: number;
    title: string;
    coverImage: string | null;

    author?: {
      id: number;
      name: string;
    };

    category?: {
      id: number;
      name: string;
    };
  };

  borrower: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedLoansResponse = {
  loans: Loan[];
  pagination: Pagination;
};

export type GetLoansParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ALL" | LoanStatus;
};

/* ================= INTERNAL API RESPONSE ================= */

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
    pagination: Pagination;
  };
};

/* ================= GET ADMIN LOANS ================= */

export async function getAdminLoans(
  params: GetLoansParams,
): Promise<PaginatedLoansResponse> {
  const res = await client.get<ApiResponse>("/admin/loans", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search ? { search: params.search } : {}),
      ...(params.status && params.status !== "ALL"
        ? { status: params.status }
        : {}),
    },
  });

  const data = res.data?.data;

  return {
    loans: data?.loans ?? [],
    pagination: data?.pagination ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };
}
