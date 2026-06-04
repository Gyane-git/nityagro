"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function formatMoney(value) {
  return `NPR ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "processing") return "Processing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  if (s === "returns") return "Returns";
  return "Pending";
}

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-[#FFF3CD] text-[#B8860B]",
    Shipped: "bg-sky-100 text-sky-700",
    Delivered: "bg-[#2e5e2e] text-white",
    Cancelled: "bg-red-100 text-red-600",
    Returns: "bg-purple-100 text-purple-700",
    Pending: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center justify-center px-5 py-1.5 rounded-md text-[12.5px] font-semibold ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

function daysSince(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return Infinity;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function resolveImageUrl(imageUrl, fallback = "/no-image.png") {
  if (!imageUrl) return fallback;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function OrderActions({ order, onAction, onReview }) {
  const status = normalizeStatus(order.orderStatus);
  const deliveredDate = order.deliveredAt || order.updatedAt || order.createdAt;
  const returnWindowOpen = daysSince(deliveredDate) <= 7;
  const isCombo = order?.orderType === "combo";

  const baseButton =
    "w-full px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap";

  if (status === "Processing" || status === "Pending") {
    return (
      <button
        type="button"
        onClick={() => onAction("cancel", order)}
        className={`${baseButton} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
      >
        Cancel
      </button>
    );
  }

  if (status === "Shipped") {
    return (
      <button
        type="button"
        disabled
        className={`${baseButton} cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400`}
      >
        Cancel
      </button>
    );
  }

  if (status === "Delivered") {
    return (
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          disabled={!returnWindowOpen}
          onClick={() => onAction("return", order)}
          title={
            returnWindowOpen
              ? "Return is available within 7 days of delivery"
              : "Return window expired after 7 days"
          }
          className={`${baseButton} ${
            returnWindowOpen
              ? "border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
              : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
          }`}
        >
          Return
        </button>
        {!isCombo ? (
          <button
            type="button"
            onClick={() => onReview(order)}
            className={`${baseButton} border border-[#2e5e2e]/20 bg-[#2e5e2e]/10 text-[#2e5e2e] hover:bg-[#2e5e2e]/15`}
          >
            Review
          </button>
        ) : null}
      </div>
    );
  }

  if (status === "Cancelled") {
    return (
      <button
        type="button"
        disabled
        className={`${baseButton} cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400`}
      >
        Cancelled
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`${baseButton} cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400`}
    >
      No Action
    </button>
  );
}

