"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiGetRequest, apiUploadRequest } from "@/apihelper/apiHelper";

function generateComboCode() {
  return "C" + Math.floor(10000000 + Math.random() * 90000000);
}

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

export default function Page() {
  const [comboCode, setComboCode] = useState("");
  const [comboName, setComboName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [comboStatus, setComboStatus] = useState("active");
  const [comboImage, setComboImage] = useState(null);
  const [comboGallery, setComboGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productGroups, setProductGroups] = useState([]);
  // selectedProducts: { id, productId, productCode, subGroupName, variationName, price, stockQuantity, image, qty, itemDiscount }
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setComboCode(generateComboCode());
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchComboProducts = async () => {
      setLoadingProducts(true);
      try {
        const productsResponse = await apiGetRequest("/products");
        if (!productsResponse.success) {
          toast.error(productsResponse.message || "Failed to load products");
          return;
        }

        const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
        const activeProducts = products.filter((product) => product?.productStatus !== false && product?.subGroupName);

        const groups = await Promise.all(
          activeProducts.map(async (product) => {
            const subGroupName = String(product.subGroupName || "").trim();
            const variantsResponse = await apiGetRequest(`/subcategories/${encodeURIComponent(subGroupName)}`);
            const variants = variantsResponse.success && Array.isArray(variantsResponse.data) ? variantsResponse.data : [];

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

        setProductGroups(groups.filter((group) => group.variants.length > 0));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load combo products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchComboProducts();
  }, []);

  // Toggle selection — adds with qty=1, itemDiscount=0 or removes
  const toggleProduct = (variant) => {
    setSelectedProducts((prev) => (prev.some((p) => p.id === variant.id) ? prev.filter((p) => p.id !== variant.id) : [...prev, { ...variant, qty: 1, itemDiscount: 0 }]));
  };

  // Update qty for a selected product (inside dropdown or table)
  const updateQty = (id, delta) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)));
  };

  // Update item-level discount
  const updateItemDiscount = (id, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const maxDiscount = p.price * p.qty;
        return { ...p, itemDiscount: Math.min(Math.max(0, Number(value) || 0), maxDiscount) };
      }),
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Per-item line total after item discount
  const itemTotal = (p) => Math.max(0, p.price * p.qty - Number(p.itemDiscount || 0));

  // Sum of all line totals (already item-discounted)
  const totalPrice = useMemo(() => selectedProducts.reduce((sum, p) => sum + itemTotal(p), 0), [selectedProducts]);
  // const finalPrice = Math.max(0, totalPrice - Number(discount || 0));

  const grossTotal = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.qty, 0);
  }, [selectedProducts]);

  const totalItemDiscount = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + Number(p.itemDiscount || 0), 0);
  }, [selectedProducts]);

  const finalPrice = useMemo(() => {
    return Math.max(0, grossTotal - totalItemDiscount);
  }, [grossTotal, totalItemDiscount]);

  const handleCancel = () => {
    setComboName("");
    setDescription("");
    setDiscount(0);
    setComboStatus("active");
    setComboImage(null);
    setComboGallery([]);
    setSelectedProducts([]);
    setComboCode(generateComboCode());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comboName.trim()) {
      toast.error("Combo name is required");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one variant product");
      return;
    }

    const saveToastId = toast.loading("Creating combo pack...");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("comboCode", comboCode);
      formData.append("comboName", comboName.trim());
      formData.append("comboDescription", description.trim());
      formData.append("productId", String(selectedProducts[0].productId));
      formData.append(
        "productCodes",
        selectedProducts.map((product) => product.productCode).join(","),
      );
      formData.append("productPrices", String(totalPrice));
      formData.append("comboPrice", String(finalPrice));
      formData.append("discount", String(Number(discount || 0)));
      formData.append("comboStatus", comboStatus === "active" ? "1" : "0");

      if (comboImage) {
        formData.append("mainImage", comboImage);
      }

      comboGallery
        .filter(Boolean)
        .forEach((file) => formData.append("galleryImages", file));

      const response = await apiUploadRequest("/combo-products", formData);

      if (!response.success) {
        toast.error(response.message || "Failed to create combo pack", { id: saveToastId });
        return;
      }

      toast.success(response.message || "Combo pack created successfully", { id: saveToastId });
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create combo pack", { id: saveToastId });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 rounded-full bg-emerald-500 block" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Combo Pack</span>
          </div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">Create Combo Pack</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full">{comboCode || "C--------"}</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        {/* Row 1: Combo Code + Combo Name + Status */}
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

        {/* Row 2: Select Products Dropdown (full width) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Products</label>
          <div className="relative" ref={dropdownRef}>
            {/* Trigger button */}
            <button type="button" onClick={() => setOpen((o) => !o)} className={`w-full min-h-11 bg-gray-50 border rounded-xl px-4 py-2 text-sm flex items-center justify-between transition-all ${open ? "border-emerald-500 ring-2 ring-emerald-100 bg-white text-gray-800" : "border-gray-200 text-gray-400"}`}>
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

            {/* Dropdown panel */}
            {open && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-[480px] overflow-y-auto">
                {loadingProducts ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">Loading products...</div>
                ) : productGroups.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">No active subgroup variants found</div>
                ) : (
                  productGroups.map((group) => (
                    <div key={group.subGroupName} className="border-b border-gray-100 last:border-0">
                      {/* Group header */}
                      <div className="sticky top-0 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">{group.subGroupName}</div>

                      {group.variants.map((variant) => {
                        const isSelected = selectedProducts.some((p) => p.id === variant.id);
                        const selected = selectedProducts.find((p) => p.id === variant.id);

                        return (
                          <div key={variant.id} className={`grid grid-cols-[2rem_2rem_1fr_5rem_7rem_7rem_7rem] items-center gap-3 px-4 py-2 border-b border-gray-50 transition-colors ${isSelected ? "bg-emerald-50/40" : "bg-white"}`}>
                            {/* Checkbox */}
                            <input type="checkbox" checked={isSelected} onChange={() => toggleProduct(variant)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />

                            {/* Image */}
                            <img src={variant.image} alt={variant.variationName} onError={(e) => (e.currentTarget.src = "/no-image.png")} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />

                            {/* Name */}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-gray-700 truncate">{variant.variationName}</span>
                              <span className="text-[11px] text-gray-400 truncate">{variant.subGroupName}</span>
                            </div>

                            {/* Price */}
                            <span className="text-xs font-semibold text-gray-500 text-center">{money(variant.price)}</span>

                            {/* Qty */}
                            <div className="flex items-center justify-center text-gray-800">
                              <div className={`flex items-center border rounded-lg overflow-hidden h-7 ${!isSelected ? "opacity-40 cursor-not-allowed" : ""}`}>
                                <button type="button" onClick={() => updateQty(variant.id, -1)} className="w-6 border-r text-center" disabled={!isSelected}>
                                  −
                                </button>

                                <span className="w-8 text-center text-sm font-semibold">{selected?.qty || 1}</span>

                                <button type="button" onClick={() => updateQty(variant.id, 1)} className="w-6 border-l text-center" disabled={!isSelected}>
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Discount */}
                            <div className="flex justify-center">
                              <input type="number" min={0} disabled={!isSelected} value={selected?.itemDiscount || ""} onChange={(e) => updateItemDiscount(variant.id, e.target.value)} className={`w-20 h-7 border text-gray-800 rounded px-2 text-xs text-center ${!isSelected ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""}`} placeholder="Rs 0" />
                            </div>

                            {/* Total */}
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

        {/* Row 3: Selected Products Table (replaces chip preview) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Selected Products Preview
            {selectedProducts.length > 0 && <span className="ml-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedProducts.length}</span>}
          </label>

          {/* Responsive wrapper */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            <div className="min-w-[640px] md:min-w-full">
              {/* Table header */}
              <div className="grid grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] md:grid-cols-[2rem_1fr_6rem_7rem_6rem_2rem] gap-2 md:gap-3 px-2 sm:px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">#</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product</span>
                {/* <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Price</span> */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Quantity</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Discount (Rs)</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Total</span>
                <span />
              </div>

              {/* Rows */}
              {selectedProducts.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400 bg-white">No variants selected yet. Use the dropdown above to add products.</div>
              ) : (
                selectedProducts.map((p, index) => (
                  <div key={p.id} className={`grid grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] md:grid-cols-[2rem_1fr_6rem_7rem_6rem_2rem] gap-2 md:gap-3 px-2 sm:px-4 py-3 items-center transition-colors border-b border-gray-100 last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    {/* Row number */}
                    <span className="text-xs font-bold text-gray-400">{index + 1}</span>

                    {/* Product info */}
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.image}
                        alt={p.variationName}
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.png";
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-700 truncate">{p.subGroupName}</span>
                        <span className="text-[11px] text-gray-400 truncate">{p.variationName}</span>
                        <span className="text-[11px] text-gray-400 hidden sm:block">{money(p.price)} / unit</span>
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    {/* <div className="flex items-center justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white">
                        <button type="button" onClick={() => updateQty(p.id, -1)} className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm font-bold border-r border-gray-200">
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-700">{p.qty}</span>
                        <button type="button" onClick={() => updateQty(p.id, 1)} className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm font-bold border-l border-gray-200">
                          +
                        </button>
                      </div>
                    </div> */}
                     {/* <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">{money(p.price)}</span>
                    </div> */}


                    <div className="flex items-center justify-center">
                      <div className="bg-gray-50 px-2 sm:px-3 h-8 flex items-center">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{p.qty}</span>
                      </div>
                    </div>

                    {/* Item discount */}
                    {/* <div className="flex items-center justify-center">
                      <div className="relative w-full">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium">Rs.</span>
                        <input type="number" min={0} value={p.itemDiscount === 0 ? "" : p.itemDiscount} placeholder="0" onChange={(e) => updateItemDiscount(p.id, e.target.value)} className="h-8 w-full pl-8 pr-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 placeholder-gray-300 transition-all" />
                      </div>
                    </div> */}

                    <div className="flex items-center justify-center">
                      <div className="h-8 w-full flex items-center justify-center bg-gray-50">
                        <span className="text-xs sm:text-sm text-gray-700">{p.itemDiscount ? money(p.itemDiscount) : "Rs 0"}</span>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">{money(itemTotal(p))}</span>
                    </div>

                    {/* Remove */}
                    <button type="button" onClick={() => removeProduct(p.id)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 text-[10px] font-bold mx-auto">
                      ✕
                    </button>
                  </div>
                ))
              )}

              {/* Footer totals */}
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

        {/* Row 4: Description + Price + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's included in this combo..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400 resize-none leading-relaxed" />
          </div>

          {/* <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Combo Price</label>
              <input value={money(totalPrice)} readOnly className={`${inputClass} cursor-not-allowed text-gray-500 bg-gray-100`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Additional Discount (Rs)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">Rs.</span>
                <input type="number" min={0} max={totalPrice} value={discount === 0 ? "" : discount} placeholder="0" onChange={(e) => setDiscount(e.target.value === "" ? 0 : Number(e.target.value))} className={`${inputClass} pl-9`} />
              </div>
            </div>
          </div> */}

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

        {/* Row 5: Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Image</label>
            <input type="file" id="comboImage" accept="image/*" onChange={(e) => setComboImage(e.target.files[0] || null)} className="hidden" />
            <label htmlFor="comboImage" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${comboImage ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
              {comboImage ? (
                <>
                  <div className="relative inline-block mb-2">
                    <img src={URL.createObjectURL(comboImage)} alt="preview" className="w-20 h-20 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setComboImage(null);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>
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

          {/* Gallery Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gallery Images</label>
            <input type="file" id="comboGallery" accept="image/*" multiple onChange={(e) => setComboGallery((prev) => [...prev, ...Array.from(e.target.files)])} className="hidden" />
            <label htmlFor="comboGallery" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${comboGallery.length > 0 ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
              {comboGallery.length > 0 ? (
                <>
                  <div className="flex gap-2 flex-wrap justify-center mb-2">
                    {comboGallery.filter(Boolean).map((file, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(file)} alt="" className="w-14 h-14 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setComboGallery((prev) => prev.filter((_, idx) => idx !== i));
                          }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">
                    {comboGallery.length} image{comboGallery.length > 1 ? "s" : ""} selected
                  </p>
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 gap-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 hidden sm:block">
            {selectedProducts.length === 0 ? (
              "Select variants to get started"
            ) : (
              <>
                <span className="font-semibold text-gray-700">{selectedProducts.length}</span> variant
                {selectedProducts.length > 1 ? "s" : ""} · Final <span className="font-semibold text-gray-700">{money(finalPrice)}</span>
              </>
            )}
          </p>

          <div className="flex gap-2.5">
            <button type="button" onClick={handleCancel} disabled={saving} className="h-10 px-5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-60">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-200 transition-all hover:-translate-y-px active:translate-y-0 flex items-center gap-1.5 disabled:opacity-60">
              {saving ? "Creating..." : "Create Combo"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
