"use client";

import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

export default function OtpModal({
  isOpen,
  onClose,
  onSuccess,
  email = "example@me.com",
  onResend,
  purpose = "reset-password",
  signupData = null,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    setTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputs.current[i - 1]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    const loadingToastId = toast.loading("Verifying OTP...");
    setLoading(true);
    const isSignup = purpose === "signup";
    const verifyUrl = isSignup
      ? "/api/auth/signup/verify"
      : "/api/auth/verify-reset-otp";
    const requestBody = isSignup
      ? { ...signupData, otp: code }
      : { email, otp: code };

    fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json().then((payload) => ({ ok: res.ok, payload })))
      .then(({ ok, payload }) => {
        if (!ok || !payload?.success) {
          toast.error(payload?.message || "Invalid OTP", { id: loadingToastId });
          return;
        }
        toast.success(
          payload.message ||
            (isSignup
              ? "Account verified and created successfully"
              : "OTP verified successfully"),
          { id: loadingToastId },
        );
        onSuccess?.();
      })
      .catch(() => toast.error("OTP verification failed", { id: loadingToastId }))
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    if (!canResend) {
      toast("Please wait before requesting a new OTP");
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setCanResend(false);
    const resendEmail = onResend?.() || email;
    const loadingToastId = toast.loading("Resending OTP...");
    const isSignup = purpose === "signup";
    fetch(isSignup ? "/api/auth/signup/send-otp" : "/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(
        isSignup
          ? {
              name: signupData?.name,
              phone: signupData?.phone,
              email: signupData?.email || resendEmail,
              password: signupData?.password,
            }
          : { email: resendEmail },
      ),
    })
      .then((res) => res.json().then((payload) => ({ ok: res.ok, payload })))
      .then(({ ok, payload }) => {
        if (!ok || !payload?.success) {
          toast.error(payload?.message || "Failed to resend OTP", {
            id: loadingToastId,
          });
          return;
        }
        toast.success("OTP resent successfully", { id: loadingToastId });
      })
      .catch(() => toast.error("Failed to resend OTP", { id: loadingToastId }));
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div
        className="flex flex-col items-center text-center"
        style={{ padding: "40px 36px 36px" }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#F0FDF4" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#266A3F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6z" />
          </svg>
        </div>

        <h2
          className="font-bold text-gray-900 mb-1"
          style={{ fontSize: "20px" }}
        >
          Verify OTP
        </h2>
        <div
          style={{
            width: "40px",
            height: "2.5px",
            background: "#266A3F",
            borderRadius: "2px",
          }}
          className="mb-3"
        />
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col items-center gap-5 w-full">

          {/* OTP boxes */}
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="text-center text-lg font-bold border-2 rounded-lg outline-none transition-all"
                style={{
                  width: "48px",
                  height: "52px",
                  borderColor: digit ? "#266A3F" : "#E5E7EB",
                  background: digit ? "#F0FDF4" : "#F9FAFB",
                  color: "#1F2937",
                }}
                maxLength={1}
              />
            ))}
          </div>

          {/* Timer / Resend */}
          <p className="text-sm text-gray-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold hover:underline"
                style={{ color: "#266A3F" }}
              >
                Resend OTP
              </button>
            ) : (
              <>
                Resend code in{" "}
                <span className="font-semibold text-gray-700">
                  0:{String(timer).padStart(2, "0")}
                </span>
              </>
            )}
          </p>

          {/* Verify button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "#266A3F",
              height: "48px",
              boxShadow: "0 4px 14px rgba(38,106,63,0.28)",
            }}
            disabled={otp.join("").length < 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </AuthModal>
  );
}
