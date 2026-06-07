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

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function getStatusClass(status) {
  const current = String(status || "new").toLowerCase();
  if (current === "shipped") return "bg-sky-50 text-sky-700 border-sky-100";
  if (current === "cancelled") return "bg-red-50 text-red-700 border-red-100";
  if (current === "refunded") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-orange-50 text-orange-700 border-orange-100";
}

function ModalShell({ title, children, footer, onClose, maxWidth = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4">
      <div className={`w-full ${maxWidth} rounded-xl border bg-white p-5 text-gray-900 shadow-xl`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Close</button>
        </div>
        {children}
        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-gray-800">{value || "-"}</div>
    </div>
  );
}

function parseComboItems(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function ReturnDetailsModal({ item, onClose }) {
  if (!item) return null;
  const status = String(item.status || "new").toLowerCase();
  const comboItems = item.orderType === "combo" ? parseComboItems(item.comboItems) : [];
  const steps = [
    { key: "new", label: "Return Requested", done: true },
    { key: "shipped", label: "Return Shipped", done: ["shipped", "refunded"].includes(status) },
    { key: "refunded", label: "Refunded", done: status === "refunded" },
  ];

  return (
    <ModalShell title="Return Full Details" onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 rounded-lg border bg-gray-50 p-4 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.key} className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step.done ? "bg-[#00462C] text-white" : "border bg-white text-gray-400"}`}>
                {step.done ? "✓" : "•"}
              </span>
              <span className="text-sm font-semibold text-gray-700">{step.label}</span>
            </div>
          ))}
          {status === "cancelled" ? (
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">!</span>
              <span className="text-sm font-semibold text-red-700">Cancelled</span>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DetailRow label="Customer" value={`${item.user?.fullName || "-"} (${item.user?.phone || item.user?.email || "-"})`} />
          <DetailRow label="Order" value={`#${item.order?.orderNumber || "-"}`} />
          <DetailRow label="Order Type" value={item.orderType === "combo" ? "Combo Order" : "Normal Order"} />
          <DetailRow label="Current Status" value={item.status || "new"} />
          <DetailRow label="Product" value={item.product?.name || item.productCode} />
          <DetailRow label="Product Code" value={item.productCode} />
          <DetailRow label="Quantity" value={String(item.quantity || 0)} />
          <DetailRow label="Order Total" value={formatMoney(item.order?.totalAmount)} />
          <DetailRow label="Order Status" value={item.order?.orderStatus} />
          <DetailRow label="Payment Status" value={item.order?.paymentStatus} />
        </div>

        {comboItems.length > 0 ? (
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-bold text-gray-800">Combo Included Items</div>
            <div className="flex flex-wrap gap-2">
              {comboItems.map((comboItem) => (
                <span key={comboItem} className="rounded-full border bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">{comboItem}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border p-4">
          <div className="mb-1 text-sm font-bold text-gray-800">Customer Return Reason</div>
          <p className="text-sm leading-relaxed text-gray-600">{item.reason || "-"}</p>
        </div>

        {item.shipment ? (
          <div className="rounded-lg border p-4">
            <div className="mb-3 text-sm font-bold text-gray-800">Shipment Details</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DetailRow label="Courier" value={item.shipment.courierName} />
              <DetailRow label="CN Number" value={item.shipment.cnNumber} />
              <DetailRow label="CN Date" value={formatDate(item.shipment.cnDate)} />
              <DetailRow label="Shipment Status" value={item.shipment.status} />
              <DetailRow label="Shipment Updated" value={formatDate(item.shipment.updatedAt)} />
              <DetailRow label="Remark" value={item.shipment.remark} />
            </div>
          </div>
        ) : null}

        {item.refund ? (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="mb-3 text-sm font-bold text-emerald-900">Refund Details</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DetailRow label="Refund Mode" value={item.refund.mode} />
              <DetailRow label="Refund Amount" value={formatMoney(item.refund.amount)} />
              <DetailRow label="Transaction ID" value={item.refund.transactionId} />
              <DetailRow label="Refund Status" value={item.refund.status} />
              <DetailRow label="Refund Date" value={formatDate(item.refund.paymentDate)} />
              <DetailRow label="Updated At" value={formatDate(item.refund.updatedAt)} />
            </div>
          </div>
        ) : null}

        {item.cancellation ? (
          <div className="rounded-lg border border-red-100 bg-red-50/40 p-4">
            <div className="mb-3 text-sm font-bold text-red-900">Cancellation Details</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailRow label="Customer Reason" value={item.cancellation.reason} />
              <DetailRow label="Admin Reason" value={item.cancellation.adminReason} />
              <DetailRow label="Cancellation Date" value={formatDate(item.cancellation.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(item.cancellation.updatedAt)} />
            </div>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
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
  const [detailItem, setDetailItem] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, item: null, reason: "" });
  const [refundModal, setRefundModal] = useState({ open: false, item: null, refundMode: "COD Refund", transactionId: "", remark: "", amount: "" });
  const [statusModal, setStatusModal] = useState({ open: false, item: null, nextStatus: "", courierName: "", cnNumber: "", cnDate: "", remark: "" });

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
      const response = await fetch(`/api/admin/returns?${query.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
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
      openWarning({ title: "Session Expired", message: "Please login again to update return status.", onOkay: () => router.replace("/login-admin") });
      return false;
    }
    try {
      setUpdatingId(item.id);
      const response = await fetch(`/api/admin/returns/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus, ...extra }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to update return status");
      await loadReturns();
      openInfo({ title: "Status Updated", message: `Return status updated to "${nextStatus}".` });
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to update return status");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const openCancelModal = (item) => setCancelModal({ open: true, item, reason: "" });
  const openRefundModal = (item) => setRefundModal({ open: true, item, refundMode: "COD Refund", transactionId: "", remark: "", amount: String(item.order?.totalAmount || "") });

  const updateReturnStatus = async (item, nextStatus) => {
    if (nextStatus === "shipped") {
      setStatusModal({ open: true, item, nextStatus: "shipped", courierName: "", cnNumber: "", cnDate: "", remark: "" });
      return;
    }
    if (nextStatus === "cancelled") {
      openCancelModal(item);
      return;
    }
    if (nextStatus === "refunded") {
      openRefundModal(item);
      return;
    }
    openConfirm({ title: "Update Return Status", message: `Are you sure you want to change status to "${nextStatus}"?`, onConfirm: async () => doUpdateReturnStatus(item, nextStatus) });
  };

  const closeStatusModal = () => setStatusModal({ open: false, item: null, nextStatus: "", courierName: "", cnNumber: "", cnDate: "", remark: "" });

  const submitShippedModal = async () => {
    if (!statusModal.item) return;
    if (!statusModal.courierName.trim()) {
      toast.error("Courier name is required");
      return;
    }
    const ok = await doUpdateReturnStatus(statusModal.item, "shipped", { courierName: statusModal.courierName.trim(), cnNumber: statusModal.cnNumber.trim() || undefined, cnDate: statusModal.cnDate || undefined, remark: statusModal.remark.trim() || undefined });
    if (ok) closeStatusModal();
  };

  const submitCancelModal = async () => {
    if (!cancelModal.item) return;
    if (cancelModal.reason.trim().length < 5) {
      toast.error("Cancellation reason must be at least 5 characters");
      return;
    }
    const ok = await doUpdateReturnStatus(cancelModal.item, "cancelled", { adminReason: cancelModal.reason.trim() });
    if (ok) setCancelModal({ open: false, item: null, reason: "" });
  };

  const submitRefundModal = async () => {
    if (!refundModal.item) return;
    if (!refundModal.refundMode.trim()) {
      toast.error("Refund payment mode is required");
      return;
    }
    if (!Number(refundModal.amount) || Number(refundModal.amount) <= 0) {
      toast.error("Valid refund amount is required");
      return;
    }
    const ok = await doUpdateReturnStatus(refundModal.item, "refunded", { refundMode: refundModal.refundMode.trim(), transactionId: refundModal.transactionId.trim() || undefined, remark: refundModal.remark.trim() || undefined, amount: Number(refundModal.amount) });
    if (ok) setRefundModal({ open: false, item: null, refundMode: "COD Refund", transactionId: "", remark: "", amount: "" });
  };

  const stats = useMemo(() => {
    const base = { all: items.length, new: 0, shipped: 0, refunded: 0, cancelled: 0 };
    items.forEach((item) => {
      const key = String(item.status || "new").toLowerCase();
      if (base[key] !== undefined) base[key] += 1;
    });
    return base;
  }, [items]);

  return (
    <div className="p-4 text-gray-900 md:p-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Returns</h1>
      <p className="mb-4 text-sm text-gray-500">Customer return requests with product-level details</p>

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        {Object.entries(stats).map(([key, val]) => (
          <button key={key} onClick={() => setStatusFilter(key)} className={`rounded-lg border px-3 py-2 text-left ${statusFilter === key ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-700"}`}>
            <div className="text-xs font-semibold uppercase">{key}</div>
            <div className="text-lg font-bold">{val}</div>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading return requests...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No return requests found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Return Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Update</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = String(item.status || "new").toLowerCase();
                  const isTerminal = ["shipped", "cancelled", "refunded"].includes(status);
                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.user?.fullName || "-"}</div>
                        <div className="text-xs text-gray-500">{item.user?.email || "-"}</div>
                        <div className="text-xs text-gray-500">{item.user?.phone || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">#{item.order?.orderNumber || "-"}</div>
                        <div className="text-xs capitalize text-gray-500">order status: {item.order?.orderStatus || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{item.product?.name || item.productCode}</div>
                          {item.orderType === "combo" ? <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Combo</span> : null}
                        </div>
                        <div className="text-xs text-gray-500">{item.productCode}</div>
                      </td>
                      <td className="px-4 py-3">{Number(item.quantity || 0)}</td>
                      <td className="max-w-[320px] px-4 py-3"><div className="line-clamp-3">{item.reason || "-"}</div></td>
                      <td className="px-4 py-3 capitalize"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClass(status)}`}>{status}</span></td>
                      <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <select value={status} onChange={(event) => updateReturnStatus(item, event.target.value)} disabled={updatingId === item.id || isTerminal} className="rounded border px-2 py-1 disabled:bg-gray-100 disabled:text-gray-500">
                          <option value="new">new</option>
                          <option value="shipped">shipped</option>
                          <option value="refunded">refunded</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => setDetailItem(item)} className="rounded-md border px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">View</button>
                          <button onClick={() => openCancelModal(item)} disabled={isTerminal} className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
                          <button onClick={() => openRefundModal(item)} disabled={isTerminal} className="rounded-md border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">Refund</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {statusModal.open && (
        <ModalShell title="Shipped Return" onClose={closeStatusModal}>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Courier Name</label>
              <input value={statusModal.courierName} onChange={(event) => setStatusModal((prev) => ({ ...prev, courierName: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Enter courier name" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">CN Number (optional)</label>
                <input value={statusModal.cnNumber} onChange={(event) => setStatusModal((prev) => ({ ...prev, cnNumber: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Consignment number" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">CN Date (optional)</label>
                <input type="date" value={statusModal.cnDate} onChange={(event) => setStatusModal((prev) => ({ ...prev, cnDate: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Remark (optional)</label>
              <textarea rows={3} value={statusModal.remark} onChange={(event) => setStatusModal((prev) => ({ ...prev, remark: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Any notes for shipment..." />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={closeStatusModal} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={submitShippedModal} disabled={updatingId === statusModal.item?.id} className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50">{updatingId === statusModal.item?.id ? "Updating..." : "Update"}</button>
          </div>
        </ModalShell>
      )}

      {cancelModal.open && (
        <ModalShell title="Cancel Return Product" onClose={() => setCancelModal({ open: false, item: null, reason: "" })} footer={<><button onClick={() => setCancelModal({ open: false, item: null, reason: "" })} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Close</button><button onClick={submitCancelModal} disabled={updatingId === cancelModal.item?.id} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50">{updatingId === cancelModal.item?.id ? "Cancelling..." : "Cancel Product"}</button></>}>
          <div className="space-y-3">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">This will mark the product/order as cancelled and save this note in order cancellation admin reason.</div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Admin cancellation reason</label>
              <textarea rows={4} value={cancelModal.reason} onChange={(event) => setCancelModal((prev) => ({ ...prev, reason: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Write why this return/product is cancelled..." />
            </div>
          </div>
        </ModalShell>
      )}

      {refundModal.open && (
        <ModalShell title="Refund Payment" onClose={() => setRefundModal({ open: false, item: null, refundMode: "COD Refund", transactionId: "", remark: "", amount: "" })} footer={<><button onClick={() => setRefundModal({ open: false, item: null, refundMode: "COD Refund", transactionId: "", remark: "", amount: "" })} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Close</button><button onClick={submitRefundModal} disabled={updatingId === refundModal.item?.id} className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 disabled:opacity-50">{updatingId === refundModal.item?.id ? "Saving..." : "Save Refund"}</button></>}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">Refund By / Payment Mode</label><input value={refundModal.refundMode} onChange={(event) => setRefundModal((prev) => ({ ...prev, refundMode: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Cash, Bank Transfer, ConnectIPS..." /></div>
            <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">Refund Amount</label><input type="number" min="0" value={refundModal.amount} onChange={(event) => setRefundModal((prev) => ({ ...prev, amount: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Refund amount" /></div>
            <div className="space-y-1 md:col-span-2"><label className="text-sm font-semibold text-gray-700">Transaction ID</label><input value={refundModal.transactionId} onChange={(event) => setRefundModal((prev) => ({ ...prev, transactionId: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Refund transaction/reference id" /></div>
            <div className="space-y-1 md:col-span-2"><label className="text-sm font-semibold text-gray-700">Remark</label><textarea rows={3} value={refundModal.remark} onChange={(event) => setRefundModal((prev) => ({ ...prev, remark: event.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Write refund note..." /></div>
          </div>
        </ModalShell>
      )}

      <ReturnDetailsModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
}
