"use client";

import LoginModal          from "./LoginModal";
import SignupModal         from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import OtpModal            from "./OtpModal";
import ResetPasswordModal  from "./ResetPasswordModal";

/**
 * AuthModals
 * Drop this once in your layout or page — it renders whichever modal is active.
 *
 * Props:
 *  - auth  {object}  the object returned by useAuthModal()
 *
 * Example:
 *   const auth = useAuthModal();
 *   ...
 *   <button onClick={auth.openLogin}>Log in</button>
 *   <AuthModals auth={auth} />
 */
export default function AuthModals({ auth }) {
  const { modal, close, openLogin, openSignup, openForgot, openOtp, openReset } = auth;

  return (
    <>
      <LoginModal
        isOpen={modal === "login"}
        onClose={close}
        onSignup={openSignup}
        onForgot={openForgot}
      />

      <SignupModal
        isOpen={modal === "signup"}
        onClose={close}
        onLogin={openLogin}
      />

      <ForgotPasswordModal
        isOpen={modal === "forgot"}
        onClose={close}
        onLogin={openLogin}
        onOtp={() => { close(); openOtp(); }}
      />

      <OtpModal
        isOpen={modal === "otp"}
        onClose={close}
        onSuccess={() => { close(); openReset(); }}
        phone="+977 98XXXXXXXX"
      />

      <ResetPasswordModal
        isOpen={modal === "reset"}
        onClose={close}
        onSuccess={() => { close(); openLogin(); }}
      />
    </>
  );
}