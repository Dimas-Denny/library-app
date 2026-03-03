import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/svg/logo.svg";
import Bag from "@/assets/svg/bag.svg";
import AuthorsAvatar from "@/assets/svg/authors.svg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState(false);
  const [q, setQ] = React.useState("");

  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);

  const isLoggedIn = Boolean(token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* ================= AUTO FOCUS MOBILE SEARCH ================= */
  React.useEffect(() => {
    if (mobileSearch) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [mobileSearch]);

  /* ================= CLICK OUTSIDE DESKTOP ================= */
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/books?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="relative mx-auto flex h-16 w-full items-center px-4 md:px-16">
        {/* ================= LEFT ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-10 w-10" />
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* ================= DESKTOP SEARCH ================= */}
        {isLoggedIn && (
          <div className="hidden md:flex flex-1 justify-center px-10">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search book"
                className="h-11 w-full rounded-full border border-black/15 px-6 text-sm outline-none focus:border-black/30"
              />
            </form>
          </div>
        )}

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full border border-black/20 text-sm font-semibold hover:bg-black/5"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-full bg-primary-300 text-white text-sm font-semibold hover:opacity-90"
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                <img src={Bag} alt="Cart" className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* AVATAR + NAME */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3"
              >
                <img
                  src={AuthorsAvatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-sm font-semibold">
                  {user?.name ?? "User"}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* DESKTOP DROPDOWN */}
              {open && (
                <div
                  ref={menuRef}
                  className="absolute right-6 top-16 w-64 rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5 z-50"
                >
                  <div className="px-6 py-6 space-y-5 text-sm">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="block w-full text-left hover:opacity-70 transition"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/borrowed-list");
                        setOpen(false);
                      }}
                      className="block w-full text-left hover:opacity-70 transition"
                    >
                      Borrowed List
                    </button>

                    <button
                      onClick={() => {
                        navigate("/reviews");
                        setOpen(false);
                      }}
                      className="block w-full text-left hover:opacity-70 transition"
                    >
                      Reviews
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-red-500 hover:opacity-70 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden ml-auto flex items-center gap-4">
          {mobileSearch ? (
            <form
              onSubmit={handleSearchSubmit}
              className="absolute left-0 top-0 w-full h-16 bg-white flex items-center px-4 gap-3 z-50"
            >
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search book"
                className="h-11 flex-1 rounded-full border border-black/15 px-5 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setMobileSearch(false)}
                className="text-xl"
              >
                ✕
              </button>
            </form>
          ) : (
            <>
              {/* SEARCH */}
              <button
                onClick={() => setMobileSearch(true)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                🔍
              </button>

              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                <img src={Bag} alt="Cart" className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* AVATAR */}
              <button onClick={() => setMobileMenuOpen((v) => !v)}>
                <img
                  src={AuthorsAvatar}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full"
                />
              </button>

              {/* MOBILE DROPDOWN */}
              {mobileMenuOpen && (
                <div className="absolute left-0 top-16 w-full bg-white rounded-b-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-t border-black/5 z-50">
                  <div className="px-6 py-8 space-y-6 text-sm">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/borrowed-list");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left"
                    >
                      Borrowed List
                    </button>

                    <button
                      onClick={() => {
                        navigate("/reviews");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left"
                    >
                      Reviews
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
