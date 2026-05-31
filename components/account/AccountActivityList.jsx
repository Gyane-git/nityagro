"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const CONFIG = {
  cancellations: {
    title: "Cancellation Requests",
    subtitle: "Orders you requested to cancel.",
    endpoint: "/api/account/cancellations",
    empty: "No cancellation requests found.",
    accent: "red",
  },
  returns: {
    title: "Return Requests",
    subtitle: "Products you requested to return.",
    endpoint: "/api/account/returns",
    empty: "No return requests found.",
    accent: "orange",
  },
  reviews: {
    title: "My Reviews",
    subtitle: "Ratings and reviews you submitted.",
    endpoint: "/api/account/reviews",
    empty: "No reviews found.",
    accent: "green",
  },
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function formatMoney(value) {
  return `NPR ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function getBadgeClass(type) {
  if (type === "cancellations") return "bg-red-50 text-red-600 border-red-100";
  if (type === "returns") return "bg-orange-50 text-orange-600 border-orange-100";
  return "bg-[#2e5e2e]/10 text-[#2e5e2e] border-[#2e5e2e]/15";
}

function Stars({ rating }) {
  const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));
  return (
    <div className="flex items-center gap-0.5 text-lg leading-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= safeRating ? "text-[#DB8F00]" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

function ActivityCard({ item, type }) {
  const isReview = type === "reviews";
  const imageSrc = item.image || "/no-image.png";

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-amber-100 bg-amber-50">
          <Image
            src={imageSrc}
            alt={item.productName || "Product"}
            fill
            className="object-contain p-1"
            unoptimized={imageSrc.startsWith("/uploads/") || imageSrc.startsWith("/categories/")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-gray-800">
                {item.productName || "Product"}
              </p>
              <p className="mt-0.5 text-[12px] text-gray-400">
                Code: {item.productCode || "-"}
                {item.orderNumber ? ` · Order #${item.orderNumber}` : ""}
              </p>
            </div>

            <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-bold ${getBadgeClass(type)}`}>
              {item.status || "Submitted"}
            </span>
          </div>

          {isReview ? (
            <div className="mt-3">
              <Stars rating={item.rating} />
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                {item.review || "No review text added."}
              </p>
            </div>
          ) : (
            <div className="mt-3 grid gap-2 text-[13px] text-gray-600 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-gray-800">Reason:</span>{" "}
                {item.reason || "-"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Total:</span>{" "}
                {formatMoney(item.totalAmount)}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Order Status:</span>{" "}
                {item.orderStatus || "-"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Payment:</span>{" "}
                {item.paymentStatus || "-"}
              </p>
              {item.adminReason ? (
                <p className="sm:col-span-2">
                  <span className="font-semibold text-gray-800">Admin Note:</span>{" "}
                  {item.adminReason}
                </p>
              ) : null}
            </div>
          )}

          <p className="mt-3 text-[12px] text-gray-400">
            Submitted on {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AccountActivityList({ type = "cancellations" }) {
  const config = CONFIG[type] || CONFIG.cancellations;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const token = window.localStorage.getItem("token");
        const response = await fetch(config.endpoint, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Failed to load data");
        }
        setItems(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        toast.error(error.message || "Failed to load data");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [config.endpoint]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [
        item.productName,
        item.productCode,
        item.orderNumber,
        item.reason,
        item.review,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, search]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2e5e2e]">{config.title}</h2>
          <p className="text-[13px] text-gray-400">{config.subtitle}</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          className="w-full rounded-md border border-gray-200 bg-[#fcfcfb] px-3 py-2 text-[13px] text-gray-600 outline-none transition-colors placeholder:text-gray-400 focus:border-[#DB8F00] sm:w-64"
        />
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="rounded-lg border border-gray-100 bg-white px-6 py-12 text-center text-[13px] text-gray-400">
            Loading {config.title.toLowerCase()}...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white px-6 py-12 text-center text-[13px] text-gray-400">
            {config.empty}
          </div>
        ) : (
          filtered.map((item) => (
            <ActivityCard key={item.id} item={item} type={type} />
          ))
        )}
      </div>
    </div>
  );
}
