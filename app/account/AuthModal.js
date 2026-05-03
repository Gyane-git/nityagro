"use client";

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * AuthModal
 * Base wrapper for all auth popups (Login, Signup, OTP, Forgot, Reset)
 *
 * Props:
 *  - isOpen   {boolean}
 *  - onClose  {function}
 *  - children {ReactNode}
 */
export default function AuthModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      {/* ── Modal panel ── */}
      <div
        className="fixed z-50 bg-white"
        style={{
          width: "448px",
          minHeight: "340px",
          borderRadius: "12px",
          border: "1px solid #E6E6E6",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <XIcon />
        </button>

        {children}
      </div>
    </>
  );
}