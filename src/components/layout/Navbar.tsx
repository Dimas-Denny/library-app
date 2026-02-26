import React from "react";
import { Link } from "react-router-dom";

import Logo from "@/assets/svg/logo.svg";
import Bag from "@/assets/svg/bag.svg";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  // close when click outside (mobile bubble)
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-16">
        {/* LEFT */}
        <Link to="/books" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Booky"
            width={34}
            height={34}
            className="h-10 w-10"
          />
          {/* md+ title */}
          <span className="hidden md:block text-xl font-semibold">Booky</span>
        </Link>

        {/* RIGHT - Desktop (md+) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="h-9 w-28 rounded-full border border-black/15 bg-white px-5 text-sm text-center font-bold text-black hover:bg-black/5"
          >
            <span className="inline-flex h-full items-center">Login</span>
          </Link>

          <Link
            to="/register"
            className="h-9 w-28 rounded-full bg-primary-300 px-5 text-sm font-bold text-white text-center hover:opacity-90"
          >
            <span className="inline-flex h-full items-center">Register</span>
          </Link>
        </div>

        {/* RIGHT - Mobile (<md) */}
        <div className="relative flex items-center gap-2 md:hidden">
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
            <img src={Bag} alt="Bag" width={22} height={22} />
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

          {/* Floating bubble (mobile) */}
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
      </div>

      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
