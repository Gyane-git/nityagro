"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import useWarningModalStore from "@/store/warningModalStore";

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem("admin_auth") ||
    localStorage.getItem("admin_token") ||
    sessionStorage.getItem("admin_token");

  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.accessToken || parsed?.jwt || null;
  } catch {
    return raw;
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function normalizeUnitStatus(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (raw === "instock") return "in_stock";
  if (raw === "in_stock") return "in_stock";
  if (raw === "sold") return "sold";
  if (raw === "returned") return "returned";
  return "in_stock";
}

export default function ProductUnitsPage() {
  const router = useRouter();
  const openConfirm = useConfirmModalStore((state) => state.open);
  const openWarning = useWarningModalStore((state) => state.open);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [productCode, setProductCode] = useState("");
  const [serials, setSerials] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editSerial, setEditSerial] = useState("");
  const [editStatus, setEditStatus] = useState("in_stock");
  const [deletingId, setDeletingId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  const loadUnits = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCode) params.set("productCode", filterCode);
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await fetch(`/api/admin/product-units?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to load units");
      setItems(payload?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load product units");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filterCode, filterStatus, router]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const parsedSerials = useMemo(() => {
    return serials
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [serials]);

  const summaryByProduct = useMemo(() => {
    const grouped = new Map();
    for (const unit of items) {
      const key = unit.productCode || "UNKNOWN";
      if (!grouped.has(key)) {
        grouped.set(key, {
          productCode: key,
          productName: unit.product?.name || "-",
          in_stock: 0,
          sold: 0,
          returned: 0,
          total: 0,
        });
      }
      const entry = grouped.get(key);
      const status = normalizeUnitStatus(unit.status);
      entry.total += 1;
      if (status === "in_stock") entry.in_stock += 1;
      if (status === "sold") entry.sold += 1;
      if (status === "returned") entry.returned += 1;
    }
    return Array.from(grouped.values()).sort((a, b) =>
      String(a.productCode).localeCompare(String(b.productCode))
    );
  }, [items]);

  const handleCreate = async () => {
    if (!productCode.trim() || parsedSerials.length === 0) {
      toast.error("Product code and serials required");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/product-units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productCode: productCode.trim(),
          serialNumbers: parsedSerials,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to create units");
      toast.success("Product units added");
      setSerials("");
      loadUnits();
    } catch (error) {
      toast.error(error.message || "Failed to create units");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (unit) => {
    setEditingId(String(unit.id));
    setEditSerial(unit.serialNumber || "");
    setEditStatus(normalizeUnitStatus(unit.status));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSerial("");
    setEditStatus("in_stock");
  };

  const saveEdit = async (id) => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }
    try {
      const res = await fetch(`/api/admin/product-units/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serialNumber: editSerial.trim(),
          status: normalizeUnitStatus(editStatus),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to update unit");
      toast.success("Unit updated");
      cancelEdit();
      loadUnits();
    } catch (error) {
      toast.error(error.message || "Failed to update unit");
    }
  };

  const deleteUnit = async (id) => {
    const token = getAdminToken();
    if (!token) {
      openWarning({
        title: "Session Expired",
        message: "Please login again to delete product unit.",
        onOkay: () => router.replace("/login-admin"),
      });
      return;
    }

    openConfirm({
      title: "Delete Product Unit",
      message: "Are you sure you want to delete this product unit?",
      onConfirm: async () => {
        try {
          setDeletingId(String(id));
          const res = await fetch(`/api/admin/product-units/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const payload = await res.json();
          if (!res.ok) throw new Error(payload?.message || "Failed to delete unit");
          toast.success("Unit deleted");
          loadUnits();
        } catch (error) {
          toast.error(error.message || "Failed to delete unit");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const showProductDetails = async () => {
    const code = productCode.trim();
    if (!code) {
      toast.error("Enter product code first");
      return;
    }
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }
    try {
      setPreviewLoading(true);
      const res = await fetch(
        `/api/admin/product-units/product?productCode=${encodeURIComponent(code)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to load product details");
      setPreviewProduct(payload?.data || null);
      setPreviewOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load product details");
      setPreviewProduct(null);
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {previewOpen && previewProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="p-5 grid gap-5 md:grid-cols-[220px_1fr]">
              <img
                src={resolveImageUrl(
                  previewProduct?.mainImage || previewProduct?.images?.[0]?.mainImage
                )}
                alt={previewProduct?.name || "Product"}
                className="w-full h-[220px] object-cover rounded-lg border bg-gray-50"
              />
              <div className="space-y-2 text-sm">
                <div className="text-xl font-bold text-gray-900">
                  {previewProduct?.name || "-"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Code:</span>{" "}
                  {previewProduct?.productCode || "-"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Brand:</span>{" "}
                  {previewProduct?.brandName || previewProduct?.brand?.name || "-"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Category:</span>{" "}
                  {previewProduct?.categoryName || previewProduct?.category?.category || "-"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Price:</span> Rs.{" "}
                  {previewProduct?.sellPrice ?? "-"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Stock:</span>{" "}
                  {String(previewProduct?.availableQuantity ?? "0")}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Warranty:</span>{" "}
                  {previewProduct?.warrantyDays || 365} days
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Description:</span>{" "}
                  {previewProduct?.description || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Units</h1>
          <p className="text-sm text-gray-500">Manage serial numbers and stock units</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-600">Product Code</label>
            <div className="flex gap-2">
              <input
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="PRD001..."
              />
              <button
                type="button"
                onClick={showProductDetails}
                disabled={previewLoading}
                className="border rounded px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {previewLoading ? "Loading..." : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Bulk Serial Numbers</label>
            <textarea
              value={serials}
              onChange={(e) => setSerials(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="SN001\nSN002\nSN003"
            />
            <div className="text-xs text-gray-500 mt-1">
              {parsedSerials.length} serials detected
            </div>
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Units"}
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4 flex flex-col md:flex-row gap-3">
        <input
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
          placeholder="Filter by product code"
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All status</option>
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
          <option value="returned">Returned</option>
        </select>
        <button
          onClick={loadUnits}
          className="border rounded px-4 py-2 hover:bg-gray-50"
        >
          Apply
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Stock Summary By Product</h2>
        {summaryByProduct.length === 0 ? (
          <div className="text-sm text-gray-500">No serial stock summary yet.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">In Stock</th>
                  <th className="px-3 py-2">Sold</th>
                  <th className="px-3 py-2">Returned</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Warning</th>
                </tr>
              </thead>
              <tbody>
                {summaryByProduct.map((row) => (
                  <tr key={row.productCode} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.productName}</td>
                    <td className="px-3 py-2">{row.productCode}</td>
                    <td className="px-3 py-2">{row.in_stock}</td>
                    <td className="px-3 py-2">{row.sold}</td>
                    <td className="px-3 py-2">{row.returned}</td>
                    <td className="px-3 py-2">{row.total}</td>
                    <td className="px-3 py-2">
                      {row.in_stock <= 0 ? (
                        <span className="inline-flex rounded-full bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold">
                          All serials sold out
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading product units...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No product units found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Serial</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((unit) => (
                  <tr key={unit.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono">
                      {editingId === String(unit.id) ? (
                        <input
                          value={editSerial}
                          onChange={(e) => setEditSerial(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        unit.serialNumber
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{unit.product?.name || "-"}</div>
                      <div className="text-xs text-gray-500">{unit.productCode}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {editingId === String(unit.id) ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="in_stock">in_stock</option>
                          <option value="sold">sold</option>
                          <option value="returned">returned</option>
                        </select>
                      ) : (
                        normalizeUnitStatus(unit.status)
                      )}
                    </td>
                    <td className="px-4 py-3">{formatDate(unit.createdAt)}</td>
                    <td className="px-4 py-3">
                      {editingId === String(unit.id) ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(unit.id)}
                            className="border rounded px-2 py-1 text-xs hover:bg-gray-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="border rounded px-2 py-1 text-xs hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(unit)}
                            className="border rounded px-2 py-1 text-xs hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            disabled={deletingId === String(unit.id)}
                            onClick={() => deleteUnit(unit.id)}
                            className="border rounded px-2 py-1 text-xs hover:bg-red-50 text-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
