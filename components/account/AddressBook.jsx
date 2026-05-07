"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";

const EMPTY_FORM = {
  fullName: "",
  region: "",
  phone: "",
  city: "",
  building: "",
  area: "",
  colony: "",
  address: "",
  email: "",
  label: "Home",
};

export default function AddressBook() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const addresses = useCheckoutStore((state) => state.addresses);
  const selectedAddressId = useCheckoutStore((state) => state.selectedAddressId);
  const saveAddress = useCheckoutStore((state) => state.saveAddress);
  const removeAddress = useCheckoutStore((state) => state.removeAddress);
  const setSelectedAddress = useCheckoutStore((state) => state.setSelectedAddress);

  const [editingId, setEditingId] = useState(null);
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === editingId),
    [addresses, editingId],
  );
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName || "",
      region: address.region || "",
      phone: address.phone || "",
      city: address.city || "",
      building: address.building || "",
      area: address.area || "",
      colony: address.colony || "",
      address: address.address || "",
      email: address.email || "",
      label: address.label || "Home",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAddress({
      ...(selectedAddress ? { id: selectedAddress.id } : {}),
      ...form,
    });
    if (nextPath) {
      router.push(nextPath);
      return;
    }
    openAdd();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#2e5e2e]">Address Book</h2>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white"
        >
          Add New Address
        </button>
      </div>

      <div className="rounded-lg border border-gray-100">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-800">{address.fullName}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">{address.address}</p>
              <p className="text-xs text-gray-500">
                {[address.area, address.city, address.region].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAddress(address.id);
                  if (nextPath) {
                    router.push(nextPath);
                  }
                }}
                className={`rounded border px-3 py-1 text-xs font-semibold ${
                  selectedAddressId === address.id
                    ? "border-[#2e5e2e] bg-[#2e5e2e] text-white"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {selectedAddressId === address.id ? "Selected" : "Use This"}
              </button>
              <button
                onClick={() => openEdit(address)}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => removeAddress(address.id)}
                className="rounded border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-100 p-4">
        <h3 className="text-base font-semibold text-gray-800">
          {editingId ? "Edit Address" : "Add Address"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["fullName", "Full Name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["address", "Address"],
            ["city", "City"],
            ["region", "Region"],
            ["area", "Area"],
            ["building", "Building"],
            ["colony", "Landmark"],
          ].map(([key, label]) => (
            <input
              key={key}
              value={form[key] || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={label}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            />
          ))}
          <select
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white"
        >
          Save Address
        </button>
      </form>
    </div>
  );
}
