import React from "react";
import Logo from "@/assets/svg/logo.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { login } from "@/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setToken, setUser } from "@/store/authSlice";

type Errors = {
  email?: string;
  password?: string;
  api?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  const [email, setEmail] = React.useState(params.get("email") ?? "");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});

  function validate() {
    const e: Errors = {};
    if (!email.trim()) e.email = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const mLogin = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      console.log("FULL LOGIN RESPONSE:", res);

      const { token, user } = res.data;

      console.log("USER ROLE:", user.role);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setToken(token));
      dispatch(setUser(user));

      if (user.role === "ADMIN") {
        console.log("Redirecting to ADMIN dashboard");
        navigate("/admin", { replace: true });
      } else {
        console.log("Redirecting to USER homepage");
        navigate("/", { replace: true });
      }
    },
    onError: (err) => {
      setErrors((p) => ({
        ...p,
        api: err instanceof Error ? err.message : "Login failed",
      }));
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors((p) => ({ ...p, api: undefined }));

    if (!validate()) return;

    mLogin.mutate({
      email: email.trim(),
      password,
    });
  }

  const baseInput =
    "h-11 w-full rounded-xl border bg-white px-4 text-sm font-medium outline-none";
  const okInput =
    "border-black/10 focus:border-primary-300 focus:ring-4 focus:ring-primary-200/60";
  const errInput = "border-[#EE1D52] focus:ring-4 focus:ring-[#EE1D52]/20";

  return (
    <div className="min-h-screen bg-white md:bg-primary-100 md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-sm px-6 pt-14 pb-10 md:max-w-md md:rounded-2xl md:bg-white md:shadow-xl md:px-8 md:py-10">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Booky" className="h-7 w-7" />
          <span className="text-2xl font-bold">Booky</span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm font-semibold">
          Sign in to manage your library account.
        </p>

        {/* API error */}
        {errors.api ? (
          <div className="mt-4 rounded-xl border border-[#EE1D52]/30 bg-[#EE1D52]/5 px-4 py-3">
            <p className="text-xs font-semibold text-[#EE1D52]">{errors.api}</p>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Email</label>
            <input
              value={email}
              disabled={mLogin.isPending}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              autoComplete="email"
              className={`${baseInput} ${errors.email ? errInput : okInput}`}
            />
            {errors.email && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Password</label>
            <div className="relative">
              <input
                value={password}
                disabled={mLogin.isPending}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                className={`${baseInput} pl-4 pr-11 ${
                  errors.password ? errInput : okInput
                }`}
              />
              <button
                type="button"
                disabled={mLogin.isPending}
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 active:bg-black/10 disabled:opacity-60"
                aria-label={show ? "Hide password" : "Show password"}
              >
                <EyeIcon open={show} />
              </button>
            </div>

            {errors.password && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mLogin.isPending}
            className="
              h-12 w-full rounded-full
              bg-primary-300 text-white
              text-sm font-semibold
              transition hover:opacity-95 active:scale-[0.99]
              disabled:opacity-60 disabled:active:scale-100
            "
          >
            {mLogin.isPending ? "Logging in..." : "Login"}
          </button>

          {/* Bottom */}
          <p className="pt-1 text-center text-xs font-semibold">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-primary-300 hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-black/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
          <path d="M4 4l16 16" />
        </>
      )}
    </svg>
  );
}
