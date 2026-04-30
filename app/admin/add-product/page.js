"use client";

import { useState, useEffect } from "react";
import { Upload, Save, RotateCcw } from "lucide-react";
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

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    productCode: generateProductCode(),
    name: "",
    categoryId: "",
    categoryName: "",
    brandId: "",
    brandName: "",
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        console.log(data);
        if (data.success) setCategories(data.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        console.log(data);
        if (data.success) setBrands(data.data.brands);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

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

  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files);
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
    setFormData({
      productCode: generateProductCode(),
      name: "",
      categoryId: "",
      categoryName: "",
      brandId: "",
      brandName: "",
      status: "1",
      deliveryTargetDays: "",
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
      mainImage: null,
      productCatalog: null,
      productImages: [],
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") {
        value.forEach((file) => data.append("productImages", file));
      } else if (value !== null) {
        data.append(key, value);
      }
    });
    console.log(formData);

    try {
      const res = await fetch("/api/products", { method: "POST", body: data });
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        handleReset();
        toast.success("Product uploaded successfully!");
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      // handleReset()
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Switch to Bulk Upload</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 cursor-not-allowed"
                  />
                  <span className="text-xs text-gray-500">Auto-generated</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select name="brandId" value={formData.brandId} onChange={handleBrandChange} className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md">
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Target Days</label>
                  <input
                    type="number"
                    name="deliveryTargetDays"
                    value={formData.deliveryTargetDays}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size and Weight <span className="text-red-500">*</span>
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    name="familySize"
                    value={formData.familySize}
                    onChange={handleInputChange}
                    placeholder="Enter product size and weight"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">Family pack 500g</span>

                  </label>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    name="mediumSize"
                    value={formData.mediumSize}
                    onChange={handleInputChange}
                    placeholder="Enter product size and weight"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">Medium pack 100g</span>

                  </label>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    name="smallSize"
                    value={formData.smallSize}
                    onChange={handleInputChange}
                    placeholder="Enter product size and weight"
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">Small pack 50g</span>

                  </label>
                </div> */}
              </div>

              {/* Product Flags */}
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
                  <input type="checkbox" name="todayDeals" checked={formData.todayDeals} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
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

            {/* Product Description & Specs */}
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
              <span className="mx-auto mb-4 w-16 h-16 opacity-30"> Packaging Details</span>
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

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Inventory</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="number"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleInputChange}
                  placeholder="Actual Price"
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </label>
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
              {/* <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Product Image & Gallery
              </h2>

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
                  <p>
                    {formData.productCatalog?.name ||
                      "Choose file "}
                  </p>
                </label>
              </div> */}
              <div>
                <input required type="file" id="mainImage" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                <label htmlFor="mainImage" className="cursor-pointer flex flex-col items-center border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-900" />
                  <p>{formData.mainImage?.name || "Choose MainImage Required !"}</p>
                </label>
              </div>

              <div>
                <input type="file" id="productImages" multiple accept="image/*" onChange={handleMultipleImageChange} className="hidden" />

                <label htmlFor="productImages" className="cursor-pointer flex flex-col items-center border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400">
                  <Upload className="h-12 w-12 text-gray-600" />
                  <p>{formData.productImages.length > 0 ? `${formData.productImages.length} images selected` : "Choose images "}</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-end gap-3">
          <button onClick={handleReset} className="px-6 py-2.5 border border-gray-600 rounded-md bg-gray-300 hover:bg-gray-600 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
