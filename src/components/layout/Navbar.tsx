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
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

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
    function onDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function handleLogout() {
    dispatch(logout());
    navigate("/login", { replace: true });
  }

  function handleMobileSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/books?search=${encodeURIComponent(query)}`);
    setMobileSearch(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="relative mx-auto flex h-16 w-full items-center px-4 md:px-16">
        {/* ================= LEFT ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-10 w-10" />
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full border border-black/20 text-sm font-semibold hover:bg-black/5 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-full bg-primary-300 text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
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

              <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center"
              >
                <img
                  src={AuthorsAvatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full"
                />
              </button>

              {open && (
                <div
                  ref={menuRef}
                  className="absolute right-6 top-14 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
                >
                  <div className="p-4 space-y-3 text-sm">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-black/50">{user?.email}</p>

                    <div className="h-px bg-black/10" />

                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left hover:bg-black/5 py-2"
                    >
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-red-500 hover:bg-red-50 py-2"
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
            <div className="absolute left-0 top-0 w-full h-16 bg-white flex items-center px-4 gap-3 z-50">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="Booky" className="h-9 w-9" />
              </Link>

              <form onSubmit={handleMobileSearchSubmit} className="flex-1">
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search book"
                  className="h-11 w-full rounded-full border border-black/15 px-5 text-sm outline-none"
                />
              </form>

              <button
                onClick={() => {
                  setMobileSearch(false);
                  setQ("");
                }}
                className="text-xl"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setMobileSearch(true)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                🔍
              </button>

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

              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 text-xl"
              >
                ☰
              </button>

              {mobileMenuOpen && (
                <div className="absolute left-0 top-16 w-full bg-white shadow-xl border-t border-black/10 z-50">
                  <div className="px-6 py-6 space-y-4 text-sm">
                    <button
                      onClick={() => navigate("/login")}
                      className="block w-full text-left font-semibold"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                      className="block w-full text-left font-semibold text-primary-300"
                    >
                      Register
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
