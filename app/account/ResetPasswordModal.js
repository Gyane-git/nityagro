"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

const EyeIcon = ({ show }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    ) : (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    )}
  </svg>
);

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#266A3F] focus:ring-1 focus:ring-[#266A3F]/20 bg-gray-50";

export default function ResetPasswordModal({ isOpen, onClose, onSuccess, email }) {
  const [newPw,  setNewPw]  = useState("");
  const [confPw, setConfPw] = useState("");
  const [showNew,  setShowNew]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (newPw !== confPw) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters");
      return;
    }
    setError("");
    const loadingToastId = toast.loading("Resetting password...");
    setLoading(true);
    fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password: newPw }),
    })
      .then((res) => res.json().then((payload) => ({ ok: res.ok, payload })))
      .then(({ ok, payload }) => {
        if (!ok || !payload?.success) {
          toast.error(payload?.message || "Password reset failed", {
            id: loadingToastId,
          });
          return;
        }
        toast.success(payload.message || "Password reset successfully. Please login.", {
          id: loadingToastId,
        });
        setNewPw("");
        setConfPw("");
        onSuccess?.();
      })
      .catch(() => toast.error("Password reset failed", { id: loadingToastId }))
      .finally(() => setLoading(false));
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col" style={{ padding: "40px 36px 36px" }}>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "#F0FDF4" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#266A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>Reset Password</h2>
        <div style={{ width: "48px", height: "2.5px", background: "#266A3F", borderRadius: "2px" }} className="mb-2" />
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Create a strong new password for your account.
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">New Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} placeholder="Enter new password"
                value={newPw} onChange={(e) => setNewPw(e.target.value)}
                className={inputClass} style={{ height: "48px", paddingRight: "42px" }} required />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
                <EyeIcon show={showNew} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showConf ? "text" : "password"} placeholder="Re-enter new password"
                value={confPw} onChange={(e) => { setConfPw(e.target.value); setError(""); }}
                className={inputClass} style={{ height: "48px", paddingRight: "42px" }} required />
              <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
                <EyeIcon show={showConf} />
              </button>
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          {/* Reset button */}
          <button type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg mt-1 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "#266A3F", height: "48px", boxShadow: "0 4px 14px rgba(38,106,63,0.28)", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthModal>
  );
}
