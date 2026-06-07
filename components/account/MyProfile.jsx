"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

function splitName(name) {
  const value = String(name || "").trim();
  if (!value) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = value.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

export default function MyProfile({ user, userId = "1", onProfileUpdated }) {
  const initial = useMemo(() => {
    const parts = splitName(user?.name || "");
    return {
      firstName: parts.firstName,
      lastName: parts.lastName,
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
      country: user?.country || "",
    };
  }, [user]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);
  }, [initial]);

  const set = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";
    if (!EMAIL_REGEX.test(form.email.trim())) return "Valid email is required";
    if (form.phone.trim() && !PHONE_REGEX.test(onlyDigits(form.phone))) {
      return "Phone number must contain 7 to 15 digits only";
    }
    return null;
  };

  const handleSubmit = async () => {
    const message = validate();
    if (message) {
      toast.error(message);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        userId,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim().toLowerCase(),
        phone: onlyDigits(form.phone),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.trim(),
        country: form.country.trim(),
      };

      const token = window.localStorage.getItem("token");
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }).then((res) => res.json());
      if (!response.success) {
        toast.error(response.message || "Failed to update profile");
        return;
      }

      toast.success(response.message || "Profile updated successfully");
      onProfileUpdated?.(response.data);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#266A3F] mb-1">My Profile</h2>
      <p className="text-[14px] text-[#4C6759] mb-6 border-b border-gray-100 pb-4">Edit your personal details and login info.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">First name</label>
          <input type="text" value={form.firstName} onChange={set("firstName")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">Last name</label>
          <input type="text" value={form.lastName} onChange={set("lastName")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600">Email</label>
          <input type="email" value={form.email} onChange={set("email")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-[#4C6759]">Phone no</label>
          <input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: onlyDigits(e.target.value).slice(0, 15) }))} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input type="text" placeholder="State" value={form.state} onChange={set("state")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        <input type="text" placeholder="City" value={form.city} onChange={set("city")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        <input type="text" placeholder="Zip Code" value={form.zipCode} onChange={set("zipCode")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
        <input type="text" placeholder="Country" value={form.country} onChange={set("country")} className="w-full px-4 py-2.5 bg-[#f9f6f0] border border-transparent rounded-md text-sm text-gray-700 outline-none focus:border-[#DB8F00] transition-colors" />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button onClick={() => setForm(initial)} className="px-6 py-2.5 text-sm border border-gray-100 hover:bg-[#f5af86] rounded-md text-[#0A0A0A] hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 bg-[#2e5e2e] text-white text-sm font-normal rounded-md hover:opacity-90 transition-opacity disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
