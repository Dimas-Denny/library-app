import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import AuthorDetailPage from "./pages/AuthorDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import BorrowSuccessPage from "./pages/BorrowSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import BorrowedListPage from "./pages/BorrowedListPage";
import ReviewsPage from "./pages/ReviewsPage";

export default function App() {
  const location = useLocation();

  const hideFooterOnly = location.pathname === "/borrow-success";

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/authors/:id" element={<AuthorDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/borrow-success" element={<BorrowSuccessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/borrowed-list" element={<BorrowedListPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>

      {!hideLayout && !hideFooterOnly && <Footer />}
    </>
  );
}
