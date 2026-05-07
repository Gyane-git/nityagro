"use client";

import { useState } from "react";
import useCheckoutStore from "@/store/checkoutStore";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const OfficeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const HomeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ─── Field components ─────────────────────────────────────────────────────────
function InputField({
  label, placeholder, required, value, onChange, type = "text",
}: {
  label: string; placeholder: string; required?: boolean;
  value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-[#00462C]"
        style={{ height: "44px" }}
      />
    </div>
  );
}

function SelectField({
  label, placeholder, required, options, value, onChange,
}: {
  label: string; placeholder: string; required?: boolean;
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 text-sm text-gray-500 outline-none appearance-none bg-white transition-colors focus:border-[#00462C] cursor-pointer"
          style={{ height: "44px", paddingRight: "36px" }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DeliveryAddressForm() {
  const selectedAddress = useCheckoutStore((state) => state.getSelectedAddress());
  const saveAddress = useCheckoutStore((state) => state.saveAddress);
  const [form, setForm] = useState({
    id: selectedAddress?.id,
    fullName: selectedAddress?.fullName || "",
    region: selectedAddress?.region || "",
    phone: selectedAddress?.phone || "",
    city: selectedAddress?.city || "",
    building: selectedAddress?.building || "",
    area: selectedAddress?.area || "",
    colony: selectedAddress?.colony || "",
    address: selectedAddress?.address || "",
    email: selectedAddress?.email || "",
    label: selectedAddress?.label || "Office",
  });

  const set = (key: string) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddress(form);
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl bg-white px-8 py-7 flex-1 min-w-0">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: "20px" }}>
        Delivery Address
      </h2>
      <div
        className="mb-6"
        style={{ height: "2px", background: "#00462C", borderRadius: "2px", width: "100%" }}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-5">

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Full Name" placeholder="Enter your full name" required
            value={form.fullName} onChange={set("fullName")} />
          <SelectField label="Region" placeholder="Please choose your region" required
            options={["Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim","Madhesh","Koshi"]}
            value={form.region} onChange={set("region")} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Phone Number" placeholder="Please enter your phone number" required
            type="tel" value={form.phone} onChange={set("phone")} />
          <SelectField label="City" placeholder="Please choose your city" required
            options={["Kathmandu","Lalitpur","Bhaktapur","Pokhara","Biratnagar","Birgunj","Butwal"]}
            value={form.city} onChange={set("city")} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Building / House No / Flour / Street" placeholder="Please enter" required
            value={form.building} onChange={set("building")} />
          <SelectField label="Area" placeholder="Please choose your area" required
            options={["Newroad","Thamel","Baneshwor","Koteshwor","Kalanki","Balkhu","Maharajgunj"]}
            value={form.area} onChange={set("area")} />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Colony / Suburb / Locality / Landmark" placeholder="Please enter" required
            value={form.colony} onChange={set("colony")} />
          <InputField label="Address" placeholder="Enter your address" required
            value={form.address} onChange={set("address")} />
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Email Address" placeholder="Please enter your address"
            type="email" value={form.email} onChange={set("email")} />

          {/* Delivery label */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Select a label for effective delivery
            </label>
            <div className="flex gap-3">
              {[
                { key: "Office", Icon: OfficeIcon },
                { key: "Home",   Icon: HomeIcon   },
              ].map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("label")(key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all"
                  style={{
                    borderColor: form.label === key ? "#00462C" : "#D1D5DB",
                    background:  form.label === key ? "#00462C" : "white",
                    color:       form.label === key ? "white"   : "#374151",
                  }}
                >
                  <Icon />
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center text-white font-bold text-sm rounded-lg mt-1 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "#00462C", height: "48px", boxShadow: "0 4px 16px rgba(0,70,44,0.22)" }}
        >
          Save
        </button>
      </form>
    </div>
  );
}
