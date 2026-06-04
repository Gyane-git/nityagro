"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const ALLOWED_TRANSITIONS = {
  processing: ["processing", "shipped", "cancelled"],
  shipped: ["shipped", "delivered", "cancelled"],
  delivered: ["delivered", "returns"],
  cancelled: ["cancelled"],
  returns: ["returns"],
};

const PAGE_SIZE = 20;
const PAYMENT_MODE_OPTIONS = ["Cash on Delivery", "ConnectIPS", "QR Pay"];
const STATUS_TABS = [
  { key: "all", label: "all" },
  { key: "processing", label: "processing" },
  { key: "shipped", label: "shipped" },
  { key: "delivered", label: "delivered" },
  { key: "cancelled", label: "cancelled" },
  { key: "returns", label: "return" },
];

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
}

function formatDeliveryDate(order) {
  const placedAt = order?.createdAt ? new Date(order.createdAt) : null;
  const targetDays = Number(order?.items?.[0]?.product?.deliveryTargetDays || 0);

  if (!placedAt || Number.isNaN(placedAt.getTime()) || targetDays <= 0) {
    return "-";
  }

  const deliveryDate = new Date(placedAt);
  deliveryDate.setDate(deliveryDate.getDate() + targetDays);

  return deliveryDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getFirstProduct(order) {
  const item = order?.items?.[0];
  return item?.product?.name || item?.productCode || "N/A";
}

function getAllowedPaymentStatuses(currentStatus) {
  const normalized = String(currentStatus || "")
    .toLowerCase()
    .trim();
  if (normalized === "paid") return ["paid", "refunded"];
  if (normalized === "refunded") return ["refunded"];
  if (normalized === "partial") return ["partial", "paid", "refunded"];
  return ["unpaid", "paid"];
}

function getOrderPaymentMode(order) {
  if (order?.payments?.length) {
    const firstPayment = order.payments[0];
    if (firstPayment?.paymentMode) return String(firstPayment.paymentMode);
  }
  if (String(order?.paymentMethod || "").toLowerCase() === "connectips") {
    return "ConnectIPS";
  }
  return "";
}

function getOrderTransactionId(order) {
  if (order?.payments?.length) {
    const firstPayment = order.payments[0];
    if (firstPayment?.transactionId) return String(firstPayment.transactionId);
  }
  if (order?.transactionId) return String(order.transactionId);
  return "";
}

function StatusBadge({ value }) {
  const map = {
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-sky-100 text-sky-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    returns: "bg-purple-100 text-purple-700",
  };

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${map[value] || "bg-gray-100 text-gray-700"}`}>{value}</span>;
}

export default function Ordermanagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("processing");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    type: "", // shipped | cancelled
    orderId: null,
    nextStatus: "",
    serialNumber: "",
    serialNumbers: [],
    serialSelectionRequired: false,
    serialLoading: false,
    courierName: "",
    cnNumber: "",
    cnDate: "",
    cancelReason: "",
    remark: "",
  });
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    orderId: null,
    nextStatus: "paid",
    paymentMode: "COD",
    transactionId: "",
    remark: "",
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(id);
  }, [searchInput]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        status: statusFilter,
      });

      if (search) query.set("search", search);
      if (dateFrom) query.set("dateFrom", dateFrom);
      if (dateTo) query.set("dateTo", dateTo);

      const response = await fetch(`/api/admin/orders?${query.toString()}`);
      console.log(response);

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to fetch orders");
      }

      setOrders(payload?.data || []);
      setMeta(payload?.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      toast.error(error?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, page, search, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = useCallback(async (orderId, patch) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Update failed");
      }

      const updated = payload?.data;

      setOrders((prev) => prev.map((item) => (String(item.id) === String(orderId) ? { ...item, ...updated } : item)));

      setSelectedOrder((prev) => {
        if (!prev || String(prev.id) !== String(orderId)) return prev;
        return { ...prev, ...updated };
      });

      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const openStatusModal = async (order, nextStatus) => {
    const orderId = String(order?.id || "");
    setStatusModal({
      open: true,
      type: nextStatus,
      orderId,
      nextStatus,
      serialNumber: "",
      serialNumbers: [],
      serialSelectionRequired: false,
      serialLoading: nextStatus === "shipped",
      courierName: "",
      cnNumber: "",
      cnDate: "",
      cancelReason: "",
      remark: "",
    });

    if (nextStatus !== "shipped" || !orderId) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load serial numbers");
      }
      const detail = payload?.data || {};
      const serialNumbers = Array.isArray(detail.availableSerialNumbers) ? detail.availableSerialNumbers : [];
      const serialSelectionRequired = Boolean(detail.serialSelectionRequired);

      setStatusModal((prev) => ({
        ...prev,
        serialNumbers,
        serialSelectionRequired,
        serialLoading: false,
      }));
    } catch (error) {
      setStatusModal((prev) => ({ ...prev, serialLoading: false }));
      toast.error(error?.message || "Failed to load serial numbers");
    }
  };

  const closeStatusModal = () => {
    setStatusModal({
      open: false,
      type: "",
      orderId: null,
      nextStatus: "",
      serialNumber: "",
      serialNumbers: [],
      serialSelectionRequired: false,
      serialLoading: false,
      courierName: "",
      cnNumber: "",
      cnDate: "",
      cancelReason: "",
      remark: "",
    });
  };

  const submitStatusModal = async () => {
    if (!statusModal.orderId || !statusModal.nextStatus) return;
    if (statusModal.nextStatus === "shipped" && !statusModal.courierName.trim()) {
      toast.error("Courier name is required");
      return;
    }
    if (statusModal.nextStatus === "shipped" && statusModal.serialSelectionRequired && !statusModal.serialNumber) {
      toast.error("Please select serial number");
      return;
    }
    if (statusModal.nextStatus === "cancelled" && !statusModal.cancelReason.trim()) {
      toast.error("Cancel reason is required");
      return;
    }

    await updateOrder(statusModal.orderId, {
      orderStatus: statusModal.nextStatus,
      serialNumber: statusModal.nextStatus === "shipped" ? statusModal.serialNumber || undefined : undefined,
      courierName: statusModal.nextStatus === "shipped" ? statusModal.courierName.trim() : undefined,
      cnNumber: statusModal.nextStatus === "shipped" ? statusModal.cnNumber.trim() || undefined : undefined,
      cnDate: statusModal.nextStatus === "shipped" ? statusModal.cnDate || undefined : undefined,
      cancelReason: statusModal.nextStatus === "cancelled" ? statusModal.cancelReason.trim() : undefined,
      remark: statusModal.remark.trim() || undefined,
    });
    closeStatusModal();
  };

  const openPaymentModal = (order, nextStatus) => {
    const currentMode = getOrderPaymentMode(order);
    const currentTxn = getOrderTransactionId(order);
    const isConnectIPS = currentMode.toLowerCase() === "connectips";
    setPaymentModal({
      open: true,
      orderId: String(order.id),
      nextStatus,
      paymentMode: currentMode || "COD",
      transactionId: isConnectIPS ? currentTxn : "",
      remark: "",
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      open: false,
      orderId: null,
      nextStatus: "paid",
      paymentMode: "COD",
      transactionId: "",
      remark: "",
    });
  };

  const submitPaymentModal = async () => {
    if (!paymentModal.orderId) return;
    if (!paymentModal.paymentMode) {
      toast.error("Payment mode is required");
      return;
    }
    if (paymentModal.paymentMode !== "COD" && !paymentModal.transactionId.trim()) {
      toast.error("Transaction number is required");
      return;
    }

    await updateOrder(paymentModal.orderId, {
      paymentStatus: paymentModal.nextStatus,
      paymentMode: paymentModal.paymentMode,
      transactionId: paymentModal.transactionId.trim() || undefined,
      remark: paymentModal.remark.trim() || undefined,
    });
    closePaymentModal();
  };

  const openOrderDetails = async (order) => {
    try {
      setDetailLoading(true);
      const res = await fetch(`/api/admin/orders/${order.id}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to load order details");
      setSelectedOrder(payload?.data || order);
    } catch (error) {
      toast.error(error?.message || "Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  };

  const statusCounts = useMemo(() => {
    const serverCounts = meta?.statusCounts || {};
    return {
      all: Number(serverCounts.all || 0),
      processing: Number(serverCounts.processing || 0),
      shipped: Number(serverCounts.shipped || 0),
      delivered: Number(serverCounts.delivered || 0),
      cancelled: Number(serverCounts.cancelled || 0),
      returns: Number(serverCounts.returns || 0),
    };
  }, [meta]);

  const detailLogGroups = useMemo(() => {
    const logs = selectedOrder?.updateLogs || [];
    return {
      payment: logs.filter((log) => log.eventType === "payment_status"),
      shipped: logs.filter((log) => log.eventType === "order_status" && log.toOrderStatus === "shipped"),
      cancelled: logs.filter((log) => log.eventType === "order_status" && log.toOrderStatus === "cancelled"),
      returns: logs.filter((log) => log.eventType === "order_status" && log.toOrderStatus === "returns"),
    };
  }, [selectedOrder]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500">Secure admin order operations</p>
        </div>
        <div className="text-sm text-gray-800">Total Orders: {meta.total || 0}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {STATUS_TABS.map((tab) => {
          const key = tab.key;
          const value = statusCounts[key] || 0;
          const active = statusFilter === key;
          return (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setPage(1);
              }}
              className={`rounded-lg border px-3 py-2 text-left transition ${active ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}
            >
              <div className="text-xs uppercase font-semibold">{tab.label}</div>
              <div className="text-lg font-bold">{value}</div>
            </button>
          );
        })}
      </div>

      <div className="bg-white border rounded-xl p-3 md:p-4 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:items-center">
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by order no, customer, email, product" className="w-full rounded-lg border text-gray-700 border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 md:col-span-2" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            {STATUS_TABS.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setSearchInput("");
              setSearch("");
              setStatusFilter("processing");
              setPage(1);
            }}
            className="w-full bg-gray-600 rounded-lg border px-3 py-2 text-sm hover:bg-gray-800 text-white transition"
          >
            Reset Filters
          </button>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-100 text-black rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-100 text-black rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-auto text-gray-500">
            <table className="w-full min-w-250 text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Placed At</th>
                  <th className="px-4 py-3 whitespace-nowrap">Bill Status</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const id = String(order.id);
                  const transitionOptions = ALLOWED_TRANSITIONS[order.orderStatus] || [order.orderStatus];
                  const paymentOptions = getAllowedPaymentStatuses(order.paymentStatus);

                  return (
                    <tr key={id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-semibold">#{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">ID: {id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.user?.fullName || "N/A"}</div>
                        <div className="text-xs text-gray-500">{order.user?.email || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-55 truncate" title={getFirstProduct(order)}>
                          {getFirstProduct(order)}
                        </div>
                        <div className="text-xs text-gray-500">Items: {order.items?.length || 0}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatMoney(order.totalAmount)}</td>
                      <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3">Pending</td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          <StatusBadge value={order.orderStatus} />
                          <select
                            disabled={updatingId === id}
                            value={order.orderStatus}
                            onChange={(e) => {
                              const nextStatus = e.target.value;
                              if (nextStatus === order.orderStatus) return;
                              if (nextStatus === "shipped" || nextStatus === "cancelled") {
                                openStatusModal(order, nextStatus);
                                return;
                              }
                              updateOrder(id, { orderStatus: nextStatus });
                            }}
                            className="w-full rounded-md border px-2 py-1 text-xs"
                          >
                            {transitionOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          <StatusBadge value={order.paymentStatus} />
                          <select
                            disabled={updatingId === id}
                            value={order.paymentStatus}
                            onChange={(e) => {
                              const nextPaymentStatus = e.target.value;
                              if (nextPaymentStatus === order.paymentStatus) return;
                              if (nextPaymentStatus === "paid" || nextPaymentStatus === "refunded") {
                                openPaymentModal(order, nextPaymentStatus);
                                return;
                              }
                              updateOrder(id, {
                                paymentStatus: nextPaymentStatus,
                              });
                            }}
                            className="w-full rounded-md border px-2 py-1 text-xs"
                          >
                            {paymentOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openOrderDetails(order)} className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-gray-800">
        <button disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border px-3 py-2 text-sm disabled:opacity-40">
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {meta.page || page} / {meta.totalPages || 1}
        </div>
        <button disabled={page >= (meta.totalPages || 1) || loading} onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))} className="rounded-md border px-3 py-2 text-sm disabled:opacity-40">
          Next
        </button>
      </div>

      {selectedOrder && (
        <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 text-gray-700">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-white border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Order #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm ">
              <div>
                <div className="text-gray-500">Customer</div>
                <div className="font-medium">{selectedOrder.user?.fullName || "N/A"}</div>
                <div>{selectedOrder.user?.email || "-"}</div>
                <div>{selectedOrder.user?.phone || "+977-0000000000"}</div>
              </div>
              <div>
                <div className="text-gray-500">Financials</div>
                <div>Subtotal: {formatMoney(selectedOrder.subtotal)}</div>
                <div>Shipping: {formatMoney(selectedOrder.shippingCost)}</div>
                <div>Tax: {formatMoney(selectedOrder.tax)}</div>
                <div className="font-semibold">Total: {formatMoney(selectedOrder.totalAmount)}</div>
              </div>
              <div>
                <div className="text-gray-500">Delivery Details</div>
                {/* <div>Delivery Date: {formatDeliveryDate(selectedOrder)}</div> */}
                <div className="text-xs text-gray-500">
                  Target Days: {selectedOrder.items?.[0]?.product?.deliveryTargetDays || "-"}
                </div>
              </div>
            </div>

            {String(selectedOrder.paymentStatus || "").toLowerCase() === "paid" && getOrderPaymentMode(selectedOrder).toLowerCase() === "connectips" && (
              <div className="rounded-md border p-3 bg-gray-50 text-sm space-y-2">
                <div className="font-semibold text-gray-800">ConnectIPS Payment</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Payment Mode</label>
                    <input value={getOrderPaymentMode(selectedOrder)} readOnly className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Transaction ID</label>
                    <input value={getOrderTransactionId(selectedOrder)} readOnly className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm font-mono" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold mb-2">Items</div>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <div>
                      <div className="font-medium">{item.product?.name || item.productCode || "N/A"}</div>
                      <div className="text-xs text-gray-500">Qty: {Number(item.quantity || 0)}</div>
                    </div>
                    <div className="font-semibold">{formatMoney(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </div>

            {detailLogGroups.payment.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Payment Details</div>
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left">
                        {/* <th className="px-3 py-2">From</th> */}
                        {/* <th className="px-3 py-2">To</th> */}
                        <th className="px-3 py-2">Mode</th>
                        <th className="px-3 py-2">Txn No.</th>
                        <th className="px-3 py-2">Remark</th>
                        <th className="px-3 py-2 text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailLogGroups.payment.map((log) => (
                        <tr key={`p-${log.id}`} className="border-b last:border-0">
                          {/* <td className="px-3 py-2 capitalize">{log.fromPaymentStatus || "-"}</td> */}
                          {/* <td className="px-3 py-2 capitalize font-medium">{log.toPaymentStatus || "-"}</td> */}
                          <td className="px-3 py-2">{log.paymentMode || "-"}</td>
                          <td className="px-3 py-2 font-mono">{ log.transactionId || "-"}</td>
                          <td className="px-3 py-2">{log.remark || "-"}</td>
                          <td className="px-3 py-2 text-center">{formatDate(log.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {detailLogGroups.shipped.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Shipment Details</div>
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left">
                        {/* <th className="px-3 py-2">From</th> */}
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Courier</th>
                        <th className="px-3 py-2">CN Number</th>
                        <th className="px-3 py-2">CN Date</th>
                        <th className="px-3 py-2">Remark</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailLogGroups.shipped.map((log) => (
                        <tr key={`s-${log.id}`} className="border-b last:border-0">
                         
                          <td className="px-3 py-2 capitalize font-medium">{log.toOrderStatus || "-"}</td>
                          <td className="px-3 py-2">{log.courierName || "-"}</td>
                          <td className="px-3 py-2">{log.cnNumber || "-"}</td>
                          <td className="px-3 py-2">{log.cnDate ? String(log.cnDate).slice(0, 10) : "-"}</td>
                          <td className="px-3 py-2">{log.remark || "-"}</td>
                          <td className="px-3 py-2">{formatDate(log.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(detailLogGroups.cancelled.length > 0 || detailLogGroups.returns.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {detailLogGroups.cancelled.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">Cancelled Details</div>
                    <div className="overflow-auto rounded-md border">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b">
                          <tr className="text-left">
                            <th className="px-3 py-2">Reason</th>
                            <th className="px-3 py-2">Remark</th>
                            <th className="px-3 py-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailLogGroups.cancelled.map((log) => (
                            <tr key={`c-${log.id}`} className="border-b last:border-0">
                              <td className="px-3 py-2">{log.cancelReason || "-"}</td>
                              <td className="px-3 py-2">{log.remark || "-"}</td>
                              <td className="px-3 py-2">{formatDate(log.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {detailLogGroups.returns.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">Return Details</div>
                    <div className="overflow-auto rounded-md border">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b">
                          <tr className="text-left">
                            {/* <th className="px-3 py-2">From</th> */}
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Remark</th>
                            <th className="px-3 py-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailLogGroups.returns.map((log) => (
                            <tr key={`r-${log.id}`} className="border-b last:border-0">
                              {/* <td className="px-3 py-2 capitalize">{log.fromOrderStatus || "-"}</td> */}
                              <td className="px-3 py-2 capitalize font-medium">{log.toOrderStatus || "-"}</td>
                              <td className="px-3 py-2">{log.remark || "-"}</td>
                              <td className="px-3 py-2">{formatDate(log.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {statusModal.open && (
        <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white border p-5 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 capitalize">{statusModal.nextStatus} Order</h3>
              <button onClick={closeStatusModal} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            {statusModal.nextStatus === "shipped" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Courier Name</label>
                  <input
                    value={statusModal.courierName}
                    onChange={(e) =>
                      setStatusModal((prev) => ({
                        ...prev,
                        courierName: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                    placeholder="Enter Courier Name."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-700">CN Number (optional)</label>
                    <input
                      value={statusModal.cnNumber}
                      onChange={(e) =>
                        setStatusModal((prev) => ({
                          ...prev,
                          cnNumber: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                      placeholder="Consignment number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-700">CN Date (optional)</label>
                    <input
                      type="date"
                      value={statusModal.cnDate}
                      onChange={(e) =>
                        setStatusModal((prev) => ({
                          ...prev,
                          cnDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {statusModal.nextStatus === "cancelled" && (
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Cancelled Reason</label>
                <textarea
                  value={statusModal.cancelReason}
                  onChange={(e) =>
                    setStatusModal((prev) => ({
                      ...prev,
                      cancelReason: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                  placeholder="Enter cancellation reason"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm text-gray-700">Remark (optional)</label>
              <textarea
                value={statusModal.remark}
                onChange={(e) =>
                  setStatusModal((prev) => ({
                    ...prev,
                    remark: e.target.value,
                  }))
                }
                rows={2}
                className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                placeholder="Any internal note"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closeStatusModal} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={submitStatusModal} className="rounded-md bg-orange-500 text-white px-4 py-2 text-sm hover:bg-orange-600">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentModal.open && (
        <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white border p-5 space-y-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 capitalize">Mark Payment as {paymentModal.nextStatus}</h3>
              <button onClick={closePaymentModal} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-700">Payment Mode</label>
              <select
                value={paymentModal.paymentMode}
                onChange={(e) =>
                  setPaymentModal((prev) => ({
                    ...prev,
                    paymentMode: e.target.value,
                  }))
                }
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                {PAYMENT_MODE_OPTIONS.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-700">Transaction Number {paymentModal.paymentMode === "COD" ? "(optional)" : "*"}</label>
              <input
                value={paymentModal.transactionId}
                onChange={(e) =>
                  setPaymentModal((prev) => ({
                    ...prev,
                    transactionId: e.target.value,
                  }))
                }
                readOnly={paymentModal.paymentMode.toLowerCase() === "connectips" && paymentModal.nextStatus === "refunded" && Boolean(paymentModal.transactionId)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="TXN123456"
              />
              {paymentModal.paymentMode.toLowerCase() === "connectips" && paymentModal.nextStatus === "refunded" && Boolean(paymentModal.transactionId) && <p className="text-xs text-gray-500">ConnectIPS transaction ID is auto-filled and locked.</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-700">Remark (optional)</label>
              <textarea
                value={paymentModal.remark}
                onChange={(e) =>
                  setPaymentModal((prev) => ({
                    ...prev,
                    remark: e.target.value,
                  }))
                }
                rows={2}
                className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
                placeholder="Payment note"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closePaymentModal} disabled={Boolean(updatingId)} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={submitPaymentModal} disabled={Boolean(updatingId)} className="rounded-md bg-orange-500 text-white px-4 py-2 text-sm hover:bg-orange-600">
                {updatingId ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {updatingId && (
        <div className="fixed inset-0 z-80 bg-black/35 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl border px-6 py-5 flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <div className="text-sm font-medium text-gray-800">Updating order status...</div>
          </div>
        </div>
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-85 bg-black/35 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl border px-6 py-5 flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <div className="text-sm font-medium text-gray-800">Loading order details...</div>
          </div>
        </div>
      )}
    </div>
  );
}
