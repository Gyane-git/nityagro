"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const NAME_REGEX = /^[A-Za-z\s.'-]{2,80}$/;
const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();
const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

const EyeIcon = ({ show }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const inputClass = "w-full border border-gray-200 rounded-lg px-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#266A3F] focus:ring-1 focus:ring-[#266A3F]/20 bg-gray-50";

export default function SignupModal({ isOpen, onClose, onLogin, onOtp }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPhone = (e) => setForm((f) => ({ ...f, phone: onlyDigits(e.target.value).slice(0, 15) }));

  const startGoogleSignup = () => {
    toast.loading("Opening Google signup...");
    window.location.href = "/api/auth/google?next=/";
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = form.name.trim().replace(/\s+/g, " ");
    const phone = onlyDigits(form.phone);
    const email = normalizeEmail(form.email);

    if (!NAME_REGEX.test(name)) {
      toast.error("Please enter a valid full name");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      toast.error("Phone number must contain 7 to 15 digits only");
      return;
    }
    if (form.password.length < 8 || form.password.length > 72 || !form.password.trim()) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const loadingToastId = toast.loading("Sending verification OTP...");
    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          email,
          password: form.password,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || "Signup failed", { id: loadingToastId });
        return;
      }

      toast.success(payload.message || "OTP sent. Please verify your email.", {
        id: loadingToastId,
      });
      onOtp?.({
        name,
        phone,
        email,
        password: form.password,
      });
    } catch {
      toast.error("Failed to send OTP. Please try again.", { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col overscroll-contain" style={{ padding: "32px 36px 28px" }}>
        {/* Title */}
        <div className="mb-6 inline-block">
          <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
            Create Account
          </h2>

          <div className="h-1 bg-[#266A3F] rounded w-1/3" />
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Enter your full name" value={form.name} onChange={set("name")} className={inputClass} style={{ height: "48px" }} required />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="Enter your phone number" value={form.phone} onChange={setPhone} className={inputClass} style={{ height: "48px" }} required />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" placeholder="Please enter your email address" value={form.email} onChange={set("email")} className={inputClass} style={{ height: "48px" }} required />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={set("password")} className={inputClass} style={{ height: "48px", paddingRight: "42px" }} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
                <EyeIcon show={showPw} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input type={showCPw ? "text" : "password"} placeholder="Re-enter your password" value={form.confirm} onChange={set("confirm")} className={inputClass} style={{ height: "48px", paddingRight: "42px" }} required />
              <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
                <EyeIcon show={showCPw} />
              </button>
            </div>
          </div>

          {/* Sign Up button */}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg mt-1 transition-all hover:opacity-90 active:scale-[0.99]" style={{ background: "#266A3F", height: "48px", boxShadow: "0 4px 14px rgba(38,106,63,0.28)", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Sign Up with Google */}
          <button type="button" onClick={startGoogleSignup} className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all" style={{ height: "46px" }}>
            <GoogleIcon />
            Sign up with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-1">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                toast("Login to your existing account");
                onClose();
                onLogin?.();
              }}
              className="font-bold hover:underline"
              style={{ color: "#266A3F" }}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </AuthModal>
  );
}
