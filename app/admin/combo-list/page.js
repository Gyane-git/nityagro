"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiDeleteRequest, apiGetRequest } from "@/apihelper/apiHelper";

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function getMainImage(combo) {
  const images = Array.isArray(combo.productImages) ? combo.productImages : [];
  return images.find((image) => image.isMain)?.imageUrl || images[0]?.imageUrl || "";
}

function getProductCodeList(combo) {
  return String(combo.productCodes || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export default function ComboPackList() {
  const router = useRouter();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const response = await apiGetRequest("/combo-products");
      if (!response.success) {
        toast.error(response.message || "Failed to load combo packs");
        setCombos([]);
        return;
      }
      setCombos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load combo packs");
      setCombos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const handleDelete = async (comboProductId) => {
    const ok = window.confirm("Delete this combo pack? This action cannot be undone.");
    if (!ok) return;

    setDeletingId(comboProductId);
    const toastId = toast.loading("Deleting combo pack...");
    try {
      const response = await apiDeleteRequest(`/combo-products?id=${comboProductId}`, undefined, false);
      if (!response.success) {
        toast.error(response.message || "Failed to delete combo pack", { id: toastId });
        return;
      }
      toast.success(response.message || "Combo pack deleted successfully", { id: toastId });
      setCombos((prev) => prev.filter((combo) => String(combo.comboProductId) !== String(comboProductId)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete combo pack", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = useMemo(
    () => combos.filter((combo) => combo.comboStatus !== false).length,
    [combos],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 rounded-full bg-emerald-500 block" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Combo Pack</span>
          </div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">Combo Pack List</h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Showing <span className="text-gray-700 font-semibold">{combos.length}</span> combo pack{combos.length !== 1 ? "s" : ""} · <span className="text-emerald-700 font-semibold">{activeCount}</span> active
          </p>
        </div>

        <button onClick={() => router.push("/admin/combopack")} className="h-10 px-6 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-200 transition-all hover:-translate-y-px active:translate-y-0 flex items-center gap-1.5">
          + Create Combo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">#</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Image</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Combo Name</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Products</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Discount</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Final Price</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-sm text-gray-400">Loading combo packs...</td>
                </tr>
              ) : combos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-sm text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-10 h-10 text-gray-200" />
                      <span>No combo pack found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                combos.map((combo, index) => {
                  const id = String(combo.comboProductId);
                  const image = resolveImageUrl(getMainImage(combo));
                  const productCodes = getProductCodeList(combo);
                  const galleryCount = Array.isArray(combo.productImages)
                    ? combo.productImages.filter((item) => !item.isMain).length
                    : 0;

                  return (
                    <tr key={id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                      <td className="px-5 py-4 text-xs text-gray-400 font-medium">{index + 1}</td>
                      <td className="px-5 py-4">
                        {image ? (
                          <img
                            src={image}
                            alt={combo.comboName || "Combo"}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                            onError={(event) => {
                              event.currentTarget.src = "/no-image.png";
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        {galleryCount > 0 ? <div className="text-[10px] text-gray-400 mt-1">+{galleryCount} gallery</div> : null}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">{combo.comboCode}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">{combo.comboName}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-1 max-w-[240px]">{combo.comboDescription || "-"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full w-fit">
                            {productCodes.length} item{productCodes.length !== 1 ? "s" : ""}
                          </span>
                          <span className="text-[11px] text-gray-400 max-w-[180px] truncate" title={productCodes.join(", ")}>{productCodes.join(", ") || "-"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 font-medium">{money(combo.productPrices)}</td>
                      <td className="px-5 py-4 text-sm text-orange-500 font-medium">-{money(combo.discount)}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-emerald-700">{money(combo.comboPrice)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${combo.comboStatus !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${combo.comboStatus !== false ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {combo.comboStatus !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => router.push(`/admin/combopack/edit/${id}`)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-all" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button disabled={deletingId === id} onClick={() => handleDelete(id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center text-red-500 hover:text-red-600 transition-all disabled:opacity-60" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
