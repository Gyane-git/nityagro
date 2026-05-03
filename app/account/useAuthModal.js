"use client";

import { useState } from "react";

/**
 * useAuthModal
 * Controls which auth modal is open.
 * Returns state + open/close helpers for all modals.
 *
 * Usage in any component:
 *   const auth = useAuthModal();
 *   <button onClick={auth.openLogin}>Login</button>
 *   <AuthModals auth={auth} />
 */
export function useAuthModal() {
  const [modal, setModal] = useState(null);
  // modal: null | "login" | "signup" | "forgot" | "otp" | "reset"

  return {
    modal,
    openLogin:  () => setModal("login"),
    openSignup: () => setModal("signup"),
    openForgot: () => setModal("forgot"),
    openOtp:    () => setModal("otp"),
    openReset:  () => setModal("reset"),
    close:      () => setModal(null),
  };
}