"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const EyeIcon = ({ show }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const inputClass =
  "w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors";

function PasswordInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-[#4C6759]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          style={{ paddingRight: "42px" }}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          tabIndex={-1}
        >
          <EyeIcon show={show} />
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const validate = () => {
    if (!form.currentPassword) return "Current password is required";
    if (!form.newPassword.trim()) return "New password is required";
    if (form.newPassword.length < 8) return "New password must be at least 8 characters";
    if (form.newPassword.length > 72) return "New password is too long";
    if (form.currentPassword === form.newPassword) return "New password must be different from current password";
    if (form.newPassword !== form.confirmPassword) return "New password and confirm password do not match";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      toast.error(message);
      return;
    }

    const loadingToastId = toast.loading("Changing password...");
    setSaving(true);
    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch("/api/account/password", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || "Failed to change password", {
          id: loadingToastId,
        });
        return;
      }

      toast.success(payload.message || "Password changed successfully", {
        id: loadingToastId,
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password. Please try again.", {
        id: loadingToastId,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl sm:text-2xl font-bold text-[#266A3F] mb-1">Change Password</h2>
      <p className="text-[14px] text-[#4C6759] mb-6 border-b border-gray-100 pb-4">
        Keep your account secure by using a strong password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Current Password"
          value={form.currentPassword}
          onChange={set("currentPassword")}
          show={show.current}
          onToggle={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
          placeholder="Enter current password"
        />
        <PasswordInput
          label="New Password"
          value={form.newPassword}
          onChange={set("newPassword")}
          show={show.next}
          onToggle={() => setShow((prev) => ({ ...prev, next: !prev.next }))}
          placeholder="At least 8 characters"
        />
        <PasswordInput
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          show={show.confirm}
          onToggle={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
          placeholder="Re-enter new password"
        />

        <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          Tip: Use a password that is different from your email and old password.
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })}
            className="px-6 py-2.5 text-sm border border-gray-100 hover:bg-[#fce7be] rounded-md text-[#0A0A0A] hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#2e5e2e] text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