function ReviewModal({
  order,
  rating,
  review,
  setRating,
  setReview,
  submitting,
  onClose,
  onSubmit,
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Write Product Review</h3>
          <p className="mt-1 text-xs text-gray-500">
            #{order.orderNumber} · {order.items?.[0]?.name || "Product"}
          </p>
        </div>

        <label className="text-sm font-semibold text-gray-700">Your Rating</label>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              disabled={submitting}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className={`text-3xl leading-none transition-transform hover:scale-110 disabled:opacity-60 ${
                star <= rating ? "text-[#DB8F00]" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Write Review
        </label>
        <textarea
          value={review}
          onChange={(event) => setReview(event.target.value)}
          rows={4}
          disabled={submitting}
          placeholder="Share your experience with this product..."
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#2e5e2e] disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-gray-400">Minimum 5 characters required.</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="rounded-md bg-[#2e5e2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#244b24] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionReasonModal({ action, order, reason, setReason, submitting, onClose, onSubmit }) {
  if (!action || !order) return null;

  const isCancel = action === "cancel";
  const title = isCancel ? "Cancel Order" : "Return Order";
  const label = isCancel ? "Cancellation Reason" : "Return Reason";
  const buttonText = isCancel ? "Submit Cancellation" : "Submit Return";
  const helper = isCancel
    ? "Please tell us why you want to cancel this order."
    : "Please tell us why you want to return this delivered order.";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">
            #{order.orderNumber} · {order.items?.[0]?.name || "Order"}
          </p>
        </div>

        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          placeholder={helper}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#2e5e2e]"
        />
        <p className="mt-1 text-xs text-gray-400">Minimum 5 characters required.</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              isCancel ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {submitting ? "Submitting..." : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onAction, onReview, onTrackOrder }) {
  const firstItem = order?.items?.[0];
  const qty = Number(firstItem?.qty || 1);
  const unitPrice = Number(firstItem?.unitPrice ?? order?.totalAmount ?? 0);
  const isCombo = order?.orderType === "combo";
  const imageSrc = resolveImageUrl(firstItem?.image);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-md bg-amber-50 border border-amber-100 shrink-0 flex items-center justify-center overflow-hidden relative">
        <img
          src={imageSrc}
          alt={firstItem?.name || "Product"}
          className="h-full w-full object-contain p-1"
          onError={(event) => {
            event.currentTarget.src = "/no-image.png";
          }}
        />
      </div>

      <div className="w-55 shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-[13.5px] font-semibold text-gray-800 leading-snug">{firstItem?.name || "N/A"}</p>
          {isCombo ? <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2e5e2e] text-[10px] font-bold border border-emerald-100">Combo</span> : null}
        </div>
        <p className="text-[12px] text-gray-400 mt-0.5">Code: {firstItem?.productCode || "-"}</p>
        <div className="flex items-center gap-1 mt-1.5 text-gray-400">
          <CalendarIcon />
          <span className="text-[12px]">{formatDate(order.createdAt)}</span>
        </div>
      </div>

      <div className="flex-1 text-[13px] text-gray-500">{formatMoney(unitPrice)}</div>

      <div className="text-[13px] text-gray-500 w-14">Qty: <span className="font-semibold text-gray-700">{qty}</span></div>

      <div className="text-[13.5px] font-semibold text-gray-800 w-28 text-right">{formatMoney(order.totalAmount)}</div>

      <div className="w-28 flex justify-center shrink-0">
        <StatusBadge status={normalizeStatus(order.orderStatus)} />
      </div>

      <div className="ml-1 w-30 shrink-0">
        <p className="mb-1 text-center text-[11px] font-semibold text-gray-400">
          #{order.orderNumber}
        </p>
        <button
          type="button"
          onClick={() => onTrackOrder?.(order.id)}
          className="mb-1.5 w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-1.5 text-[12px] font-semibold text-sky-700 transition-colors hover:bg-sky-100"
        >
          Order Tracking
        </button>
        <OrderActions order={order} onAction={onAction} onReview={onReview} />
      </div>
    </div>
  );
}

export default function OrderHistory({ userId = "1", onTrackOrder }) {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionModal, setActionModal] = useState({
    action: null,
    order: null,
    reason: "",
  });
  const [reviewModal, setReviewModal] = useState({
    order: null,
    rating: 5,
    review: "",
  });
  const [submittingAction, setSubmittingAction] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const [orderResponse, comboResponse] = await Promise.all([
        apiGetRequest(`/orders?userId=${userId}&status=all`, false),
        apiGetRequest("/combo-orders", true),
      ]);

      if (!orderResponse.success) {
        toast.error(orderResponse.message || "Failed to fetch order history");
        setLoading(false);
        return;
      }

      const normalOrders = Array.isArray(orderResponse.data) ? orderResponse.data : [];
      const comboOrders = comboResponse.success && Array.isArray(comboResponse.data)
        ? comboResponse.data.map((order) => ({
            id: `combo-${order.id}`,
            rawId: order.id,
            orderNumber: order.orderNumber,
            orderType: "combo",
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            totalAmount: Number(order.totalAmount || 0),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: [
              {
                id: `${order.id}-combo`,
                productCode: order.combo?.code || order.combo?.productCodes || "COMBO",
                name: order.combo?.name || "Combo Product",
                image: order.combo?.image || "/no-image.png",
                qty: Number(order.quantity || 1),
                unitPrice: Number(order.totalAmount || 0) / Math.max(1, Number(order.quantity || 1)),
                subtotal: Number(order.totalAmount || 0),
              },
            ],
          }))
        : [];

      setOrders(
        [...normalOrders, ...comboOrders].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        ),
      );
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) => {
      const item = order?.items?.[0];
      return (
        String(item?.name || "").toLowerCase().includes(q) ||
        String(order?.orderNumber || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const closeActionModal = () => {
    if (submittingAction) return;
    setActionModal({ action: null, order: null, reason: "" });
  };

  const openActionModal = (action, order) => {
    setActionModal({ action, order, reason: "" });
  };

  const closeReviewModal = () => {
    if (submittingReview) return;
    setReviewModal({ order: null, rating: 5, review: "" });
  };

  const openReviewModal = (order) => {
    setReviewModal({ order, rating: 5, review: "" });
  };

  const submitOrderAction = async () => {
    const { action, order, reason } = actionModal;
    const cleanReason = reason.trim();
    if (!action || !order) return;
    if (cleanReason.length < 5) {
      toast.error("Reason must be at least 5 characters");
      return;
    }
    const endpoint = order?.orderType === "combo"
      ? action === "cancel"
        ? "/api/account/combo-orders/cancel"
        : "/api/account/combo-orders/return"
      : action === "cancel"
        ? "/api/account/orders/cancel"
        : "/api/account/orders/return";
    const loadingToastId = toast.loading(
      action === "cancel" ? "Submitting cancellation..." : "Submitting return request...",
    );

    try {
      setSubmittingAction(true);
      const token = window.localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: order.rawId || order.id,
          reason: cleanReason,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || "Request failed", { id: loadingToastId });
        return;
      }

      const nextStatus = payload.data?.orderStatus || (action === "cancel" ? "cancelled" : "returns");
      setOrders((prev) =>
        prev.map((row) =>
          String(row.id) === String(order.id)
            ? { ...row, orderStatus: nextStatus, updatedAt: new Date().toISOString() }
            : row,
        ),
      );
      toast.success(payload.message || "Request submitted successfully", {
        id: loadingToastId,
      });
      setActionModal({ action: null, order: null, reason: "" });
    } catch (error) {
      console.error(error);
      toast.error("Request failed. Please try again.", { id: loadingToastId });
    } finally {
      setSubmittingAction(false);
    }
  };

  const submitReview = async () => {
    const { order, rating, review } = reviewModal;
    const cleanReview = review.trim();
    if (!order) return;
    if (order?.orderType === "combo") {
      toast.error("Combo product review needs combo review schema first.");
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating");
      return;
    }
    if (cleanReview.length < 5) {
      toast.error("Review must be at least 5 characters");
      return;
    }

    const loadingToastId = toast.loading("Saving review...");
    try {
      setSubmittingReview(true);
      const token = window.localStorage.getItem("token");
      const response = await fetch("/api/account/orders/review", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: order.rawId || order.id,
          productId: order.items?.[0]?.productId,
          rating,
          review: cleanReview,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || "Review save failed", { id: loadingToastId });
        return;
      }

      toast.success(payload.message || "Review saved successfully", {
        id: loadingToastId,
      });
      setReviewModal({ order: null, rating: 5, review: "" });
    } catch (error) {
      console.error(error);
      toast.error("Review save failed. Please try again.", { id: loadingToastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#2e5e2e] mb-0.5">Order History</h2>
      <p className="text-[13px] text-gray-400 mb-4">Currently active and recent purchases.</p>

      <div className="relative w-60 mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-[13px] text-gray-600 placeholder-gray-400 outline-none focus:border-[#DB8F00] bg-[#fcfcfb] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 px-6 py-12 text-center text-[13px] text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 px-6 py-12 text-center text-[13px] text-gray-400">No orders found.</div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={openActionModal}
              onReview={openReviewModal}
              onTrackOrder={onTrackOrder}
            />
          ))
        )}
      </div>

      <ActionReasonModal
        action={actionModal.action}
        order={actionModal.order}
        reason={actionModal.reason}
        setReason={(reason) => setActionModal((prev) => ({ ...prev, reason }))}
        submitting={submittingAction}
        onClose={closeActionModal}
        onSubmit={submitOrderAction}
      />

      <ReviewModal
        order={reviewModal.order}
        rating={reviewModal.rating}
        review={reviewModal.review}
        setRating={(rating) => setReviewModal((prev) => ({ ...prev, rating }))}
        setReview={(review) => setReviewModal((prev) => ({ ...prev, review }))}
        submitting={submittingReview}
        onClose={closeReviewModal}
        onSubmit={submitReview}
      />
    </div>
  );
}
