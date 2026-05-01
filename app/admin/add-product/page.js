"use client";

import { useState } from "react";
import {
  Upload,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Package,
  Tag,
  // DollarSign,
  ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProductUploadPage() {
  const generateProductCode = () => {
    const prefix = "PRD";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const [categories, setCategories] = useState([
    { id: 1, category: "Spices & Masala" },
    { id: 2, category: "Oils & Ghee" },
    { id: 3, category: "Flours & Grains" },
    { id: 4, category: "Dairy Products" },
    { id: 5, category: "Dry Fruits & Nuts" },
  ]);
  const [brands, setBrands] = useState([
    { id: 1, brand: "Nityagro" },
    { id: 2, brand: "Himalayan Organics" },
    { id: 3, brand: "Nepal Herbs" },
  ]);
  const [activeTab, setActiveTab] = useState("basic");
  const [activeDescTab, setActiveDescTab] = useState("productDetails");
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    flags: true,
    variants: true,
    description: true,
    media: true,
    pricing: true,
    delivery: true,
  });

  const defaultVariant = { weight: "", unit: "gm", price: "", stock: "" };

  const [formData, setFormData] = useState({
    productCode: generateProductCode(),
    name: "",
    categoryId: "",
    categoryName: "",
    brandId: "",
    brandName: "",
    deliveryTargetDays: "",
    returnDays: "7",
    status: 1,
    weeklyProduct: false,
    flashSaleProduct: false,
    todayDeals: false,
    specialProduct: false,
    requiresSerial: true,
    warrantyAvailable: false,
    actualPrice: "",
    sellingPrice: "",
    availableQuantity: "",
    stockQuantity: "",
    productDescription: "",
    keySpecifications: "",
    nutritionalInformation: [{ name: "", value: "" }],
    cookingDescription: "",
    cookingRecommendedUses: "",
    storageInstructions: "",
    packaging: "",
    warranty: "",
    warrantyDays: "",
    variants: [{ ...defaultVariant }],
    productCatalog: null,
    mainImage: null,
    productImages: [],
  });

  // TODO: Replace dummy data with real API calls when /api/categories and /api/brands are ready

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = categories.find((c) => c.id.toString() === selectedId);
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedId,
      categoryName: selectedCat?.category || "",
    }));
  };

  const handleBrandChange = (e) => {
    const selectedId = e.target.value;
    const selectedBrand = brands.find((b) => b.id.toString() === selectedId);
    setFormData((prev) => ({
      ...prev,
      brandId: selectedId,
      brandName: selectedBrand?.brand || "",
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...defaultVariant }],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, productImages: files }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, mainImage: file }));
  };

  const handleCatalogChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, productCatalog: file }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = () => {
    setFormData({
      productCode: generateProductCode(),
      name: "",
      categoryId: "",
      categoryName: "",
      brandId: "",
      brandName: "",
      status: 1,
      deliveryTargetDays: "",
      returnDays: "7",
      weeklyProduct: false,
      flashSaleProduct: false,
      todayDeals: false,
      specialProduct: false,
      requiresSerial: true,
      warrantyAvailable: false,
      actualPrice: "",
      sellingPrice: "",
      availableQuantity: "",
      stockQuantity: "",
      productDescription: "",
      keySpecifications: "",
      nutritionalInformation: [{ name: "", value: "" }],
      cookingDescription: "",
      cookingRecommendedUses: "",
      storageInstructions: "",
      packaging: "",
      warranty: "",
      warrantyDays: "",
      variants: [{ ...defaultVariant }],
      mainImage: null,
      productCatalog: null,
      productImages: [],
    });
    setActiveDescTab("productDetails");
  };

  const handleSubmit = async () => {
    if (!formData.name) return toast.error("Product name is required!");
    if (!formData.mainImage) return toast.error("Main image is required!");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") {
        value.forEach((file) => data.append("productImages", file));
      } else if (key === "variants") {
        data.append("variants", JSON.stringify(value));
      } else if (key === "nutritionalInformation") {
        data.append("nutritionalInformation", JSON.stringify(value));
      } else if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch("/api/products", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok) {
        handleReset();
        toast.success("Product uploaded successfully!");
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    }
  };

  const SectionHeader = ({ title, icon: Icon, sectionKey, color = "blue" }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors rounded-t-xl"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${color}-600`} />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {expandedSections[sectionKey] ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white placeholder-gray-400";
  const labelClass =
    "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";
  const selectClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white";
  const textareaClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white placeholder-gray-400";
  const cardClass =
    "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              + Switch to Bulk Upload
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─────────── LEFT COLUMN ─────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Information */}
            <div className={cardClass}>
              <SectionHeader
                title="Basic Information"
                icon={Package}
                sectionKey="basic"
              />
              {expandedSections.basic && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelClass}>Product Code</label>
                      <input
                        type="text"
                        name="productCode"
                        value={formData.productCode}
                        readOnly
                        className={`${inputClass} bg-gray-50 cursor-not-allowed text-gray-500`}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Auto-generated
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Red Chilli Powder"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Category</label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleCategoryChange}
                        className={selectClass}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Brand</label>
                      <select
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleBrandChange}
                        className={selectClass}
                      >
                        <option value="">Select brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={selectClass}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Delivery Target Days</label>
                      <input
                        type="number"
                        name="deliveryTargetDays"
                        value={formData.deliveryTargetDays}
                        onChange={handleInputChange}
                        placeholder="e.g. 3"
                        min="0"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Flags */}
            <div className={cardClass}>
              <SectionHeader
                title="Product Tags & Flags"
                icon={Tag}
                sectionKey="flags"
                color="purple"
              />
              {expandedSections.flags && (
                <div className="px-5 pb-5 border-t border-gray-100 mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {[
                      { name: "weeklyProduct", label: "Weekly Product" },
                      { name: "flashSaleProduct", label: "Flash Sale" },
                      { name: "todayDeals", label: "Today's Deals" },
                      { name: "specialProduct", label: "Special Product" },
                      { name: "requiresSerial", label: "Serial for Warranty" },
                      {
                        name: "warrantyAvailable",
                        label: "Warranty Available",
                      },
                    ].map(({ name, label }) => (
                      <label
                        key={name}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          formData[name]
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={name}
                          checked={formData[name]}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Variants */}
            <div className={cardClass}>
              <SectionHeader
                title="Product Variants (Weight / Size Options)"
                icon={Info}
                sectionKey="variants"
                color="green"
              />
              {expandedSections.variants && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mt-3 mb-3">
                    Add weight/size variants with individual pricing (e.g.
                    100gm, 200gm, 500gm, 1kg).
                  </p>
                  <div className="space-y-3">
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-end p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <label className={labelClass}>Weight / Size</label>
                          <input
                            type="number"
                            value={variant.weight}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "weight",
                                e.target.value,
                              )
                            }
                            placeholder="100"
                            min="0"
                            className={inputClass}
                          />
                        </div>
                        <div className="w-28">
                          <label className={labelClass}>Unit</label>
                          <select
                            value={variant.unit}
                            onChange={(e) =>
                              handleVariantChange(index, "unit", e.target.value)
                            }
                            className={selectClass}
                          >
                            <option value="gm">gm</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="L">L</option>
                            <option value="pcs">pcs</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className={labelClass}>Price (NRP)</label>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                e.target.value,
                              )
                            }
                            placeholder="250"
                            min="0"
                            className={inputClass}
                          />
                        </div>
                        <div className="flex-1">
                          <label className={labelClass}>Stock Qty</label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value,
                              )
                            }
                            placeholder="50"
                            min="0"
                            className={inputClass}
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-3 flex items-center gap-2 px-4 py-2 border border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" /> Add Variant
                  </button>
                </div>
              )}
            </div>

            {/* Descriptions & Specs */}
            <div className={cardClass}>
              <SectionHeader
                title="Descriptions & Specifications"
                icon={FileText}
                sectionKey="description"
                color="orange"
              />
              {expandedSections.description && (
                <div className="border-t border-gray-100">
                  {/* ── Tab bar ── */}
                  {(() => {
                    const descTabs = [
                      { key: "productDetails", label: "Product Details" },
                      { key: "nutritional", label: "Nutritional Information" },
                      { key: "cooking", label: "Cooking Instructions / Usage" },
                      { key: "storage", label: "Storage Instructions" },
                    ];
                    return (
                      <>
                        <div className="flex border-b border-gray-200 px-5 gap-1">
                          {descTabs.map((t) => (
                            <button
                              key={t.key}
                              type="button"
                              onClick={() => setActiveDescTab(t.key)}
                              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeDescTab === t.key
                                  ? "border-green-700 text-green-700"
                                  : "border-transparent text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        <div className="p-5 space-y-4">
                          {/* ── Product Details tab ── */}
                          {activeDescTab === "productDetails" && (
                            <div className="space-y-4">
                              <div>
                                <label className={labelClass}>
                                  Product Description
                                </label>
                                <textarea
                                  name="productDescription"
                                  value={formData.productDescription}
                                  onChange={handleInputChange}
                                  rows={5}
                                  placeholder="Our products are crafted with a deep respect for tradition and purity..."
                                  className={textareaClass}
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                  Shown as paragraphs on the product page
                                </p>
                              </div>
                              <div>
                                <label className={labelClass}>
                                  Key Highlights / Specifications
                                </label>
                                {/* <p className="text-xs text-gray-400 mb-2">
                                  Enter each bullet point on a new line. Start
                                  with • or leave plain.
                                </p> */}
                                <textarea
                                  name="keySpecifications"
                                  value={formData.keySpecifications}
                                  onChange={handleInputChange}
                                  rows={6}
                                  placeholder={
                                    "Traditionally processed for maximum purity\nNo chemicals, preservatives, or artificial enhancers\nMaintains original taste, aroma, and texture\nEthically sourced and responsibly produced"
                                  }
                                  className={textareaClass}
                                />
                              </div>
                              <div>
                                <label className={labelClass}>
                                  Packaging Details
                                </label>
                                <textarea
                                  name="packaging"
                                  value={formData.packaging}
                                  onChange={handleInputChange}
                                  rows={3}
                                  placeholder="e.g. Sealed glass jar, eco-friendly packaging..."
                                  className={textareaClass}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className={labelClass}>
                                    Warranty Details
                                  </label>
                                  <textarea
                                    name="warranty"
                                    value={formData.warranty}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Describe warranty terms..."
                                    className={textareaClass}
                                  />
                                </div>
                                <div>
                                  <label className={labelClass}>
                                    Warranty Period (Days)
                                  </label>
                                  <input
                                    type="number"
                                    name="warrantyDays"
                                    min="0"
                                    value={formData.warrantyDays}
                                    onChange={handleInputChange}
                                    placeholder="365"
                                    className={inputClass}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── Nutritional Information tab ── */}
                          {activeDescTab === "nutritional" && (
                            <div>
                              <p className="text-xs text-gray-500 mb-3">
                                Add nutritional values per 100g serving (e.g.
                                Energy → 884 kcal, Total Fat → 100g).
                              </p>
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 px-4 py-2">
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Nutrient
                                  </span>
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Value
                                  </span>
                                </div>
                                {formData.nutritionalInformation.map(
                                  (row, idx) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-2 border-b border-gray-100 last:border-0 items-center"
                                    >
                                      <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => {
                                          const updated = [
                                            ...formData.nutritionalInformation,
                                          ];
                                          updated[idx] = {
                                            ...updated[idx],
                                            name: e.target.value,
                                          };
                                          setFormData((prev) => ({
                                            ...prev,
                                            nutritionalInformation: updated,
                                          }));
                                        }}
                                        placeholder="e.g. Energy"
                                        className="px-4 py-2.5 text-sm text-gray-900 border-r border-gray-100 outline-none focus:bg-blue-50"
                                      />
                                      <div className="flex items-center">
                                        <input
                                          type="text"
                                          value={row.value}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.nutritionalInformation,
                                            ];
                                            updated[idx] = {
                                              ...updated[idx],
                                              value: e.target.value,
                                            };
                                            setFormData((prev) => ({
                                              ...prev,
                                              nutritionalInformation: updated,
                                            }));
                                          }}
                                          placeholder="e.g. 884 kcal"
                                          className="flex-1 px-4 py-2.5 text-sm text-gray-900 outline-none focus:bg-blue-50"
                                        />
                                        {idx > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated =
                                                formData.nutritionalInformation.filter(
                                                  (_, i) => i !== idx,
                                                );
                                              setFormData((prev) => ({
                                                ...prev,
                                                nutritionalInformation: updated,
                                              }));
                                            }}
                                            className="px-3 text-gray-300 hover:text-red-500 transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    nutritionalInformation: [
                                      ...prev.nutritionalInformation,
                                      { name: "", value: "" },
                                    ],
                                  }))
                                }
                                className="mt-3 flex items-center gap-2 px-4 py-2 border border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors w-full justify-center"
                              >
                                <Plus className="w-4 h-4" /> Add Nutrient Row
                              </button>
                            </div>
                          )}

                          {/* ── Cooking Instructions tab ── */}
                          {activeDescTab === "cooking" && (
                            <div className="space-y-4">
                              <div>
                                <label className={labelClass}>
                                  Description
                                </label>
                                <p className="text-xs text-gray-400 mb-2">
                                  A short paragraph about how this product is
                                  used in cooking.
                                </p>
                                <textarea
                                  name="cookingDescription"
                                  value={formData.cookingDescription}
                                  onChange={handleInputChange}
                                  rows={4}
                                  placeholder="Yellow Mustard Oil has a distinctive pungent aroma and a high smoke point of around 480°F (250°C), making it ideal for high-heat cooking..."
                                  className={textareaClass}
                                />
                              </div>
                              <div>
                                <label className={labelClass}>
                                  Recommended Uses
                                </label>
                                <p className="text-xs text-gray-400 mb-2">
                                  Enter each recommended use on a new line.
                                  These appear as bullet points under
                                  "Recommended Uses:" on the product page.
                                </p>
                                <textarea
                                  name="cookingRecommendedUses"
                                  value={formData.cookingRecommendedUses}
                                  onChange={handleInputChange}
                                  rows={6}
                                  placeholder={
                                    "Deep frying pakoras, fish, and snacks\nTempering (tadka) for dals and curries\nMarinating meats and vegetables\nPickling the natural preservative properties are ideal\nMassage oil for traditional wellness practices"
                                  }
                                  className={textareaClass}
                                />
                              </div>
                            </div>
                          )}

                          {/* ── Storage Instructions tab ── */}
                          {activeDescTab === "storage" && (
                            <div className="space-y-3">
                              <div>
                                <label className={labelClass}>
                                  Storage Instructions
                                </label>
                                <p className="text-xs text-gray-400 mb-2">
                                  Enter each storage point on a new line. These
                                  appear as bullet points on the product page.
                                </p>
                                <textarea
                                  name="storageInstructions"
                                  value={formData.storageInstructions}
                                  onChange={handleInputChange}
                                  rows={7}
                                  placeholder={
                                    "Store in a cool, dry place away from direct sunlight\nKeep the bottle tightly sealed after each use\nDo not store near heat sources or open flames\nBest used within 12 months of manufacture date"
                                  }
                                  className={textareaClass}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* ─────────── RIGHT COLUMN ─────────── */}
          <div className="space-y-5">
            {/* Pricing & Inventory */}
            <div className={cardClass}>
              <SectionHeader
                title="Pricing & Inventory"
                icon={Tag}
                sectionKey="pricing"
                color="green"
              />
              {expandedSections.pricing && (
                <div className="px-5 pb-5 border-t border-gray-100 space-y-3 mt-4">
                  <div className="mt-2">
                    <label className={labelClass}>Actual Price (NRP)</label>
                    <input
                      type="number"
                      name="actualPrice"
                      value={formData.actualPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Selling Price (NRP)</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  {formData.actualPrice &&
                    formData.sellingPrice &&
                    Number(formData.sellingPrice) <
                      Number(formData.actualPrice) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700">
                        Discount:{" "}
                        {Math.round(
                          ((formData.actualPrice - formData.sellingPrice) /
                            formData.actualPrice) *
                            100,
                        )}
                        % off
                      </div>
                    )}
                  <div>
                    <label className={labelClass}>Available Quantity</label>
                    <input
                      type="number"
                      name="availableQuantity"
                      value={formData.availableQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total Stock Quantity</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className={cardClass}>
              <SectionHeader
                title="Delivery & Returns"
                icon={Package}
                sectionKey="delivery"
                color="blue"
              />
              {expandedSections.delivery && (
                <div className="px-5 pb-5 border-t border-gray-100 space-y-3 mt-4">
                  <div>
                    <label className={labelClass}>Delivery Target Days</label>
                    <input
                      type="number"
                      name="deliveryTargetDays"
                      value={formData.deliveryTargetDays}
                      onChange={handleInputChange}
                      placeholder="e.g. 3"
                      min="0"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Estimated days to deliver after order
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Free Return Window (Days)
                    </label>
                    <input
                      type="number"
                      name="returnDays"
                      value={formData.returnDays}
                      onChange={handleInputChange}
                      placeholder="7"
                      min="0"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Shown as "X Days Free Return" on product page
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className={cardClass}>
              <SectionHeader
                title="Images & Media"
                icon={ImageIcon}
                sectionKey="media"
                color="pink"
              />
              {expandedSections.media && (
                <div className="px-5 pb-5 border-t border-gray-100 space-y-4 mt-4">
                  {/* Main Image */}
                  <div>
                    <label className={labelClass}>
                      Main Image <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="mainImage"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="mainImage"
                      className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${
                        formData.mainImage
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {formData.mainImage ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700 font-medium text-center truncate max-w-full px-2">
                            {formData.mainImage.name}
                          </p>
                          <p className="text-xs text-green-500 mt-1">
                            Click to change
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-medium">
                            Upload Main Image
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className={labelClass}>Product Gallery</label>
                    <input
                      type="file"
                      id="productImages"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="productImages"
                      className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${
                        formData.productImages.length > 0
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {formData.productImages.length > 0 ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700 font-medium">
                            {formData.productImages.length} image
                            {formData.productImages.length > 1 ? "s" : ""}{" "}
                            selected
                          </p>
                          <p className="text-xs text-green-500 mt-1">
                            Click to change
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-medium">
                            Upload Gallery Images
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Select multiple images
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Product Catalog */}
                  <div>
                    <label className={labelClass}>
                      Product Catalog (PDF / Doc)
                    </label>
                    <input
                      type="file"
                      id="catalog"
                      onChange={handleCatalogChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label
                      htmlFor="catalog"
                      className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-colors ${
                        formData.productCatalog
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-600">
                        {formData.productCatalog?.name ||
                          "Upload Catalog (optional)"}
                      </p>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
