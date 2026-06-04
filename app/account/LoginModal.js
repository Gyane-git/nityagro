"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

// ─── Icons ───────────────────────────────────────────────────────────────────
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

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputClass = "w-full border border-gray-200 rounded-lg px-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#266A3F] focus:ring-1 focus:ring-[#266A3F]/20 bg-gray-50";

export default function LoginModal({ isOpen, onClose, onSignup, onForgot }) {
  const [tab, setTab] = useState("password"); // "password" | "email"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const startGoogleLogin = () => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/";
    toast.loading("Opening Google sign in...");
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (tab !== "password") {
      toast.error("OTP login is not enabled yet. Please use password login.");
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    const loadingToastId = toast.loading("Checking your account...");
    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || "Login failed", { id: loadingToastId });
        return;
      }

      const token = payload.data?.token;
      const user = payload.data?.user;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("auth_user", JSON.stringify(user));

      if (user.type === "ADMIN") {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_auth", JSON.stringify({ token, user }));
      } else {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_auth");
      }

      toast.success(user.type === "ADMIN" ? "Welcome admin. Opening dashboard..." : "Login successful. Welcome back!", { id: loadingToastId });
      onClose?.();

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const redirectTo = user.type === "ADMIN" ? user.redirectTo || "/admin/dashboard" : next || "/";
      window.location.href = redirectTo;
    } catch {
      toast.error("Login failed. Please try again.", { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col" style={{ padding: "32px 36px 28px" }}>
        {/* ── Tabs: Password |  Email ── */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: "password", label: "Password" },
            { key: "email", label: "Email" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} className="flex-1 pb-3 text-sm font-semibold relative transition-colors" style={{ color: tab === key ? "#266A3F" : "#9CA3AF" }}>
              {label}
              {tab === key && <div className="absolute bottom-0 left-0 right-0" style={{ height: "2.5px", background: "#266A3F", borderRadius: "2px 2px 0 0" }} />}
            </button>
          ))}
          {/* spacer for X button */}
          <div style={{ width: "32px" }} />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* ── email field (both tabs) ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Email</label>
            <input type="email" placeholder="Please enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={{ height: "48px" }} required />
          </div>

          {/* ── Password tab ── */}
          {tab === "password" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Please enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} style={{ height: "48px", paddingRight: "42px" }} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
                  <EyeIcon show={showPw} />
                </button>
              </div>
              {/* Forgot password */}
              <div className="flex justify-end mt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    toast("Password reset flow is opening...");
                    onClose();
                    onForgot?.();
                  }}
                  className="text-xs text-gray-500 hover:text-[#266A3F] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {/* ── Email tab: OTP ── */}
          {tab === "email" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">OTP</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className={inputClass} style={{ height: "48px" }} maxLength={6} />
                <button type="button" onClick={() => toast.error("OTP login is not enabled yet. Please use password login.")} className="shrink-0 text-sm font-semibold px-4 rounded-lg border-2 transition-colors hover:bg-gray-50 whitespace-nowrap" style={{ borderColor: "#266A3F", color: "#266A3F", height: "48px" }}>
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {/* ── Login button ── */}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg mt-1 transition-all hover:opacity-90 active:scale-[0.99]" style={{ background: "#266A3F", height: "48px", boxShadow: "0 4px 14px rgba(38,106,63,0.28)", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* ── Login with Google ── */}
          <button type="button" onClick={startGoogleLogin} className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all" style={{ height: "46px" }}>
            <GoogleIcon />
            Login with Google
          </button>

          {/* ── Sign up link ── */}
          <p className="text-center text-sm text-gray-500 mt-1">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                toast("Create your Nityagro account");
                onClose();
                onSignup?.();
              }}
              className="font-bold hover:underline"
              style={{ color: "#266A3F" }}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </AuthModal>
  );
}
