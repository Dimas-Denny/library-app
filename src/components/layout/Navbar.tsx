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
  console.log("USER:", user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((s) => s.cart.items);

  /* ================= CLICK OUTSIDE DESKTOP ================= */
  React.useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  /* ================= AUTO FOCUS SEARCH MOBILE ================= */
  React.useEffect(() => {
    if (searchMode) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [searchMode]);

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/books?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full items-center px-4 md:px-16">
        {/* ================= LEFT ================= */}
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
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search book"
                className="h-10 w-full rounded-full border border-black/15 bg-white px-5 text-sm outline-none focus:border-black/30"
              />
            </div>
          </form>
        )}

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {!isLoggedIn ? null : (
            <div className="relative flex items-center gap-3">
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
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-black/5 transition"
              >
                <img
                  src={AuthorsAvatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <span className="text-sm font-semibold text-black">
                  {user?.name ?? "User"}
                </span>

                {/* Chevron */}
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
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
                  className="absolute right-0 top-12 w-56 rounded-2xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] ring-1 ring-black/5"
                >
                  <div className="p-4">
                    <p className="text-sm font-semibold">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-xs text-black/50">{user?.email ?? ""}</p>

                    <div className="my-3 h-px bg-black/10" />

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm hover:bg-black/5"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/borrowed-list");
                        setOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm hover:bg-black/5"
                    >
                      Borrowed List
                    </button>

                    <button
                      onClick={() => {
                        navigate("/reviews");
                        setOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm hover:bg-black/5"
                    >
                      Reviews
                    </button>

                    <div className="my-3 h-px bg-black/10" />

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-sm text-red-500 hover:bg-red-50"
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
          <div className="relative flex items-center md:hidden flex-1 justify-end gap-4">
            {/* SEARCH ICON */}
            {!searchMode && (
              <button
                onClick={() => setSearchMode(true)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                🔍
              </button>
            )}

            {/* MOBILE SEARCH INPUT */}
            {searchMode && (
              <form
                onSubmit={onSubmitSearch}
                className="flex-1 flex items-center gap-3"
              >
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search book"
                  className="h-10 flex-1 rounded-full border border-black/15 px-4 text-sm outline-none"
                />
                <button onClick={() => setSearchMode(false)}>✕</button>
              </form>
            )}

            {!searchMode && (
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

                {/* AVATAR */}
                <button onClick={() => setMobileMenuOpen((v) => !v)}>
                  <img
                    src={AuthorsAvatar}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full"
                  />
                </button>
              </>
            )}

            {/* MOBILE DROPDOWN PANEL */}
            {mobileMenuOpen && (
              <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-black/10 z-50">
                <div className="px-6 py-6 space-y-5 text-sm">
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-black/50">{user?.email}</p>
                  </div>

                  <div className="h-px bg-black/10" />

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
          </div>
        )}
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
