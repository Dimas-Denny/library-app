import { useLocation, useNavigate } from "react-router-dom";

export default function BorrowSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnDate: Date = location.state?.returnDate
    ? new Date(location.state.returnDate)
    : new Date();

  const formattedReturnDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(returnDate);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 md:px-16 text-center space-y-6">
      {/* ICON */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-primary-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* subtle ripple */}
        <div className="absolute inset-0 rounded-full border border-primary-300 animate-ping opacity-20" />
      </div>

      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold">Borrowing Successful!</h1>

      {/* MESSAGE */}
      <p className="text-sm md:text-base text-black/60 max-w-md">
        Your book has been successfully borrowed. Please return it by{" "}
        <span className="text-red-500 font-semibold">
          {formattedReturnDate}
        </span>
      </p>

      {/* BUTTON */}
      <button
        onClick={() => navigate("/borrowed-list")}
        className="px-8 py-3 rounded-full bg-primary-300 text-white text-sm md:text-base hover:opacity-90 transition"
      >
        See Borrowed List
      </button>
    </div>
  );
}
