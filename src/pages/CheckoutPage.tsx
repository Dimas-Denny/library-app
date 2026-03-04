import React from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import type { Book } from "@/types/books";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import { createLoan } from "@/api/loans.api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((s) => s.cart.items);
  const books: Book[] = cartItems.map((item) => item.book);

  const user = useAppSelector((s) => s.auth.user);

  const [duration, setDuration] = React.useState(3);
  const [agreeReturn, setAgreeReturn] = React.useState(false);
  const [agreePolicy, setAgreePolicy] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const borrowDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(borrowDate.getDate() + duration);

  /* ================= EMPTY CART ================= */
  if (books.length === 0) {
    return (
      <div className="px-4 md:px-16 py-10">
        <p>No books in cart.</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 rounded-full border border-black/20 hover:bg-black/5"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const formattedBorrowDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(borrowDate);

  const formattedReturnDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(returnDate);

  /* ================= BORROW HANDLER ================= */
  async function handleBorrow() {
    try {
      setLoading(true);

      for (const book of books) {
        const payload = {
          bookId: book.id,
          days: duration,
        };

        console.log("Sending loan payload:", payload);

        const res = await createLoan(payload);

        console.log("Loan success:", res);
      }

      dispatch(clearCart());

      navigate("/borrow-success");
    } catch (error) {
      console.error("Loan failed:", error);

      if (error instanceof AxiosError) {
        const message =
          (error.response?.data as { message?: string })?.message ??
          "Borrow failed";

        alert(message);
      } else {
        alert("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 md:px-16 py-8 space-y-10">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm hover:text-primary-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* ================= LEFT ================= */}
        <div className="flex-1 space-y-8">
          {/* USER INFO */}
          <div>
            <h2 className="font-semibold mb-4">User Information</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Name</span>
                <span>{user?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Email</span>
                <span>{user?.email}</span>
              </div>

              <div className="flex justify-between">
                <span>Phone</span>
                <span>{user?.phone ?? "-"}</span>
              </div>
            </div>
          </div>

          {/* BOOK LIST */}
          <div>
            <h2 className="font-semibold mb-4">Book List</h2>

            <div className="space-y-6">
              {books.map((book) => (
                <div key={book.id} className="flex items-start gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />

                  <div>
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-md">
                      {book.category?.name}
                    </span>

                    <p className="mt-2 font-semibold">{book.title}</p>

                    <p className="text-sm text-black/50">{book.author?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="md:w-115 lg:w-125 shrink-0">
          <div className="rounded-2xl bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6">
            <h3 className="font-semibold text-lg">
              Complete Your Borrow Request
            </h3>

            {/* Borrow Date */}
            <div>
              <p className="text-sm mb-2">Borrow Date</p>

              <div className="border rounded-md px-3 py-2 text-sm">
                {formattedBorrowDate}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-sm mb-2">Borrow Duration</p>

              {[3, 5, 10].map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-3 text-sm mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={duration === d}
                    onChange={() => setDuration(d)}
                  />
                  {d} Days
                </label>
              ))}
            </div>

            {/* Return Date */}
            <div className="bg-black/5 p-3 rounded-md text-sm space-y-1">
              <p className="font-medium">Return Date</p>

              <p className="text-black/60">
                Please return the book no later than
              </p>

              <p className="text-red-500 font-semibold">
                {formattedReturnDate}
              </p>
            </div>

            {/* Agreements */}
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeReturn}
                  onChange={() => setAgreeReturn(!agreeReturn)}
                />
                I agree to return the book(s) before the due date.
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={() => setAgreePolicy(!agreePolicy)}
                />
                I accept the library borrowing policy.
              </label>
            </div>

            {/* CONFIRM BUTTON */}
            <button
              disabled={!agreeReturn || !agreePolicy || loading}
              onClick={handleBorrow}
              className="w-full py-3 rounded-full bg-primary-300 text-white text-sm disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? "Processing..." : "Confirm & Borrow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
