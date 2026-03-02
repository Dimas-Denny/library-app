import client from "@/lib/client";
import type { Book } from "@/types/books";

export type LoanStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export type Loan = {
  id: number;
  userId: number;
  bookId: number;
  status: LoanStatus;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string | null;
  book: Book;
};

export type CreateLoanPayload = {
  bookId: number;
  days: number;
};

export const createLoan = async (payload: CreateLoanPayload) => {
  const res = await client.post("/loans", payload);
  return res.data;
};

export const getMyLoans = async (): Promise<Loan[]> => {
  const res = await client.get("/me/loans");

  const payload = res.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.loans)) return payload.loans;

  return [];
};

/* ================= RETURN LOAN ================= */
export const returnLoan = async (loanId: number) => {
  const res = await client.patch(`/loans/${loanId}/return`);
  return res.data;
};
