"use client";

import { useState } from "react";
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
  const [resetEmail, setResetEmail] = useState("");
  const [otpContext, setOtpContext] = useState({
    purpose: "reset-password",
    email: "",
    signupData: null,
  });

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
        onOtp={(signupData) => {
          setOtpContext({
            purpose: "signup",
            email: signupData.email,
            signupData,
          });
          close();
          openOtp();
        }}
      />

      <ForgotPasswordModal
        isOpen={modal === "forgot"}
        onClose={close}
        onLogin={openLogin}
        onOtp={(email) => {
          setResetEmail(email);
          setOtpContext({
            purpose: "reset-password",
            email,
            signupData: null,
          });
          close();
          openOtp();
        }}
      />

      <OtpModal
        isOpen={modal === "otp"}
        onClose={close}
        onSuccess={() => {
          close();
          if (otpContext.purpose === "signup") {
            openLogin();
            return;
          }
          openReset();
        }}
        email={otpContext.email || resetEmail}
        purpose={otpContext.purpose}
        signupData={otpContext.signupData}
        onResend={() => otpContext.email || resetEmail}
      />

      <ResetPasswordModal
        isOpen={modal === "reset"}
        onClose={close}
        email={resetEmail}
        onSuccess={() => { close(); openLogin(); }}
      />
    </>
  );
}
