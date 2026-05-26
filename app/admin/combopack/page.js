"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiGetRequest, apiPostRequest } from "@/apihelper/apiHelper";

function generateComboCode() {
  return "C" + Math.floor(10000000 + Math.random() * 90000000);
}

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

export default function Page() {
  const [comboCode, setComboCode] = useState("");
  const [comboName, setComboName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productGroups, setProductGroups] = useState([]);
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

        const products = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];
        const activeProducts = products.filter(
          (product) => product?.productStatus !== false && product?.subGroupName,
        );

        const groups = await Promise.all(
          activeProducts.map(async (product) => {
            const subGroupName = String(product.subGroupName || "").trim();
            const variantsResponse = await apiGetRequest(
              `/subcategories/${encodeURIComponent(subGroupName)}`,
            );
            const variants = variantsResponse.success && Array.isArray(variantsResponse.data)
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
                price: Number(variant.salesRate || 0),
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

  const toggleProduct = (variant) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === variant.id)
        ? prev.filter((p) => p.id !== variant.id)
        : [...prev, variant],
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const totalPrice = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + Number(product.price || 0), 0),
    [selectedProducts],
  );
  const finalPrice = Math.max(0, totalPrice - Number(discount || 0));

  const handleCancel = () => {
    setComboName("");
    setDescription("");
    setDiscount(0);
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
      const response = await apiPostRequest("/combo-products", {
        comboCode,
        comboName,
        comboDescription: description,
        productId: selectedProducts[0].productId,
        productCodes: selectedProducts.map((product) => product.productCode),
        productPrices: totalPrice,
        comboPrice: finalPrice,
        discount: Number(discount || 0),
        comboStatus: true,
      });

      if (!response.success) {
        toast.error(response.message || "Failed to create combo pack", {
          id: saveToastId,
        });
        return;
      }

      toast.success(response.message || "Combo pack created successfully", {
        id: saveToastId,
      });
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create combo pack", { id: saveToastId });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="combo-page min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 rounded-full bg-emerald-500 block" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-gray-400">
              Combo Pack
            </span>
          </div>
          <h1 className="combo-title text-[26px] font-bold text-gray-900 tracking-tight leading-none">
            Create Combo Pack
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full">
          {comboCode || "C--------"}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Combo Code
            </label>
            <input
              value={comboCode}
              readOnly
              className={`${inputClass} cursor-not-allowed text-gray-400 bg-gray-100`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Combo Name
            </label>
            <input
              value={comboName}
              onChange={(e) => setComboName(e.target.value)}
              placeholder="e.g. Nityagro Family Combo"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Select Products
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full min-h-11 bg-gray-50 border rounded-xl px-4 py-2 text-sm flex items-center justify-between transition-all ${
                  open
                    ? "border-emerald-500 ring-2 ring-emerald-100 bg-white text-gray-800"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {selectedProducts.length > 0 ? (
                  <span className="flex items-center gap-2 text-gray-800 font-medium">
                    {selectedProducts.length} variant
                    {selectedProducts.length > 1 ? "s" : ""} selected
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedProducts.length}
                    </span>
                  </span>
                ) : (
                  <span>{loadingProducts ? "Loading products..." : "Choose product variants"}</span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <div className="slide-down absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
                  {loadingProducts ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      Loading subgroup products...
                    </div>
                  ) : productGroups.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      No active subgroup variants found
                    </div>
                  ) : (
                    productGroups.map((group) => (
                      <div key={group.subGroupName} className="border-b border-gray-100 last:border-0">
                        <div className="sticky top-0 bg-emerald-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">
                          {group.subGroupName}
                        </div>
                        {group.variants.map((variant) => {
                          const checked = selectedProducts.some((p) => p.id === variant.id);
                          return (
                            <label
                              key={variant.id}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleProduct(variant)}
                                className="w-4 h-4 accent-emerald-500 flex-shrink-0"
                              />
                              <img
                                src={variant.image}
                                alt={variant.variationName}
                                onError={(e) => {
                                  e.currentTarget.src = "/no-image.png";
                                }}
                                className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                              />
                              <span className="flex-1 text-sm text-gray-700 font-medium">
                                {variant.variationName}
                              </span>
                              <span className="text-xs font-semibold text-gray-500">
                                {money(variant.price)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Preview
            </label>
            <div className="min-h-11 border border-dashed border-gray-200 rounded-xl bg-gray-50 px-3 py-2 flex flex-wrap gap-2 items-center">
              {selectedProducts.length === 0 ? (
                <span className="text-sm text-gray-400 w-full text-center py-0.5">
                  No variants selected
                </span>
              ) : (
                selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="chip-in flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-1 pr-2.5 py-1 shadow-sm"
                  >
                    <img
                      src={p.image}
                      alt={p.variationName}
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                      className="w-7 h-7 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold text-gray-800">
                        {p.subGroupName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {p.variationName} · {money(p.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(p.id)}
                      className="w-4 h-4 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 text-[10px] font-bold transition-colors flex-shrink-0"
                      aria-label={`Remove ${p.variationName}`}
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's included in this combo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder-gray-400 resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Combo Price
              </label>
              <input
                value={money(totalPrice)}
                readOnly
                className={`${inputClass} cursor-not-allowed text-gray-500 bg-gray-100`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Discount (Rs)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
                  Rs.
                </span>
                <input
                  type="number"
                  min={0}
                  max={totalPrice}
                  value={discount === 0 ? "" : discount}
                  placeholder="0"
                  onChange={(e) =>
                    setDiscount(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price Summary
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                <span className="text-xs text-gray-500">Selected Variant Total</span>
                <span className="text-sm font-semibold text-gray-800">{money(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                <span className="text-xs text-gray-500">Discount</span>
                <span className="text-sm font-semibold text-orange-500">
                  -{money(discount)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <span className="text-xs font-bold text-emerald-800">Final Price</span>
                <span className="text-base font-bold text-emerald-700">
                  {money(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 gap-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 hidden sm:block">
            {selectedProducts.length === 0 ? (
              "Select variants to get started"
            ) : (
              <>
                <span className="font-semibold text-gray-700">
                  {selectedProducts.length}
                </span>{" "}
                variant{selectedProducts.length > 1 ? "s" : ""} · Final{" "}
                <span className="font-semibold text-gray-700">{money(finalPrice)}</span>
              </>
            )}
          </p>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-10 px-6 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-200 transition-all hover:-translate-y-px active:translate-y-0 flex items-center gap-1.5 disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Combo"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
