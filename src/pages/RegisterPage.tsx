import React from "react";
import Logo from "@/assets/svg/logo.svg";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { register } from "@/api/auth.api";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function RegisterPage() {
  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState<Errors>({});
  const [showPass, setShowPass] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const navigate = useNavigate();

  const mRegister = useMutation({
    mutationFn: register,
    onSuccess: () => {
      alert("Register success! Please login.");
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Register failed");
    },
  });

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));

    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));

    // kalau password berubah, bersihin error confirm mismatch biar UX enak
    if (key === "password" && errors.confirmPassword) {
      setErrors((p) => ({ ...p, confirmPassword: undefined }));
    }
  }

  function validate() {
    const e: Errors = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.phone.trim()) e.phone = "Nomor handphone is required";
    if (!form.password.trim()) e.password = "Password is required";
    if (!form.confirmPassword.trim())
      e.confirmPassword = "Confirm password is required";

    if (
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password !== form.confirmPassword
    ) {
      e.confirmPassword = "Password does not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // kirim ke API (confirmPassword tidak dikirim)
    mRegister.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
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
        <h1 className="mt-8 text-2xl font-bold">Register</h1>
        <p className="mt-2 text-sm font-semibold">
          Create your account to start borrowing books.
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Name</label>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              autoComplete="name"
              className={`${baseInput} ${errors.name ? errInput : okInput}`}
            />
            {errors.name && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Email</label>
            <input
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              autoComplete="email"
              className={`${baseInput} ${errors.email ? errInput : okInput}`}
            />
            {errors.email && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Nomor Handphone</label>
            <input
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              className={`${baseInput} ${errors.phone ? errInput : okInput}`}
            />
            {errors.phone && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Password</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(e) => onChange("password", e.target.value)}
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                className={`${baseInput} pl-4 pr-11 ${
                  errors.password ? errInput : okInput
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <EyeIcon open={showPass} />
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                value={form.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className={`${baseInput} pl-4 pr-11 ${
                  errors.confirmPassword ? errInput : okInput
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-[#EE1D52]">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mRegister.isPending}
            className="
              mt-2 h-12 w-full rounded-full
              bg-primary-300 text-white
              text-sm font-semibold
              transition hover:opacity-95 active:scale-[0.99]
              disabled:opacity-60 disabled:active:scale-100
            "
          >
            {mRegister.isPending ? "Submitting..." : "Submit"}
          </button>

          {/* Bottom */}
          <p className="pt-1 text-center text-xs font-semibold">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary-300 hover:underline"
            >
              Log In
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
