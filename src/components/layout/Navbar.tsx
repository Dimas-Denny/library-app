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

  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);

  const isLoggedIn = Boolean(token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full items-center px-4 md:px-16">
        {/* ================= LEFT ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-10 w-10" />
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {!isLoggedIn ? (
            <>
              {/* LOGIN */}
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full border border-black/20 text-sm font-semibold hover:bg-black/5 transition"
              >
                Login
              </button>

              {/* REGISTER */}
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-full bg-primary-300 text-white text-sm font-semibold hover:opacity-90 transition"
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

              {/* AVATAR */}
              <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2"
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
          {!isLoggedIn ? (
            <>
              {/* CART ICON */}
              <button
                onClick={() => navigate("/cart")}
                className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                <img src={Bag} alt="Cart" className="h-6 w-6" />
              </button>

              {/* HAMBURGER */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
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
          ) : (
            <>
              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
              >
                <img src={Bag} alt="Cart" className="h-6 w-6" />
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
        </div>
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
