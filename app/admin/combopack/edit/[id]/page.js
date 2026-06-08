"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiGetRequest, apiUploadRequest } from "@/apihelper/apiHelper";

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

function readVariantMrpPrice(variant, fallback = 0) {
  const values = [
    variant?.productSellingPrice,
    variant?.salesRate,
    variant?.MRP,
    variant?.mrp,
    variant?.price,
    fallback,
  ];
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function splitCodes(value) {
  return String(value || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export default function EditComboPackPage() {
  const router = useRouter();
  const params = useParams();
  const comboId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [comboCode, setComboCode] = useState("");
  const [comboName, setComboName] = useState("");
  const [description, setDescription] = useState("");
  const [comboStatus, setComboStatus] = useState("active");
  const [comboImage, setComboImage] = useState(null);
  const [comboGallery, setComboGallery] = useState([]);
  const [mainPreview, setMainPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productGroups, setProductGroups] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!comboId) return;

    const loadPageData = async () => {
      setLoading(true);
      setLoadingProducts(true);
      try {
        const [comboResponse, productsResponse] = await Promise.all([
          apiGetRequest(`/combo-products?id=${comboId}`),
          apiGetRequest("/products"),
        ]);

        if (!comboResponse.success || !comboResponse.data) {
          throw new Error(comboResponse.message || "Combo pack not found");
        }
        if (!productsResponse.success) {
          throw new Error(productsResponse.message || "Failed to load products");
        }

        const combo = comboResponse.data;
        const savedCodes = new Set(splitCodes(combo.productCodes));
        const images = Array.isArray(combo.productImages) ? combo.productImages : [];
        const main = images.find((image) => image.isMain) || images[0] || null;
        const gallery = images.filter((image) => !image.isMain);

        setComboCode(combo.comboCode || "");
        setComboName(combo.comboName || "");
        setDescription(combo.comboDescription || "");
        setComboStatus(combo.comboStatus === false ? "inactive" : "active");
        setMainPreview(main?.imageUrl ? resolveImageUrl(main.imageUrl) : "");
        setGalleryPreviews(gallery.map((image) => resolveImageUrl(image.imageUrl)));

        const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
        const activeProducts = products.filter(
          (product) => product?.productStatus !== false && product?.subGroupName,
        );

        const groups = await Promise.all(
          activeProducts.map(async (product) => {
            const subGroupName = String(product.subGroupName || "").trim();
            const variantsResponse = await apiGetRequest(
              `/subcategories/${encodeURIComponent(subGroupName)}`,
            );
            const variants =
              variantsResponse.success && Array.isArray(variantsResponse.data)
                ? variantsResponse.data
                : [];

            return {
              productId: String(product.productId),
              productCode: String(product.productCode || ""),
              categoryId: String(product.categoryId || ""),
              subGroupName,
              image: product.pImage || "/no-image.png",
              variants: variants.map((variant) => ({
                id: `${subGroupName}-${variant.pCode}`,
                productId: String(product.productId),
                productCode: String(variant.pCode || product.productCode || ""),
                subGroupName,
                variationName: String(variant.variationName || ""),
                price: readVariantMrpPrice(variant, product.sellingPrice),
                stockQuantity: Number(variant.stockQuantity || 0),
                image: product.pImage || "/no-image.png",
              })),
            };
          }),
        );

        const cleanGroups = groups.filter((group) => group.variants.length > 0);
        const selected = cleanGroups
          .flatMap((group) => group.variants)
          .filter((variant) => savedCodes.has(String(variant.productCode)))
          .map((variant) => ({ ...variant, qty: 1, itemDiscount: 0 }));

        setProductGroups(cleanGroups);
        setSelectedProducts(selected);
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to load combo pack");
        router.push("/admin/combo-list");
      } finally {
        setLoading(false);
        setLoadingProducts(false);
      }
    };

    loadPageData();
  }, [comboId, router]);

  const toggleProduct = (variant) => {
    setSelectedProducts((prev) =>
      prev.some((product) => product.id === variant.id)
        ? prev.filter((product) => product.id !== variant.id)
        : [...prev, { ...variant, qty: 1, itemDiscount: 0 }],
    );
  };

  const updateQty = (id, delta) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, qty: Math.max(1, product.qty + delta) }
          : product,
      ),
    );
  };

  const updateItemDiscount = (id, value) => {
    setSelectedProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const maxDiscount = product.price * product.qty;
        return {
          ...product,
          itemDiscount: Math.min(Math.max(0, Number(value) || 0), maxDiscount),
        };
      }),
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const itemTotal = (product) =>
    Math.max(0, product.price * product.qty - Number(product.itemDiscount || 0));

  const totalPrice = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + itemTotal(product), 0),
    [selectedProducts],
  );

  const grossTotal = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price * product.qty, 0),
    [selectedProducts],
  );

  const totalItemDiscount = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + Number(product.itemDiscount || 0), 0),
    [selectedProducts],
  );

  const finalPrice = useMemo(
    () => Math.max(0, grossTotal - totalItemDiscount),
    [grossTotal, totalItemDiscount],
  );

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setComboImage(file);
    if (file) setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    setComboGallery(files);
    if (files.length > 0) {
      setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comboName.trim()) {
      toast.error("Combo name is required");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one variant product");
      return;
    }

    const toastId = toast.loading("Updating combo pack...");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("comboName", comboName.trim());
      formData.append("comboDescription", description.trim());
      formData.append("comboStatus", comboStatus === "active" ? "1" : "0");
      formData.append("productId", String(selectedProducts[0].productId));
      formData.append(
        "productCodes",
        selectedProducts.map((product) => product.productCode).join(","),
      );
      formData.append("productPrices", String(totalPrice));
      formData.append("discount", String(totalItemDiscount));
      formData.append("comboPrice", String(finalPrice));

      if (comboImage) {
        formData.append("mainImage", comboImage);
      }
      comboGallery.forEach((file) => formData.append("galleryImages", file));

      const response = await apiUploadRequest(
        `/combo-products?id=${comboId}`,
        formData,
        false,
        false,
        "PUT",
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update combo pack");
      }

      toast.success(response.message || "Combo pack updated successfully", { id: toastId });
      router.push("/admin/combo-list");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update combo pack", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400";

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 text-sm text-gray-500">Loading combo pack...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <button type="button" onClick={() => router.push("/admin/combo-list")} className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-emerald-700 mb-3">
            <ArrowLeft size={15} /> Back to combo list
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 rounded-full bg-emerald-500 block" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Combo Pack</span>
          </div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">Edit Combo Pack</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full">{comboCode || "C--------"}</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Combo Code</label>
            <input value={comboCode} readOnly className={`${inputClass} cursor-not-allowed text-gray-400 bg-gray-100`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Combo Name</label>
            <input value={comboName} onChange={(e) => setComboName(e.target.value)} placeholder="e.g. Nityagro Family Combo" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <select value={comboStatus} onChange={(e) => setComboStatus(e.target.value)} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Products</label>
          <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setOpen((value) => !value)} className={`w-full min-h-11 bg-gray-50 border rounded-xl px-4 py-2 text-sm flex items-center justify-between transition-all ${open ? "border-emerald-500 ring-2 ring-emerald-100 bg-white text-gray-800" : "border-gray-200 text-gray-400"}`}>
              {selectedProducts.length > 0 ? (
                <span className="flex items-center gap-2 text-gray-800 font-medium">
                  {selectedProducts.length} variant{selectedProducts.length > 1 ? "s" : ""} selected
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedProducts.length}</span>
                </span>
              ) : (
                <span>{loadingProducts ? "Loading products..." : "Choose product variants"}</span>
              )}
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-[480px] overflow-y-auto">
                {loadingProducts ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">Loading products...</div>
                ) : productGroups.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">No active subgroup variants found</div>
                ) : (
                  productGroups.map((group) => (
                    <div key={group.subGroupName} className="border-b border-gray-100 last:border-0">
                      <div className="sticky top-0 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">{group.subGroupName}</div>

                      {group.variants.map((variant) => {
                        const isSelected = selectedProducts.some((product) => product.id === variant.id);
                        const selected = selectedProducts.find((product) => product.id === variant.id);

                        return (
                          <div key={variant.id} className={`grid grid-cols-[2rem_2rem_1fr_5rem_7rem_7rem_7rem] items-center gap-3 px-4 py-2 border-b border-gray-50 transition-colors ${isSelected ? "bg-emerald-50/40" : "bg-white"}`}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleProduct(variant)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                            <img src={variant.image} alt={variant.variationName} onError={(e) => (e.currentTarget.src = "/no-image.png")} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-gray-700 truncate">{variant.variationName}</span>
                              <span className="text-[11px] text-gray-400 truncate">{variant.subGroupName}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 text-center">{money(variant.price)}</span>
                            <div className="flex items-center justify-center text-gray-800">
                              <div className={`flex items-center border rounded-lg overflow-hidden h-7 ${!isSelected ? "opacity-40 cursor-not-allowed" : ""}`}>
                                <button type="button" onClick={() => updateQty(variant.id, -1)} className="w-6 border-r text-center" disabled={!isSelected}>−</button>
                                <span className="w-8 text-center text-sm font-semibold">{selected?.qty || 1}</span>
                                <button type="button" onClick={() => updateQty(variant.id, 1)} className="w-6 border-l text-center" disabled={!isSelected}>+</button>
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <input type="number" min={0} disabled={!isSelected} value={selected?.itemDiscount || ""} onChange={(e) => updateItemDiscount(variant.id, e.target.value)} className={`w-20 h-7 border text-gray-800 rounded px-2 text-xs text-center ${!isSelected ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""}`} placeholder="Rs 0" />
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-bold ${isSelected ? "text-emerald-700" : "text-gray-300"}`}>{isSelected ? money(itemTotal(selected)) : money(variant.price)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Selected Products Preview
            {selectedProducts.length > 0 && <span className="ml-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedProducts.length}</span>}
          </label>

          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            <div className="min-w-[640px] md:min-w-full">
              <div className="grid grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] md:grid-cols-[2rem_1fr_6rem_7rem_6rem_2rem] gap-2 md:gap-3 px-2 sm:px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">#</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Quantity</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Discount (Rs)</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Total</span>
                <span />
              </div>

              {selectedProducts.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400 bg-white">No variants selected yet. Use the dropdown above to add products.</div>
              ) : (
                selectedProducts.map((product, index) => (
                  <div key={product.id} className={`grid grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] md:grid-cols-[2rem_1fr_6rem_7rem_6rem_2rem] gap-2 md:gap-3 px-2 sm:px-4 py-3 items-center transition-colors border-b border-gray-100 last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={product.image} alt={product.variationName} onError={(e) => (e.currentTarget.src = "/no-image.png")} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-700 truncate">{product.subGroupName}</span>
                        <span className="text-[11px] text-gray-400 truncate">{product.variationName}</span>
                        <span className="text-[11px] text-gray-400 hidden sm:block">{money(product.price)} / unit</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-50 px-2 sm:px-3 h-8 flex items-center">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{product.qty}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-full flex items-center justify-center bg-gray-50">
                        <span className="text-xs sm:text-sm text-gray-700">{product.itemDiscount ? money(product.itemDiscount) : "Rs 0"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">{money(itemTotal(product))}</span>
                    </div>
                    <button type="button" onClick={() => removeProduct(product.id)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 text-[10px] font-bold mx-auto">✕</button>
                  </div>
                ))
              )}

              {selectedProducts.length > 0 && (
                <div className="flex justify-end gap-6 px-2 sm:px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold">Items Total:</span>
                    <span className="text-sm font-bold text-gray-700">{money(totalPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's included in this combo..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400 resize-none leading-relaxed" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Summary</label>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                <span className="text-xs text-gray-500">Selected Product Total</span>
                <span className="text-sm font-semibold text-gray-800">{money(grossTotal)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                <span className="text-xs text-gray-500">Total Discount</span>
                <span className="text-sm font-semibold text-orange-500">-{money(totalItemDiscount)}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <span className="text-xs font-bold text-emerald-800">Final Price</span>
                <span className="text-base font-bold text-emerald-700">{money(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Image</label>
            <input type="file" id="comboImage" accept="image/*" onChange={handleMainImageChange} className="hidden" />
            <label htmlFor="comboImage" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${mainPreview ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
              {mainPreview ? (
                <>
                  <img
                    src={mainPreview}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-xl mb-2"
                    onError={(event) => {
                      event.currentTarget.src = "/no-image.png";
                    }}
                  />
                  <p className="text-xs text-emerald-600 font-medium">Click to change</p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">Upload Main Image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gallery Images</label>
            <input type="file" id="comboGallery" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
            <label htmlFor="comboGallery" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${galleryPreviews.length > 0 ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
              {galleryPreviews.length > 0 ? (
                <>
                  <div className="flex gap-2 flex-wrap justify-center mb-2">
                    {galleryPreviews.map((src, index) => (
                      <img
                        key={`${src}-${index}`}
                        src={src}
                        alt=""
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={(event) => {
                          event.currentTarget.src = "/no-image.png";
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">{galleryPreviews.length} image{galleryPreviews.length > 1 ? "s" : ""} selected</p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">Upload Gallery Images</p>
                  <p className="text-xs text-gray-400 mt-1">Select multiple images</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 gap-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 hidden sm:block">
            {selectedProducts.length === 0 ? "Select variants to get started" : <><span className="font-semibold text-gray-700">{selectedProducts.length}</span> variant{selectedProducts.length > 1 ? "s" : ""} · Final <span className="font-semibold text-gray-700">{money(finalPrice)}</span></>}
          </p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => router.push("/admin/combo-list")} disabled={saving} className="h-10 px-5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-60">Cancel</button>
            <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-200 transition-all hover:-translate-y-px active:translate-y-0 flex items-center gap-1.5 disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </div>
      </div>
    </form>
  );
}
