"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Save, RotateCcw, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";

export default function ProductEditPage() {
  const openConfirm = useConfirmModalStore((state) => state.open);
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState("");
  const [existingGallery, setExistingGallery] = useState([]);
  const [deletingImage, setDeletingImage] = useState("");

  const [formData, setFormData] = useState({
    productCode: "",
    name: "",
    categoryId: "",
    categoryName: "",
    brandName: "Yuemi",
    brandId: 1,
    deliveryTargetDays: "",
    status: 1,
    weeklyProduct: false,
    flashSaleProduct: false,
    todayDeals: false,
    specialProduct: false,
    requiresSerial: true,
    actualPrice: "",
    sellingPrice: "",
    availableQuantity: "",
    stockQuantity: "",
    productDescription: "",
    keySpecifications: "",
    packaging: "",
    warranty: "",
    warrantyDays: "365",
    productCatalog: null,
    mainImage: null,
    productImages: [],
  });

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load product");

        const product = data.data;
        const gallery = product.images?.[0]?.imagePath || [];

        setExistingMainImage(product.mainImage || "");
        setExistingGallery(Array.isArray(gallery) ? gallery : []);

        setFormData({
          productCode: product.productCode || "",
          name: product.name || "",
          categoryId: product.categoryId ? String(product.categoryId) : "",
          categoryName: product.categoryName || "",
          brandName: product.brandName || "Yuemi",
          brandId: product.brandId || 1,
          deliveryTargetDays:
            product.deliveryTargetDays !== null && product.deliveryTargetDays !== undefined
              ? String(product.deliveryTargetDays)
              : "",
          status: product.status ?? 1,
          weeklyProduct: !!product.weeklyProduct,
          flashSaleProduct: !!product.flashSaleProduct,
          todayDeals: !!product.todayDeals,
          specialProduct: !!product.specialProduct,
          requiresSerial:
            product.requiresSerial !== null && product.requiresSerial !== undefined
              ? !!product.requiresSerial
              : true,
          actualPrice: product.actualPrice?.toString() || "",
          sellingPrice: product.sellPrice?.toString() || "",
          availableQuantity: product.availableQuantity?.toString() || "",
          stockQuantity: product.stockQuantity?.toString() || "",
          productDescription: product.description || "",
          keySpecifications: product.specifications || "",
          packaging: product.packaging || "",
          warranty: product.warranty || "",
          warrantyDays:
            product.warrantyDays !== null && product.warrantyDays !== undefined
              ? String(product.warrantyDays)
              : "365",
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

  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      productImages: files,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      mainImage: file,
    }));
  };

  const handleCatalogChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      productCatalog: file,
    }));
  };

  const handleReset = () => {
    if (!productId) return;
    window.location.reload();
  };

  const handleSubmit = async () => {
    if (!productId) return;

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") {
        value.forEach((file) => data.append("productImages", file));
      } else if (key === "mainImage") {
        if (value) data.append("mainImage", value);
      } else if (key === "productCatalog") {
        if (value) data.append("productCatalog", value);
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
      if (!res.ok) throw new Error(result.message || "Failed to update product");

      toast.success("Product updated successfully!");
      router.push("/admin/product-list");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGalleryImage = async (imagePath) => {
    if (!productId) return;
    openConfirm({
      title: "Remove Gallery Image",
      message: "Are you sure you want to remove this image from gallery?",
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
          if (!res.ok) throw new Error(result.message || "Failed to delete image");

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

  const canSave = useMemo(() => formData.name && formData.productCode, [formData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/product-list")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Target Days
                  </label>
                  <input
                    type="number"
                    name="deliveryTargetDays"
                    value={formData.deliveryTargetDays}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="flex items-center text-gray-900 space-x-2">
                  <input
                    type="checkbox"
                    name="weeklyProduct"
                    checked={formData.weeklyProduct}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600  border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Weekly Product</span>
                </label>
                <label className="flex text-gray-900 items-center space-x-2">
                  <input
                    type="checkbox"
                    name="flashSaleProduct"
                    checked={formData.flashSaleProduct}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Flash Sale Product</span>
                </label>
                <label className="flex text-gray-900 items-center space-x-2">
                  <input
                    type="checkbox"
                    name="todayDeals"
                    checked={formData.todayDeals}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Today Deals</span>
                </label>
                <label className="flex text-gray-900 items-center space-x-2">
                  <input
                    type="checkbox"
                    name="specialProduct"
                    checked={formData.specialProduct}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Special Product</span>
                </label>
                <label className="flex text-gray-900 items-center space-x-2">
                  <input
                    type="checkbox"
                    name="requiresSerial"
                    checked={formData.requiresSerial}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Serial Required For Warranty</span>
                </label>
              </div>
            </div>

            <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <span>Product Description</span>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                rows={6}
                placeholder="Enter product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span>Product Specifications</span>
              <textarea
                name="keySpecifications"
                value={formData.keySpecifications}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter key specifications..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="mx-auto mb-4 w-16 h-16 opacity-30">Packaging Details</span>
              <textarea
                name="packaging"
                value={formData.packaging}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter packaging details..."
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span>Warranty</span>
              <textarea
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter warranty info..."
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span>Warranty Days</span>
              <input
                type="number"
                name="warrantyDays"
                min="0"
                value={formData.warrantyDays}
                onChange={handleInputChange}
                placeholder="365"
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Inventory</h2>
              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                placeholder="Actual Price"
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="Selling Price"
                className="w-full px-3 py-2  text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleInputChange}
                placeholder="Available Quantity"
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                placeholder="Stock Quantity"
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <div>
                <input
                  type="file"
                  id="catalog"
                  onChange={handleCatalogChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="catalog"
                  className="cursor-pointer flex flex-col items-center border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400 transition-colors"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-900" />
                  <p>{formData.productCatalog?.name || "Choose catalog"}</p>
                </label>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Current Main Image</p>
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={resolveImageUrl(existingMainImage)}
                    alt="Main"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id="mainImage"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer flex flex-col items-center border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400 transition-colors"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-900" />
                  <p>{formData.mainImage?.name || "Replace main image"}</p>
                </label>
              </div>

              {existingGallery.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Gallery</p>
                  <div className="grid grid-cols-3 gap-2">
                    {existingGallery.map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="relative bg-gray-100 rounded-lg overflow-hidden group"
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
                          className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 text-gray-700 shadow hover:bg-red-500 hover:text-white transition flex items-center justify-center text-sm opacity-0 group-hover:opacity-100"
                          aria-label="Remove image"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
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
                  className="cursor-pointer flex flex-col items-center border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400"
                >
                  <Upload className="h-12 w-12 text-gray-600" />
                  <p>
                    {formData.productImages.length > 0
                      ? `${formData.productImages.length} images selected`
                      : "Add more gallery images"}
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-600 rounded-md bg-gray-300 hover:bg-gray-600 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave || saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
