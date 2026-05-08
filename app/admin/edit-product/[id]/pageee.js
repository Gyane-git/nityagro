"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Upload,
  Save,
  RotateCcw,
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Tag,
  ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";

export default function ProductEditPage() {
  const openConfirm = useConfirmModalStore((state) => state.open);
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  alert(productId)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState("");
  const [existingGallery, setExistingGallery] = useState([]);
  const [deletingImage, setDeletingImage] = useState("");

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
    productCode: "",
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

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  // Fetch categories and brands
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        if (catData.success) setCategories(catData.data.categories || []);
        if (brandData.success) setBrands(brandData.data.brands || []);
      } catch (err) {
        console.error("Failed to fetch meta", err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch product
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to load product");

        const product = data.data;
        const gallery = product.images?.[0]?.imagePath || [];

        setExistingMainImage(product.mainImage || "");
        setExistingGallery(Array.isArray(gallery) ? gallery : []);

        setFormData({
          productCode: product.productCode || "",
          name: product.name || "",
          categoryId: product.categoryId ? String(product.categoryId) : "",
          categoryName: product.categoryName || "",
          brandId: product.brandId ? String(product.brandId) : "",
          brandName: product.brandName || "",
          deliveryTargetDays:
            product.deliveryTargetDays != null
              ? String(product.deliveryTargetDays)
              : "",
          returnDays:
            product.returnDays != null ? String(product.returnDays) : "7",
          status: product.status ?? 1,
          weeklyProduct: !!product.weeklyProduct,
          flashSaleProduct: !!product.flashSaleProduct,
          todayDeals: !!product.todayDeals,
          specialProduct: !!product.specialProduct,
          requiresSerial:
            product.requiresSerial != null ? !!product.requiresSerial : true,
          warrantyAvailable: !!product.warrantyAvailable,
          actualPrice: product.actualPrice?.toString() || "",
          sellingPrice: product.sellPrice?.toString() || "",
          availableQuantity: product.availableQuantity?.toString() || "",
          stockQuantity: product.stockQuantity?.toString() || "",
          productDescription: product.description || "",
          keySpecifications: product.specifications || "",
          nutritionalInformation:
            product.nutritionalInformation?.length > 0
              ? product.nutritionalInformation
              : [{ name: "", value: "" }],
          cookingDescription: product.cookingDescription || "",
          cookingRecommendedUses: product.cookingRecommendedUses || "",
          storageInstructions: product.storageInstructions || "",
          packaging: product.packaging || "",
          warranty: product.warranty || "",
          warrantyDays:
            product.warrantyDays != null ? String(product.warrantyDays) : "",
          variants:
            product.variants?.length > 0
              ? product.variants
              : [{ ...defaultVariant }],
          productCatalog: null,
          mainImage: null,
          productImages: [],
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, mainImage: file }));
  };

  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, productImages: files }));
  };

  const handleCatalogChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, productCatalog: file }));
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleDeleteGalleryImage = async (imagePath) => {
    if (!productId) return;
    openConfirm({
      title: "Remove Gallery Image",
      message: "Are you sure you want to remove this image from the gallery?",
      onConfirm: async () => {
        try {
          setDeletingImage(imagePath);
          const res = await fetch("/api/products/images", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productCode: formData.productCode,
              imagePath,
              type: "gallery",
            }),
          });
          const result = await res.json();
          if (!res.ok)
            throw new Error(result.message || "Failed to delete image");
          setExistingGallery((prev) => prev.filter((img) => img !== imagePath));
          toast.success("Image removed");
        } catch (error) {
          console.error(error);
          toast.error(error.message || "Failed to remove image");
        } finally {
          setDeletingImage("");
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (!formData.name) return toast.error("Product name is required!");
    if (!productId) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") {
        value.forEach((file) => data.append("productImages", file));
      } else if (key === "variants") {
        data.append("variants", JSON.stringify(value));
      } else if (key === "nutritionalInformation") {
        data.append("nutritionalInformation", JSON.stringify(value));
      } else if (key === "mainImage" || key === "productCatalog") {
        if (value) data.append(key, value);
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      setSaving(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update product");
      toast.success("Product updated successfully!");
      router.push("/admin/product-list");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed!");
    } finally {
      setSaving(false);
    }
  };

  // ── Shared style tokens (identical to add-product) ──
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/product-list")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
              {formData.productCode && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formData.productCode}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
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
                        Auto-generated, read-only
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
                  {/* Tab bar */}
                  {(() => {
                    const descTabs = [
                      { key: "productDetails", label: "Product Details" },
                      { key: "nutritional", label: "Nutritional Information" },
                      { key: "cooking", label: "Cooking Instructions / Usage" },
                      { key: "storage", label: "Storage Instructions" },
                    ];
                    return (
                      <>
                        <div className="flex border-b border-gray-200 px-5 gap-1 overflow-x-auto">
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
                          {/* Product Details */}
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

                          {/* Nutritional Information */}
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

                          {/* Cooking Instructions */}
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

                          {/* Storage Instructions */}
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

            {/* Images & Media */}
            <div className={cardClass}>
              <SectionHeader
                title="Images & Media"
                icon={ImageIcon}
                sectionKey="media"
                color="pink"
              />
              {expandedSections.media && (
                <div className="px-5 pb-5 border-t border-gray-100 space-y-5 mt-4">
                  {/* ── Current Main Image ── */}
                  {existingMainImage && (
                    <div>
                      <label className={labelClass}>Current Main Image</label>
                      <div className="mt-1 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center aspect-square">
                        <img
                          src={resolveImageUrl(existingMainImage)}
                          alt="Current main"
                          className="w-full h-full object-contain p-3"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Replace Main Image ── */}
                  <div>
                    <label className={labelClass}>
                      {existingMainImage ? "Replace Main Image" : "Main Image"}{" "}
                      {!existingMainImage && (
                        <span className="text-red-500">*</span>
                      )}
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
                            {existingMainImage
                              ? "Upload New Main Image"
                              : "Upload Main Image"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* ── Existing Gallery ── */}
                  {existingGallery.length > 0 && (
                    <div>
                      <label className={labelClass}>
                        Current Gallery ({existingGallery.length} image
                        {existingGallery.length !== 1 ? "s" : ""})
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {existingGallery.map((img, index) => (
                          <div
                            key={`${img}-${index}`}
                            className="relative bg-gray-100 rounded-lg overflow-hidden group aspect-square"
                          >
                            <img
                              src={resolveImageUrl(img)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(img)}
                              disabled={deletingImage === img}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-gray-600 shadow hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                              title="Remove image"
                            >
                              {deletingImage === img ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Add Gallery Images ── */}
                  <div>
                    <label className={labelClass}>
                      {existingGallery.length > 0
                        ? "Add More Gallery Images"
                        : "Product Gallery"}
                    </label>
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

                  {/* ── Product Catalog ── */}
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
