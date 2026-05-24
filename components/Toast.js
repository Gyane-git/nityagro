"use client";
import useToastStore from "@/store/toastStore";
import { Toaster } from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import InfoModal from "./InfoModal";
import WarningModal from "./WarningModal";

const Toast = () => {
  const toast = useToastStore((state) => state.toast);
  const toastMessage = typeof toast === "string" ? toast : toast?.message;
  const toastType = typeof toast === "string" ? "success" : toast?.type || "success";

  const toastStyles = {
    success: {
      icon: "✓",
      className: "bg-[#0f7a46] text-white border-[#0a5f36]",
    },
    error: {
      icon: "!",
      className: "bg-red-600 text-white border-red-700",
    },
    warning: {
      icon: "!",
      className: "bg-amber-500 text-white border-amber-600",
    },
    info: {
      icon: "i",
      className: "bg-sky-600 text-white border-sky-700",
    },
  };

  const style = toastStyles[toastType] || toastStyles.success;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: "#0f7a46",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <ConfirmModal />
      <InfoModal />
      <WarningModal />
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`flex max-w-sm items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold shadow-lg animate-fade-in-out ${style.className}`}
            role="status"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {style.icon}
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
