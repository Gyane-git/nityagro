"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type LocationOption = {
  id: number | string;
  name: string;
};

type ShippingCostRow = {
  id: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  cityId: string;
  cityName: string;
  shippingCost: number;
};

export default function ShippingAdminPage() {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [rows, setRows] = useState<ShippingCostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    cityId: "",
    cityName: "",
    shippingCost: "",
  });

  const fetchRows = async () => {
    const response = await fetch("/api/admin/shipping-costs").then((res) =>
      res.json(),
    );
    if (response.success) {
      setRows(Array.isArray(response.data) ? response.data : []);
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/location/provinces").then((res) =>
          res.json(),
        );
        if (!response.success) {
          toast.error(response.message || "Failed to load provinces");
          return;
        }
        setProvinces(Array.isArray(response.data) ? response.data : []);
        await fetchRows();
      } catch (error) {
        console.error(error);
        toast.error("Failed to load shipping data");
      } finally {
        setLoading(false);
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
      const response = await fetch(
        `/api/location/districts?province=${encodeURIComponent(form.provinceId)}`,
      ).then((res) => res.json());
      if (response.success) {
        setDistricts(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || "Failed to load districts");
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
      const response = await fetch(
        `/api/location/municipalities?district=${encodeURIComponent(form.districtId)}`,
      ).then((res) => res.json());
      if (response.success) {
        setCities(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || "Failed to load cities");
      }
    };

    fetchCities();
  }, [form.districtId]);

  const chooseProvince = (id: string) => {
    const province = provinces.find((item) => String(item.id) === id);
    setForm((prev) => ({
      ...prev,
      provinceId: id,
      provinceName: province?.name || "",
      districtId: "",
      districtName: "",
      cityId: "",
      cityName: "",
    }));
  };

  const chooseDistrict = (id: string) => {
    const district = districts.find((item) => String(item.id) === id);
    setForm((prev) => ({
      ...prev,
      districtId: id,
      districtName: district?.name || "",
      cityId: "",
      cityName: "",
    }));
  };

  const chooseCity = (id: string) => {
    const city = cities.find((item) => String(item.id) === id);
    setForm((prev) => ({
      ...prev,
      cityId: id,
      cityName: city?.name || "",
    }));
  };

  const saveCharge = async () => {
    if (
      !form.provinceId ||
      !form.districtId ||
      !form.cityId ||
      !form.shippingCost
    ) {
      toast.error("Please choose province, district, city and charge");
      return;
    }

    const saveToastId = toast.loading("Saving delivery charge...");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/shipping-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingCost: Number(form.shippingCost),
        }),
      }).then((res) => res.json());

      if (!response.success) {
        toast.error(response.message || "Failed to save delivery charge", {
          id: saveToastId,
        });
        return;
      }

      toast.success(response.message || "Delivery charge saved", {
        id: saveToastId,
      });
      setForm((prev) => ({ ...prev, cityId: "", cityName: "", shippingCost: "" }));
      await fetchRows();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save delivery charge", { id: saveToastId });
    } finally {
      setSaving(false);
    }
  };

  const deleteCharge = async (id: string) => {
    const response = await fetch("/api/admin/shipping-costs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then((res) => res.json());

    if (!response.success) {
      toast.error(response.message || "Failed to delete delivery charge");
      return;
    }
    toast.success(response.message || "Delivery charge deleted");
    await fetchRows();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set delivery charge by province, district and city.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Set Delivery Charge
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <select
                value={form.provinceId}
                onChange={(e) => chooseProvince(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              >
                <option value="">{loading ? "Loading..." : "Select Province"}</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>

              <select
                value={form.districtId}
                onChange={(e) => chooseDistrict(e.target.value)}
                disabled={!form.provinceId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 disabled:bg-gray-100"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>

              <select
                value={form.cityId}
                onChange={(e) => chooseCity(e.target.value)}
                disabled={!form.districtId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 disabled:bg-gray-100"
              >
                <option value="">Select City / Municipality</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Delivery charge amount"
                value={form.shippingCost}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, shippingCost: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
              />

              <button
                onClick={saveCharge}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-md transition-colors"
              >
                {saving ? "Saving..." : "Save Delivery Charge"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery Charges List ({rows.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charge</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                        No delivery charge added yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-semibold">{row.cityName}</div>
                          <div className="text-xs text-gray-500">
                            {row.districtName}, {row.provinceName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          NPR {Number(row.shippingCost || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteCharge(row.id)}
                            className="rounded border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
