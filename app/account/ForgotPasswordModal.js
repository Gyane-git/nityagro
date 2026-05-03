"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#266A3F] focus:ring-1 focus:ring-[#266A3F]/20 bg-gray-50";

export default function ForgotPasswordModal({ isOpen, onClose, onOtp, onLogin }) {
  const [email, setEmail] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    console.log("Send OTP to:", email);
    onOtp?.();
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col" style={{ padding: "40px 36px 36px" }}>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#F0FDF4" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#266A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>Forgot Password?</h2>
        <div style={{ width: "48px", height: "2.5px", background: "#266A3F", borderRadius: "2px" }} className="mb-2" />
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>

        <form onSubmit={handleSend} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Email Address <span className="text-red-500">*</span></label>
            <input type="tel" placeholder="Please enter your email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass} style={{ height: "48px" }} required />
          </div>

          {/* Send OTP */}
          <button type="submit"
            className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg mt-1 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "#266A3F", height: "48px", boxShadow: "0 4px 14px rgba(38,106,63,0.28)" }}>
            Send Verification Code
          </button>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <button type="button" onClick={() => { onClose(); onLogin?.(); }}
              className="font-bold hover:underline" style={{ color: "#266A3F" }}>
              Login
            </button>
          </p>
        </form>
      </div>
    </AuthModal>
  );
}