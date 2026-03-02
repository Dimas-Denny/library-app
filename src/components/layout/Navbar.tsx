import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "@/assets/svg/logo.svg";
import Bag from "@/assets/svg/bag.svg";
import AuthorsAvatar from "@/assets/svg/authors.svg";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = Boolean(token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (searchMode) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [searchMode]);

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    setSearchMode(false);
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function openSearch() {
    setOpen(false);
    setSearchMode(true);
    setMobileMenuOpen(false);
  }

  function closeSearch() {
    setQ("");
    setSearchMode(false);
    searchRef.current?.blur();
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/books?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div
        className={`
    mx-auto flex h-16 w-full items-center px-4 md:px-16
    ${searchMode ? "gap-3" : ""}
  `}
      >
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-10 w-10" />
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* ================= DESKTOP SEARCH ================= */}
        {isLoggedIn && (
          <form
            onSubmit={onSubmitSearch}
            className="hidden md:flex flex-1 justify-center px-10"
          >
            <div className="relative w-full max-w-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search book"
                className="h-10 w-full rounded-full border border-black/15 bg-white pl-12 pr-5 text-sm placeholder:text-black/40 outline-none focus:border-black/30"
              />
            </div>
          </form>
        )}

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="h-9 w-28 rounded-full border border-black/15 bg-white px-5 text-sm font-medium text-black hover:bg-black/5"
              >
                <span className="inline-flex h-full items-center">Login</span>
              </Link>

              <Link
                to="/register"
                className="h-9 w-28 rounded-full bg-primary-300 px-5 text-sm font-semibold text-white hover:opacity-90"
              >
                <span className="inline-flex h-full items-center">
                  Register
                </span>
              </Link>
            </>
          ) : (
            <div className="relative flex items-center gap-3">
              <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5">
                <img src={Bag} alt="Bag" className="h-6 w-6" />
              </button>

              <img
                src={AuthorsAvatar}
                alt="Avatar"
                className="h-9 w-9 rounded-full"
              />

              <span className="text-sm font-semibold text-black">
                {user?.name ?? "User"}
              </span>

              <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {open && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-12 w-56 rounded-2xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
                >
                  <div className="p-3">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-black/50">{user?.email}</p>

                    <div className="my-3 h-px bg-black/10" />

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#EE1D52] hover:bg-[#EE1D52]/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        {isLoggedIn && (
          <div className="relative flex items-center md:hidden flex-1 justify-end">
            {!searchMode ? (
              <div className="flex items-center gap-4">
                {/* Search */}
                <button
                  onClick={openSearch}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
                >
                  <svg
                    className="h-6 w-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                {/* Bag */}
                <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5">
                  <img src={Bag} alt="Bag" className="h-6 w-6" />
                </button>

                {/* Avatar */}
                <button onClick={() => setMobileMenuOpen((v) => !v)}>
                  <img
                    src={AuthorsAvatar}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full"
                  />
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-3">
                <form onSubmit={onSubmitSearch} className="flex-1">
                  <div className="relative w-full">
                    <svg
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    <input
                      ref={searchRef}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search book"
                      className="
          h-10 w-full
          rounded-full
          border border-black/15
          bg-white
          pl-12 pr-4
          text-sm
          placeholder:text-black/40
          outline-none
          focus:border-black/30
        "
                    />
                  </div>
                </form>

                <button onClick={closeSearch} className="text-2xl font-medium">
                  ✕
                </button>
              </div>
            )}

            {/* MOBILE FLOATING MENU */}
            {mobileMenuOpen && !searchMode && (
              <div className="absolute right-0 top-14 w-60 rounded-2xl bg-white shadow-[0_25px_55px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
                <div className="p-4">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-black/50">{user?.email}</p>

                  <div className="my-4 h-px bg-black/10" />

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#EE1D52] hover:bg-[#EE1D52]/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
