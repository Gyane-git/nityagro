"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";

const EMPTY_FORM = {
  fullName: "",
  province: "",
  district: "",
  phone: "",
  city: "",
  ward: "",
  locality: "",
  email: "",
  zipCode: "",
  addType: "Home",
};

const PHONE_REGEX = /^[+\d\s-]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddressBook({ userId = "1" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const selectedAddressId = useCheckoutStore((state) => state.selectedAddressId);
  const setSelectedAddress = useCheckoutStore((state) => state.setSelectedAddress);
  const setAddressesFromServer = useCheckoutStore((state) => state.setAddressesFromServer);
  const openConfirm = useConfirmModalStore((state) => state.open);

  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const selectedAddress = useMemo(() => addresses.find((address) => address.id === editingId), [addresses, editingId]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch("/api/account/addresses", {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      }).then((res) => res.json());
      if (!response.success) {
        toast.error(response.message || "Failed to fetch addresses");
        return;
      }
      const rows = Array.isArray(response.data) ? response.data : [];
      setAddresses(rows);
      setAddressesFromServer(rows);
    } finally {
      setLoading(false);
    }
  }, [setAddressesFromServer, userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses();
  }, [fetchAddresses]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName || "",
      province: address.region || "",
      district: address.district || "",
      phone: address.phone || "",
      city: address.city || "",
      ward: address.colony || "",
      locality: address.area || "",
      email: address.email || "",
      zipCode: address.zipCode || "",
      addType: address.addType || address.label || "Home",
    });
  };

  const validate = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 2) return "Full name is required";
    if (!form.phone.trim() || !PHONE_REGEX.test(form.phone.trim())) return "Valid phone is required";
    if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) return "Valid email is required";
    if (!form.city.trim()) return "City is required";
    if (!form.district.trim()) return "District is required";
    if (!form.province.trim()) return "Province is required";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      ...(selectedAddress ? { id: selectedAddress.id } : {}),
      userId,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      region: form.province,
      district: form.district,
      city: form.city,
      colony: form.ward,
      area: form.locality,
      zipCode: form.zipCode,
      addType: form.addType,
      label: form.addType,
    };

    const token = window.localStorage.getItem("token");
    const response = await fetch("/api/account/addresses", {
      method: selectedAddress ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (!response.success) {
      toast.error(response.message || "Failed to save address");
      return;
    }

    toast.success(response.message || "Address saved successfully");
    await fetchAddresses();

    if (nextPath) {
      router.push(nextPath);
      return;
    }
    openAdd();
  };

  const handleDelete = async (id) => {
    openConfirm({
      title: "Delete Address",
      message: "Are you sure you want to delete this delivery address?",
      onConfirm: async () => {
        const token = window.localStorage.getItem("token");
        const response = await fetch("/api/account/addresses", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        }).then((res) => res.json());
        if (!response.success) {
          toast.error(response.message || "Failed to delete address");
          return;
        }
        toast.success(response.message || "Address deleted");
        await fetchAddresses();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-[#2e5e2e]">Address Book</h2>
        <button onClick={openAdd} className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white">
          Add New Address
        </button>
      </div>

      <div className="rounded-lg border border-gray-100">
        {loading ? (
          <div className="px-4 py-4 text-sm text-gray-500">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="px-4 py-4 text-sm text-gray-500">No addresses found.</div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">{address.fullName}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-xs text-gray-500">{[address.colony, address.city, address.region].filter(Boolean).join(", ")}</p>
              </div>
              {/* <div className="flex flex-col sm:flex-row gap-2 sm:items-center"> */}
              {/* <div className="flex flex-row flex-nowrap gap-2 items-center overflow-x-auto"> */}
              <div className="flex flex-row flex-nowrap gap-2 items-center w-fit">
                <button
                  onClick={() => {
                    setSelectedAddress(address.id);
                    if (nextPath) router.push(nextPath);
                  }}
                  className={`rounded border px-3 py-1 text-xs font-semibold ${selectedAddressId === address.id ? "border-[#2e5e2e] bg-[#2e5e2e] text-white" : "border-gray-300 text-gray-700"}`}
                >
                  {selectedAddressId === address.id ? "Selected" : "Use This"}
                </button>
                <button onClick={() => openEdit(address)} className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="rounded border border-red-300 px-3 py-1 text-xs font-semibold text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-100 p-4 text-gray-700">
        <h3 className="text-base font-semibold text-gray-800">{editingId ? "Edit Address" : "Add Address"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["fullName", "Full Name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["province", "Province"],
            ["district", "District"],
            ["city", "City"],
            ["ward", "Ward"],
            ["locality", "Locality"],
            ["zipCode", "Zip Code"],
          ].map(([key, label]) => (
            <input key={key} value={form[key] || ""} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} placeholder={label} className="rounded border border-gray-300 px-3 py-2 text-sm" />
          ))}
          <select value={form.addType} onChange={(e) => setForm((prev) => ({ ...prev, addType: e.target.value }))} className="rounded border border-gray-300 px-3 py-2 text-sm">
            <option value="Home">Home</option>
            <option value="Office">Office</option>
          </select>
        </div>
        <button type="submit" className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white">
          Save Address
        </button>
      </form>
    </div>
  );
}
