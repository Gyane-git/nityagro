"use client";

import { apiPostRequest } from "@/apihelper/apiHelper";
import { apiUploadRequest } from "@/apihelper/apiHelper";
import { WifiSync } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type FormData = {
  categoryName: string;
  slug: string | null;
  categoryDescription: string | null;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};
type Product = {
  PCode: string;
  PDesc: string;
  GroupName: string;
  slug: string | null;
  categoryDescription: string | null;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};
export default function AddCategoryPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProduct] = useState<Product[]>([
    {
      PCode: "",
      PDesc: "",
      GroupName: "",
      slug: null,
      categoryDescription: null,
      categoryImage: null,
      categoryLogo: null,
      categoryBanner: null,
      userId: "1",
    },
  ]);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryLogoFile, setCategoryLogoFile] = useState<File | null>(null);
  const [categoryBannerFile, setCategoryBannerFile] = useState<File | null>(
    null,
  );
  const [categoryImagePreviewUrl, setCategoryImagePreviewUrl] = useState<
    string | null
  >(null);
  const [categoryLogoPreviewUrl, setCategoryLogoPreviewUrl] = useState<
    string | null
  >(null);
  const [categoryBannerPreviewUrl, setCategoryBannerPreviewUrl] = useState<
    string | null
  >(null);
  const categoryImagePreviewRef = useRef<string | null>(null);
  const categoryLogoPreviewRef = useRef<string | null>(null);
  const categoryBannerPreviewRef = useRef<string | null>(null);

  const initialFormData: FormData = {
    categoryName: "",
    slug: null,
    categoryDescription: null,
    categoryImage: null,
    categoryLogo: null,
    categoryBanner: null,
    userId: "1",
  };

  const [formdata, setFormData] = useState(initialFormData);

  async function getProducts(): Promise<Product[]> {
    const res = await fetch(
      "http://bkgroupapi.globaltech.com.np:802/api/MasterList/ProductListCustomer?DbName=NITYAM8201",
      {
        cache: "no-store", // ensures fresh data
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const json = await res.json();
    setProduct(json.data);

    return json.data;
  }

  useEffect(() => {
    getProducts();
  }, []);

  const categories = Object.values(
    products.reduce((acc, item) => {
      if (!acc[item.GroupName]) {
        acc[item.GroupName] = {
          categoryName: item.GroupName,
          slug: null,
          categoryDescription: null,
          categoryImage: null,
          categoryLogo: null,
          categoryBanner: null,
          userId: "1",
        };
      }

      acc[item.GroupName]; // ✅ full product object
      return acc;
    }, {} as Record<string, any>),
  );

  const product = Object.values(
    products.reduce((acc, item) => {
      if (!acc[item.PDesc]) {
        acc[item.PDesc] = {
          productCode: item.PCode,
          categoryId: item.GroupName,
          userId: "1",
          productName: item.PDesc,
          slug: null,
          productVariation: null,
          productDescription: null,
          nutritionInfo: null,
          cookingInstruction: null,
          storageInstruction: null,
          pImage: null,
          productStatus: true,
          actualPrice: 0.0,
          sellingPrice: 0.0,
          deliveryTargetDays: null,
          stockQuantity: null,
          availableQuantity: null,
        };
      }

      acc[item.PDesc]; // ✅ full product object
      return acc;
    }, {} as Record<string, any>),
  );

  const requestData = {
    categories,
  };

  const requestDataProduct = {
    product,
  };

  const pDescList = products.map((item) => item.PDesc);
  const groupNameList = products.map((item) => item.GroupName);
  // const requestData = {
  //   categories: groupNameList,
  // };

  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(JSON.stringify(requestDataProduct));
    try {
      const uploadFormData = new FormData();
      if (categoryImageFile)
        uploadFormData.append("categoryImage", categoryImageFile);
      if (categoryLogoFile)
        uploadFormData.append("categoryLogo", categoryLogoFile);
      if (categoryBannerFile)
        uploadFormData.append("categoryBanner", categoryBannerFile);

      let payloadToSave = { ...formdata };
      if (
        [categoryImageFile, categoryLogoFile, categoryBannerFile].some(Boolean)
      ) {
        const uploadResponse = await apiUploadRequest<{
          categoryImage?: string;
          categoryLogo?: string;
          categoryBanner?: string;
        }>("/uploads/category-assetsffff", uploadFormData);

        if (!uploadResponse.success) {
          toast.error(uploadResponse.message ?? "Image upload failed");
          setLoading(false);
          return;
        }

        payloadToSave = {
          ...payloadToSave,
          categoryImage:
            uploadResponse.data?.categoryImage ?? payloadToSave.categoryImage,
          categoryLogo:
            uploadResponse.data?.categoryLogo ?? payloadToSave.categoryLogo,
          categoryBanner:
            uploadResponse.data?.categoryBanner ?? payloadToSave.categoryBanner,
        };
      }

       const response2 = await apiPostRequest("/categories", requestData);

      const response = await apiPostRequest("/products", requestDataProduct);

      if (response.success) {
        toast.success(response.message ?? "Category created successfully");
        setLoading(false);
        setFormData(initialFormData);
        if (categoryImagePreviewRef.current) {
          URL.revokeObjectURL(categoryImagePreviewRef.current);
          categoryImagePreviewRef.current = null;
        }
        if (categoryLogoPreviewRef.current) {
          URL.revokeObjectURL(categoryLogoPreviewRef.current);
          categoryLogoPreviewRef.current = null;
        }
        if (categoryBannerPreviewRef.current) {
          URL.revokeObjectURL(categoryBannerPreviewRef.current);
          categoryBannerPreviewRef.current = null;
        }
        setCategoryImagePreviewUrl(null);
        setCategoryLogoPreviewUrl(null);
        setCategoryBannerPreviewUrl(null);
        setCategoryImageFile(null);
        setCategoryLogoFile(null);
        setCategoryBannerFile(null);
        return;
      } else {
        console.error("Category save failed:", response);
        toast.error(response.message ?? "Failed to create category");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network error:", error);
      toast.error("Network error");
    }
  };

  return (
    // <div className="w-full bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
    //   <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    //     Add New Category
    //   </h2>

    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Category
          </h2>

          <form    onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={formdata.categoryName ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryName: e.target.value,
                  }));
                }}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Slug
              </label>
              <input
                type="text"
                placeholder="Enter slug (optional)"
                value={formdata.slug ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }));
                }}
                className="w-full border rounded-lg px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Write a short description…"
                rows={4}
                value={formdata.categoryDescription ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryDescription: e.target.value,
                  }));
                }}
                className="w-full border rounded-lg px-4 text-black py-2 outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Category Image */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Image (Choose from gallery)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCategoryImageFile(file);
                  if (categoryImagePreviewRef.current) {
                    URL.revokeObjectURL(categoryImagePreviewRef.current);
                    categoryImagePreviewRef.current = null;
                  }
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    categoryImagePreviewRef.current = objectUrl;
                    setCategoryImagePreviewUrl(objectUrl);
                  } else {
                    setCategoryImagePreviewUrl(null);
                  }
                }}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {categoryImagePreviewUrl && (
                <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-lg border">
                  <Image
                    src={categoryImagePreviewUrl}
                    alt="Category image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Logo (Choose from gallery)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCategoryLogoFile(file);
                  if (categoryLogoPreviewRef.current) {
                    URL.revokeObjectURL(categoryLogoPreviewRef.current);
                    categoryLogoPreviewRef.current = null;
                  }
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    categoryLogoPreviewRef.current = objectUrl;
                    setCategoryLogoPreviewUrl(objectUrl);
                  } else {
                    setCategoryLogoPreviewUrl(null);
                  }
                }}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {categoryLogoPreviewUrl && (
                <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-lg border">
                  <Image
                    src={categoryLogoPreviewUrl}
                    alt="Category logo preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category Banner (Choose from gallery)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCategoryBannerFile(file);
                  if (categoryBannerPreviewRef.current) {
                    URL.revokeObjectURL(categoryBannerPreviewRef.current);
                    categoryBannerPreviewRef.current = null;
                  }
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    categoryBannerPreviewRef.current = objectUrl;
                    setCategoryBannerPreviewUrl(objectUrl);
                  } else {
                    setCategoryBannerPreviewUrl(null);
                  }
                }}
                className="w-full border text-black rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {categoryBannerPreviewUrl && (
                <div className="relative mt-3 h-32 w-full max-w-sm overflow-hidden rounded-lg border">
                  <Image
                    src={categoryBannerPreviewUrl}
                    alt="Category banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#0072bc] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
