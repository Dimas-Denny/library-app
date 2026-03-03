import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { setToken, setUser } from "@/store/authSlice";

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
import AdminRoute from "@/routes/AdminRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBookPreviewPage from "@/pages/admin/AdminBookPreviewPage";

import AdminBookEditPage from "@/pages/admin/AdminBookEditPage";

export default function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // 🔥 TAMBAHKAN INI
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      dispatch(setToken(token));
    }

    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

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
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books/:id"
          element={
            <AdminRoute>
              <AdminBookPreviewPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books/:id/edit"
          element={
            <AdminRoute>
              <AdminBookEditPage />
            </AdminRoute>
          }
        />
      </Routes>

      {!hideLayout && !hideFooterOnly && <Footer />}
    </>
  );
}
