"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import useWarningModalStore from "@/store/warningModalStore";
import useInfoModalStore from "@/store/infoModalStore";

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

export default function ReturnsPage() {
  const router = useRouter();
  const openConfirm = useConfirmModalStore((state) => state.open);
  const openWarning = useWarningModalStore((state) => state.open);
  const openInfo = useInfoModalStore((state) => state.open);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusModal, setStatusModal] = useState({
    open: false,
    item: null,
    nextStatus: "",
    serialNumber: "",
    serialNumbers: [],
    serialSelectionRequired: false,
    serialLoading: false,
    courierName: "",
    cnNumber: "",
    cnDate: "",
    remark: "",
  });

  const loadReturns = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);
      const response = await fetch(`/api/admin/returns?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to fetch returns");
      setItems(payload?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch returns");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const doUpdateReturnStatus = async (item, nextStatus, extra = {}) => {
    const token = getAdminToken();
    if (!token) {
      openWarning({
        title: "Session Expired",
        message: "Please login again to update return status.",
        onOkay: () => router.replace("/login-admin"),
      });
      return;
    }

    try {
      setUpdatingId(item.id);
      const response = await fetch(`/api/admin/returns/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus, ...extra }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update return status");
      }

      setItems((prev) =>
        prev.map((row) =>
          String(row.id) === String(item.id) ? { ...row, status: nextStatus } : row
        )
      );
      openInfo({
        title: "Status Updated",
        message: `Return status updated to "${nextStatus}".`,
      });
    } catch (error) {
      toast.error(error.message || "Failed to update return status");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateReturnStatus = async (item, nextStatus) => {
    if (nextStatus === "shipped") {
      const token = getAdminToken();
      const orderId = item?.order?.id;
      setStatusModal({
        open: true,
        item,
        nextStatus: "shipped",
        serialNumber: "",
        serialNumbers: [],
        serialSelectionRequired: false,
        serialLoading: true,
        courierName: "",
        cnNumber: "",
        cnDate: "",
        remark: "",
      });

      if (!token || !orderId) {
        setStatusModal((prev) => ({ ...prev, serialLoading: false }));
        return;
      }

      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load serial numbers");
        }
        const detail = payload?.data || {};
        setStatusModal((prev) => ({
          ...prev,
          serialNumbers: Array.isArray(detail.availableSerialNumbers)
            ? detail.availableSerialNumbers
            : [],
          serialSelectionRequired: Boolean(detail.serialSelectionRequired),
          serialLoading: false,
        }));
      } catch (error) {
        setStatusModal((prev) => ({ ...prev, serialLoading: false }));
        toast.error(error.message || "Failed to load serial numbers");
      }
      return;
    }

    openConfirm({
      title: "Update Return Status",
      message: `Are you sure you want to change status to "${nextStatus}"?`,
      onConfirm: async () => {
        await doUpdateReturnStatus(item, nextStatus);
      },
    });
  };

  const closeStatusModal = () => {
    setStatusModal({
      open: false,
      item: null,
      nextStatus: "",
      serialNumber: "",
      serialNumbers: [],
      serialSelectionRequired: false,
      serialLoading: false,
      courierName: "",
      cnNumber: "",
      cnDate: "",
      remark: "",
    });
  };

  const submitShippedModal = async () => {
    if (!statusModal.item) return;
    if (!statusModal.courierName.trim()) {
      toast.error("Courier name is required");
      return;
    }
    if (
      statusModal.serialSelectionRequired &&
      !statusModal.serialNumber
    ) {
      toast.error("Please select serial number");
      return;
    }

    await doUpdateReturnStatus(statusModal.item, "shipped", {
      courierName: statusModal.courierName.trim(),
      cnNumber: statusModal.cnNumber.trim() || undefined,
      cnDate: statusModal.cnDate || undefined,
      serialNumber: statusModal.serialNumber || undefined,
      remark: statusModal.remark.trim() || undefined,
    });
    closeStatusModal();
  };

  const stats = useMemo(() => {
    const base = { all: items.length, new: 0, shipped: 0, cancelled: 0 };
    items.forEach((item) => {
      const key = String(item.status || "new").toLowerCase();
      if (base[key] !== undefined) base[key] += 1;
    });
    return base;
  }, [items]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Returns</h1>
      <p className="text-sm text-gray-500 mb-4">
        Customer return requests with product-level details
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.entries(stats).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`rounded-lg border px-3 py-2 text-left ${
              statusFilter === key
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <div className="text-xs uppercase font-semibold">{key}</div>
            <div className="text-lg font-bold">{val}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading return requests...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No return requests found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Return Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  (() => {
                    const isLocked =
                      String(item.status || "").toLowerCase() === "shipped" ||
                      String(item.status || "").toLowerCase() === "cancelled";
                    return (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.user?.fullName || "-"}</div>
                      <div className="text-xs text-gray-500">{item.user?.email || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">#{item.order?.orderNumber || "-"}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        order status: {item.order?.orderStatus || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.product?.name || item.productCode}</div>
                      <div className="text-xs text-gray-500">{item.productCode}</div>
                    </td>
                    <td className="px-4 py-3">{Number(item.quantity || 0)}</td>
                    <td className="px-4 py-3 max-w-[360px]">
                      <div className="line-clamp-3">{item.reason}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{item.status || "new"}</td>
                    <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status || "new"}
                        onChange={(e) => updateReturnStatus(item, e.target.value)}
                        disabled={updatingId === item.id || isLocked}
                        className="border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="new">new</option>
                        <option value="shipped">shipped</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                    );
                  })()
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {statusModal.open && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Shipped Return</h3>
              <button onClick={closeStatusModal} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Choose warranty serial number</label>
                <select
                  value={statusModal.serialNumber}
                  onChange={(e) =>
                    setStatusModal((prev) => ({ ...prev, serialNumber: e.target.value }))
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  disabled={statusModal.serialLoading || !statusModal.serialSelectionRequired}
                >
                  {!statusModal.serialSelectionRequired ? (
                    <option value="">No serial number required</option>
                  ) : (
                    <option value="">Select Serial Number</option>
                  )}
                  {(statusModal.serialNumbers || []).map((serialItem) => (
                    <option
                      key={`${serialItem.productCode}-${serialItem.serialNumber}`}
                      value={serialItem.serialNumber}
                    >
                      {`${serialItem.productName || serialItem.productCode || "Product"} - ${serialItem.serialNumber}`}
                    </option>
                  ))}
                </select>
                {statusModal.serialLoading && (
                  <p className="text-xs text-gray-500">Loading serial numbers...</p>
                )}

                <label className="text-sm text-gray-700">Courier Name</label>
                <input
                  value={statusModal.courierName}
                  onChange={(e) =>
                    setStatusModal((prev) => ({ ...prev, courierName: e.target.value }))
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Enter Courier Name."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">CN Number (optional)</label>
                  <input
                    value={statusModal.cnNumber}
                    onChange={(e) =>
                      setStatusModal((prev) => ({ ...prev, cnNumber: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Consignment number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">CN Date (optional)</label>
                  <input
                    type="date"
                    value={statusModal.cnDate}
                    onChange={(e) =>
                      setStatusModal((prev) => ({ ...prev, cnDate: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Remark (optional)</label>
                <textarea
                  rows={3}
                  value={statusModal.remark}
                  onChange={(e) =>
                    setStatusModal((prev) => ({ ...prev, remark: e.target.value }))
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Any notes for shipment..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeStatusModal}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitShippedModal}
                disabled={updatingId === statusModal.item?.id}
                className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {updatingId === statusModal.item?.id ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
