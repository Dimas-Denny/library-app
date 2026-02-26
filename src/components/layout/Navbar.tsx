import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "@/assets/svg/logo.svg";
import Bag from "@/assets/svg/bag.svg";
import AuthorsAvatar from "@/assets/svg/authors.svg";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const [open, setOpen] = React.useState(false); // bubble menu (desktop & mobile guest)
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  // ✅ mobile search mode (logged in)
  const [searchMode, setSearchMode] = React.useState(false);
  const [q, setQ] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = Boolean(token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // close when click outside (bubble)
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

  // auto focus input saat masuk searchMode
  React.useEffect(() => {
    if (searchMode) {
      // kecilin delay biar keyboard muncul enak di mobile
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [searchMode]);

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    setSearchMode(false);
    navigate("/login", { replace: true });
  }

  function openSearch() {
    setOpen(false);
    setSearchMode(true);
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
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-16">
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-10 w-10" />
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* RIGHT - Desktop (md+) */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="h-9 w-28 rounded-full border border-black/15 bg-white px-5 text-sm text-center font-medium text-black hover:bg-black/5"
              >
                <span className="inline-flex h-full items-center">Login</span>
              </Link>

              <Link
                to="/register"
                className="h-9 w-28 rounded-full bg-primary-300 px-5 text-sm font-semibold text-white text-center hover:opacity-90"
              >
                <span className="inline-flex h-full items-center">
                  Register
                </span>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                ref={btnRef}
                type="button"
                aria-label="Account menu"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white hover:bg-black/5 active:bg-black/10"
              >
                <img
                  src={AuthorsAvatar}
                  alt="Avatar"
                  className="h-7 w-7 object-contain"
                />
              </button>

              {open ? (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-label="Account menu"
                  className="
                    absolute right-0 top-12
                    w-52 overflow-hidden rounded-2xl bg-white
                    shadow-[0_18px_45px_rgba(0,0,0,0.14)]
                    ring-1 ring-black/5
                    animate-in fade-in zoom-in-95
                  "
                >
                  <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-white ring-1 ring-black/5" />

                  <div className="relative p-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-black">
                        {user?.name ?? "Account"}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-black/50">
                        {user?.email ?? ""}
                      </p>
                    </div>

                    <div className="my-1 h-px w-full bg-black/10" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#EE1D52] hover:bg-[#EE1D52]/10"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* RIGHT - Mobile (<md) */}
        <div className="md:hidden">
          {/* ✅ Logged in */}
          {isLoggedIn ? (
            <>
              {/* SEARCH MODE (logo + input + X) */}
              {searchMode ? (
                <div className="ml-2 flex items-center gap-3">
                  <form onSubmit={onSubmitSearch} className="flex items-center">
                    <input
                      ref={searchRef}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search book"
                      className="
                        h-10 w-[68vw]
                        rounded-full border border-black/15
                        bg-white px-4 text-sm text-black
                        placeholder:text-black/40
                        outline-none focus:border-black/25
                      "
                    />
                  </form>

                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={closeSearch}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6l-12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                /* DEFAULT MODE (icon sebelumnya) */
                <div className="relative flex items-center gap-2">
                  {/* Search */}
                  <button
                    type="button"
                    aria-label="Search"
                    onClick={openSearch}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 21l-4.3-4.3" />
                      <circle cx="11" cy="11" r="7" />
                    </svg>
                  </button>

                  {/* Bag */}
                  <button
                    type="button"
                    aria-label="Bag"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
                  >
                    <img src={Bag} alt="Bag" className="h-6 w-6" />
                  </button>

                  {/* Avatar bubble */}
                  <button
                    ref={btnRef}
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={open}
                    aria-haspopup="menu"
                    onClick={() => setOpen((v) => !v)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white hover:bg-black/5 active:bg-black/10"
                  >
                    <img
                      src={AuthorsAvatar}
                      alt="Avatar"
                      className="h-10 w-10 object-contain"
                    />
                  </button>

                  {/* Bubble content (account) */}
                  {open ? (
                    <div
                      ref={menuRef}
                      role="menu"
                      aria-label="Account menu"
                      className="
                        absolute right-0 top-12
                        w-44 overflow-hidden rounded-2xl bg-white
                        shadow-[0_18px_45px_rgba(0,0,0,0.14)]
                        ring-1 ring-black/5
                        animate-in fade-in zoom-in-95
                      "
                    >
                      <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-white ring-1 ring-black/5" />
                      <div className="relative p-2">
                        <div className="px-3 py-2">
                          <p className="text-sm font-semibold text-black">
                            {user?.name ?? "Account"}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-black/50">
                            {user?.email ?? ""}
                          </p>
                        </div>

                        <div className="my-1 h-px w-full bg-black/10" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#EE1D52] hover:bg-[#EE1D52]/10"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : (
            /* ✅ Guest (seperti sebelumnya) */
            <div className="relative flex items-center gap-2">
              {/* Search */}
              <button
                type="button"
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </button>

              {/* Bag */}
              <button
                type="button"
                aria-label="Bag"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <img src={Bag} alt="Bag" className="h-6 w-6" />
              </button>

              {/* Hamburger */}
              <button
                ref={btnRef}
                type="button"
                aria-label="Menu"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              {/* Bubble content (guest) */}
              {open ? (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-label="Auth menu"
                  className="
                    absolute right-0 top-12
                    w-44 overflow-hidden rounded-2xl bg-white
                    shadow-[0_18px_45px_rgba(0,0,0,0.14)]
                    ring-1 ring-black/5
                    animate-in fade-in zoom-in-95
                  "
                >
                  <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-white ring-1 ring-black/5" />
                  <div className="relative p-2">
                    <Link
                      to="/login"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="mt-1 flex items-center rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary-100"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
