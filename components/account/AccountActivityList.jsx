"use client";

import { useEffect, useMemo, useState } from "react";
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

function resolveImageUrl(imageUrl, fallback = "/no-image.png") {
  if (!imageUrl) return fallback;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
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

function parseComboItems(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ActivityCard({ item, type }) {
  const isReview = type === "reviews";
  const isCombo = item.orderType === "combo";
  const imageSrc = resolveImageUrl(item.image);
  const includedItems = parseComboItems(item.comboItems);

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-amber-100 bg-amber-50">
          <img
            src={imageSrc}
            alt={item.productName || "Product"}
            className="h-full w-full object-contain p-1"
            onError={(event) => {
              event.currentTarget.src = "/no-image.png";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[14px] font-bold text-gray-800">
                  {item.productName || "Product"}
                </p>
                {isCombo ? (
                  <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#2e5e2e]">
                    Combo
                  </span>
                ) : null}
              </div>
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
              {includedItems.length ? (
                <p className="sm:col-span-2">
                  <span className="font-semibold text-gray-800">Included Items:</span>{" "}
                  {includedItems.map((comboItem) => comboItem.name || comboItem.pCode || comboItem.code).join(", ")}
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

function RequestTable({ title, items, type, emptyText }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-[14px] font-bold text-gray-800">{title}</h3>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getBadgeClass(type)}`}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-8 text-center text-[13px] text-gray-400">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-[12.5px]">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const includedItems = parseComboItems(item.comboItems);
                const imageSrc = resolveImageUrl(item.image);
                return (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-amber-100 bg-amber-50">
                          <img
                            src={imageSrc}
                            alt={item.productName || "Product"}
                            className="h-full w-full object-contain p-1"
                            onError={(event) => {
                              event.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-56 truncate font-bold text-gray-800">
                            {item.productName || "Product"}
                          </p>
                          <p className="text-[11.5px] text-gray-400">
                            Code: {item.productCode || "-"}
                          </p>
                          {includedItems.length ? (
                            <p className="mt-1 max-w-80 truncate text-[11.5px] text-gray-500">
                              Includes: {includedItems.map((comboItem) => comboItem.name || comboItem.pCode || comboItem.code).join(", ")}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      #{item.orderNumber || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="line-clamp-2">{item.reason || "-"}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {formatMoney(item.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${getBadgeClass(type)}`}>
                        {item.status || "Submitted"}
                      </span>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {item.orderStatus || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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

  const normalItems = useMemo(
    () => filtered.filter((item) => item.orderType !== "combo"),
    [filtered],
  );
  const comboItems = useMemo(
    () => filtered.filter((item) => item.orderType === "combo"),
    [filtered],
  );

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
        ) : type === "cancellations" || type === "returns" ? (
          <>
            <RequestTable
              title={type === "cancellations" ? "Product Cancellation List" : "Product Return List"}
              items={normalItems}
              type={type}
              emptyText={type === "cancellations" ? "No product cancellation requests found." : "No product return requests found."}
            />
            <RequestTable
              title={type === "cancellations" ? "Combo Cancellation List" : "Combo Return List"}
              items={comboItems}
              type={type}
              emptyText={type === "cancellations" ? "No combo cancellation requests found." : "No combo return requests found."}
            />
          </>
        ) : (
          filtered.map((item) => (
            <ActivityCard key={item.id} item={item} type={type} />
          ))
        )}
      </div>
    </div>
  );
}
