import { create } from "zustand";

const DEFAULT_DURATION = 2200;
let toastTimer = null;

const useToastStore = create((set) => ({
  toast: null,
  showToast: (message, duration = DEFAULT_DURATION, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type } });
    toastTimer = setTimeout(() => set({ toast: null }), duration);
  },
  showSuccess: (message, duration = DEFAULT_DURATION) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type: "success" } });
    toastTimer = setTimeout(() => set({ toast: null }), duration);
  },
  showError: (message, duration = DEFAULT_DURATION) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type: "error" } });
    toastTimer = setTimeout(() => set({ toast: null }), duration);
  },
  showWarning: (message, duration = DEFAULT_DURATION) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type: "warning" } });
    toastTimer = setTimeout(() => set({ toast: null }), duration);
  },
  showInfo: (message, duration = DEFAULT_DURATION) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type: "info" } });
    toastTimer = setTimeout(() => set({ toast: null }), duration);
  },
  clearToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: null });
  },
}));

export default useToastStore;
