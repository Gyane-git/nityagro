"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import { X } from "lucide-react";
const EMPTY_FORM = {
  fullName: "",
  provinceId: "",
  province: "",
  districtId: "",
  district: "",
  phone: "",
  cityId: "",
  city: "",
  ward: "",
  locality: "",
  email: "",
  zipCode: "",
  addType: "Home",
};

const PHONE_REGEX = /^\d{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^[A-Za-z0-9 -]{3,12}$/;
const normalizeText = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");
const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

const normalizeOptionName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export default function AddressBook({ userId = "1" }) {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState({
    provinces: false,
    districts: false,
    cities: false,
  });

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
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLocationLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const response = await fetch("/api/location/provinces", {
          cache: "no-store",
        }).then((res) => res.json());
        if (!response.success) {
          toast.error(response.message || "Failed to fetch provinces");
          return;
        }
        setProvinces(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch provinces");
      } finally {
        setLocationLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!form.provinceId) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLocationLoading((prev) => ({ ...prev, districts: true }));
      try {
        const response = await fetch(`/api/location/districts?province=${encodeURIComponent(form.provinceId)}`, { cache: "no-store" }).then((res) => res.json());
        if (!response.success) {
          toast.error(response.message || "Failed to fetch districts");
          return;
        }
        setDistricts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch districts");
      } finally {
        setLocationLoading((prev) => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [form.provinceId]);

  useEffect(() => {
    if (!form.districtId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLocationLoading((prev) => ({ ...prev, cities: true }));
      try {
        const response = await fetch(`/api/location/municipalities?district=${encodeURIComponent(form.districtId)}`, { cache: "no-store" }).then((res) => res.json());
        if (!response.success) {
          toast.error(response.message || "Failed to fetch cities");
          return;
        }
        setCities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch cities");
      } finally {
        setLocationLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [form.districtId]);

  useEffect(() => {
    if (form.provinceId || !form.province || provinces.length === 0) return;
    const matched = provinces.find((province) => normalizeOptionName(province.name) === normalizeOptionName(form.province));
    if (matched) {
      setForm((prev) => ({ ...prev, provinceId: String(matched.id) }));
    }
  }, [form.province, form.provinceId, provinces]);

  useEffect(() => {
    if (form.districtId || !form.district || districts.length === 0) return;
    const matched = districts.find((district) => normalizeOptionName(district.name) === normalizeOptionName(form.district));
    if (matched) {
      setForm((prev) => ({ ...prev, districtId: String(matched.id) }));
    }
  }, [form.district, form.districtId, districts]);

  useEffect(() => {
    if (form.cityId || !form.city || cities.length === 0) return;
    const matched = cities.find((city) => normalizeOptionName(city.name) === normalizeOptionName(form.city));
    if (matched) {
      setForm((prev) => ({ ...prev, cityId: String(matched.id) }));
    }
  }, [form.city, form.cityId, cities]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName || "",
      provinceId: "",
      province: address.region || "",
      districtId: "",
      district: address.district || "",
      phone: address.phone || "",
      cityId: "",
      city: address.city || "",
      ward: address.colony || "",
      locality: address.area || "",
      email: address.email || "",
      zipCode: address.zipCode || "",
      addType: address.addType || address.label || "Home",
    });

    setShowForm(true);
  };

  const handleProvinceChange = (event) => {
    const province = provinces.find((item) => String(item.id) === String(event.target.value));
    setForm((prev) => ({
      ...prev,
      provinceId: province ? String(province.id) : "",
      province: province?.name || "",
      districtId: "",
      district: "",
      cityId: "",
      city: "",
    }));
  };

  const handleDistrictChange = (event) => {
    const district = districts.find((item) => String(item.id) === String(event.target.value));
    setForm((prev) => ({
      ...prev,
      districtId: district ? String(district.id) : "",
      district: district?.name || "",
      cityId: "",
      city: "",
    }));
  };

  const handleCityChange = (event) => {
    const city = cities.find((item) => String(item.id) === String(event.target.value));
    setForm((prev) => ({
      ...prev,
      cityId: city ? String(city.id) : "",
      city: city?.name || "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    const fullName = normalizeText(form.fullName);
    const nameParts = fullName.split(" ").filter(Boolean); // MUST exist before use

    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else {
      if (nameParts.length < 2) {
        newErrors.fullName = "Please enter first and last name";
      } else {
        const first = nameParts[0];
        const last = nameParts[1];

        if (first.length < 2 || last.length < 2) {
          newErrors.fullName = "Each name must be at least 2 characters";
        } else if (first[0] !== first[0].toUpperCase() || last[0] !== last[0].toUpperCase()) {
          newErrors.fullName = "Each name must start with a capital letter";
        }
      }
    }

    // Phone: exactly 10 digits, starts with 97 or 98
    const phone = onlyDigits(form.phone);

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(97|98)\d{8}$/.test(phone)) {
      newErrors.phone = "Phone must be 10 digits and start with 97 or 98";
    }

    // Email (optional but must be valid if entered)
    if (form.email.trim()) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase());

      if (!emailValid) {
        newErrors.email = "Invalid email format";
      }
    }

    // Province required
    if (!form.province.trim()) {
      newErrors.province = "Province is required";
    }

    // District required
    if (!form.district.trim()) {
      newErrors.district = "District is required";
    }

    // City required
    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    // Zip code optional but max 7 digits
    if (form.zipCode.trim()) {
      const zip = form.zipCode.trim();
      if (!/^\d{1,7}$/.test(zip)) {
        newErrors.zipCode = "Zip code must be max 7 digits";
      }
    }

    // Ward required
    if (!form.ward.trim()) {
      newErrors.ward = "Ward is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    const payload = {
      ...(selectedAddress ? { id: selectedAddress.id } : {}),
      userId,
      fullName: normalizeText(form.fullName),
      phone: onlyDigits(form.phone),
      email: form.email.trim().toLowerCase(),
      region: normalizeText(form.province),
      district: normalizeText(form.district),
      city: normalizeText(form.city),
      colony: normalizeText(form.ward),
      area: normalizeText(form.locality),
      zipCode: form.zipCode.trim(),
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

    toast.success("Address saved successfully");

    await fetchAddresses();

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
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

                    toast.success("Address selected. Redirecting...");

                    setTimeout(() => {
                      if (nextPath) {
                        router.push(nextPath);
                      }
                    }, 2000);
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

      {showForm && (
        <form onSubmit={handleSubmit} className="relative space-y-4 rounded-lg border border-gray-100 p-4 text-gray-700">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setErrors({});
            }}
            className="absolute right-3 top-3 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            <X className="bg-red-500 rounded-md text-gray-600" />
          </button>

          <h3 className="text-base font-semibold text-gray-800">{editingId ? "Edit Address" : "Add Address"}</h3>

          {/* GRID START */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* INPUT FIELDS */}
            {[
              ["fullName", "Full Name"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["ward", "Ward"],
              ["locality", "Locality"],
              ["zipCode", "Zip Code"],
            ].map(([key, label]) => (
              <div key={key} className="flex flex-col">
                <input
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: key === "phone" ? onlyDigits(e.target.value).slice(0, 15) : e.target.value,
                    }))
                  }
                  placeholder={`${label}${["fullName", "phone", "ward"].includes(key) ? " *" : ""}`}
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  inputMode={key === "phone" ? "numeric" : undefined}
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                />

                {errors?.[key] && <span className="text-xs text-red-500 mt-1">{errors[key]}</span>}
              </div>
            ))}

            {/* Province */}
            <div className="flex flex-col">
              <select value={form.provinceId} onChange={handleProvinceChange} className="rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="">{locationLoading.provinces ? "Loading provinces..." : "Select Province"}</option>

                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>

              {errors?.province && <span className="text-xs text-red-500 mt-1">{errors.province}</span>}
            </div>

            {/* District */}
            <div className="flex flex-col">
              <select value={form.districtId} onChange={handleDistrictChange} disabled={!form.provinceId || locationLoading.districts} className="rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">{locationLoading.districts ? "Loading districts..." : "Select District"}</option>

                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>

              {errors?.district && <span className="text-xs text-red-500 mt-1">{errors.district}</span>}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <select value={form.cityId} onChange={handleCityChange} disabled={!form.districtId || locationLoading.cities} className="rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">{locationLoading.cities ? "Loading cities..." : "Select City"}</option>

                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              {errors?.city && <span className="text-xs text-red-500 mt-1">{errors.city}</span>}
            </div>

            {/* Address Type */}
            <select value={form.addType} onChange={(e) => setForm((prev) => ({ ...prev, addType: e.target.value }))} className="rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="Home">Home</option>
              <option value="Office">Office</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white">
            Save Address
          </button>
        </form>
      )}
    </div>
  );
}
