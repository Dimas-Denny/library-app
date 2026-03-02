import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCart } from "@/store/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const navigate = useNavigate();

  function toggleSelect(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.book.id));
    }
  }

  const selectedItems = items.filter((i) => selectedIds.includes(i.book.id));

  return (
    <div className="px-4 md:px-16 py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {items.length === 0 ? (
        <p className="text-sm text-black/50">Cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          {/* ================= LEFT LIST ================= */}
          <div className="flex-1 space-y-6">
            {/* SELECT ALL */}
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4"
              />
              Select All
            </label>

            {/* ITEM LIST */}
            {items.map((item) => {
              const book = item.book;
              const checked = selectedIds.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="flex items-start gap-4 border-b border-black/10 pb-6"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(book.id)}
                    className="mt-6 h-4 w-4"
                  />

                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-md">
                      {book.category.name}
                    </span>

                    <p className="mt-2 font-semibold">{book.title}</p>

                    <p className="text-sm text-black/50">{book.author.name}</p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(book.id))}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* ================= DESKTOP SUMMARY ================= */}
          <div className="hidden md:block w-72 shrink-0">
            <div className="rounded-2xl bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6">
              <h3 className="font-semibold">Loan Summary</h3>

              <div className="flex justify-between text-sm">
                <span>Total Book</span>
                <span>{selectedItems.length} Items</span>
              </div>

              <button
                disabled={selectedItems.length === 0}
                onClick={() =>
                  navigate("/checkout", {
                    state: { books: selectedItems.map((i) => i.book) },
                  })
                }
                className="w-full py-2 rounded-full bg-primary-300 text-white text-sm disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE SUMMARY (NON FIXED) ================= */}
      {items.length > 0 && (
        <div className="md:hidden mt-8 rounded-2xl bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex items-center justify-between">
          <div>
            <p className="text-xs text-black/50">Total Book</p>
            <p className="text-sm font-semibold">
              {selectedItems.length} Items
            </p>
          </div>

          <button
            disabled={selectedItems.length === 0}
            onClick={() =>
              navigate("/checkout", {
                state: { books: selectedItems.map((i) => i.book) },
              })
            }
            className="px-6 py-2 rounded-full bg-primary-300 text-white text-sm disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
