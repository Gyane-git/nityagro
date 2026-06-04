"use client";

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AuthModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]" onClick={onClose} />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center sm:items-start md:items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4">
        {/* Modal Box */}
        <div
          className="
            relative
            w-full
            max-w-[92vw] sm:max-w-[420px] md:max-w-[460px]
            max-h-[80dvh] sm:max-h-[80dvh] md:max-h-[92dvh]
            bg-white
            rounded-xl
            overflow-hidden
            flex flex-col
            shadow-2xl
            "
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-full hover:bg-gray-100 transition" aria-label="Close">
            <XIcon />
          </button>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-1 sm:px-0 pb-6 sm:pb-0">{children}</div>
        </div>
      </div>
    </>
  );
}
