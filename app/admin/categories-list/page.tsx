"use client";

import { useEffect, useMemo, useState } from "react";
import useConfirmModalStore from "@/store/confirmModalStore";
import toast from "react-hot-toast";
import {
  apiDeleteRequest,
  apiGetRequest,
  apiPostRequest,
  apiPutRequest,
  apiUploadRequest,
} from "@/apihelper/apiHelper";
import { Edit2, Info, Search, Trash2 } from "lucide-react";

interface Category {
  categoryId: number;
  categoryName: string;
  userId: string;
  slug: string | null;
  categoryDescription: string | null;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  categoryStatus: boolean;
  createdAt: string;
}

type OmsProduct = {
  PCode: string;
  PDesc: string;
  GroupName: string;
  SubGroupName:string;
  slug: string | null;
  categoryDescription: string | null;
  BuyRate: number;
  SalesRate: number;
  MRP: number;
  TradeRate: number;
  StockStatus: string;
  StockQty: string;
  stockQuantity: number;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};

type OmsSubGroupName = {
  PCode: string;
  PDesc: string;
  SubGroupName: string;
  //SalesRate: number;
  MRP: number;
  Qty:number;
  StockQty:number

};

type OmsCategory = {
  GroupName: string;
};

type ProductSyncPayload = {
  productCode: string;
  categoryId: string;
  userId: string;
  productName: string;
  subGroupName: string | null;
  slug: null;
  productVariation: null;
  productDescription: null;
  nutritionInfo: null;
  cookingInstruction: null;
  storageInstruction: null;
  pImage: null;
  productStatus: boolean;
  actualPrice: number;
  sellingPrice: number;
  deliveryTargetDays: null;
};

type SubGroupSyncPayload = {
  pCode: string;
  subGroupName: string;
  variationName: string;
  //salesRate: number;
  MRP: number;

};

type EditForm = {
  categoryId: string;
  categoryName: string;
  slug: string;
  categoryDescription: string;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  categoryStatus: boolean;
};

const emptyForm: EditForm = {
  categoryId: "",
  categoryName: "",
  slug: "",
  categoryDescription: "",
  categoryImage: null,
  categoryLogo: null,
  categoryBanner: null,
  categoryStatus: false,
};

function readOmsNumber(...values: unknown[]) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 0;
}

export default function CategoriesListPage() {
  const openConfirm = useConfirmModalStore((state) => state.open);

  const [loading, setLoading] = useState(false);
  const [syncingOms, setSyncingOms] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [infoDialog, setInfoDialog] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);

  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryLogoFile, setCategoryLogoFile] = useState<File | null>(null);
  const [categoryBannerFile, setCategoryBannerFile] = useState<File | null>(
    null,
  );

  const resolveImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiGetRequest<Category[]>("/categories");
      if (response.success) {
        setCategories((response.data || []) as Category[]);
      } else {
        toast.error(response.message ?? "Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(q) ||
        (category.slug || "").toLowerCase().includes(q) ||
        (category.categoryDescription || "").toLowerCase().includes(q),
    );
  }, [categories, search]);

  const handleOmsSync = async () => {
    const syncToastId = toast.loading("Syncing categories, products and variants from OMS...");
    setSyncingOms(true);
    try {
      const omsResponse = await fetch("/api/oms/products", {
        cache: "no-store",
      });

      if (!omsResponse.ok) {
        toast.error("Failed to fetch OMS categories", { id: syncToastId });
        return;
      }

      const omsJson = await omsResponse.json();
      const categories: OmsCategory[] = Array.isArray(omsJson?.data)
        ? omsJson.data
        : [];
         const uniqueCategoryNames = Array.from(
        new Set(
          categories
            .map((item) => (item.GroupName || "").trim())
            .filter(Boolean),
        ),
      );
      const products: OmsProduct[] = Array.isArray(omsJson?.data)
        ? omsJson.data
        : [];
         const subGroup: OmsSubGroupName[] = Array.isArray(omsJson?.data)
        ? omsJson.data
        : [];

      const product = Object.values(
        products.reduce((acc, item) => {
          const key = String(item.PCode || "").trim();
          if (!key) return acc;
          acc[key] = {
            productCode: key,
            categoryId: String(item.GroupName || "").trim(),
            userId: "1",
            productName: String(item.PDesc || "").trim(),
            subGroupName: String(item.SubGroupName || "").trim() || null,
            slug: null,
            productVariation: null,
            productDescription: null,
            nutritionInfo: null,
            cookingInstruction: null,
            storageInstruction: null,
            pImage: null,
            productStatus: false,
            actualPrice: readOmsNumber(
              item.TradeRate,
              (item as Record<string, unknown>).tradeRate,
              (item as Record<string, unknown>).trade_rate,
              item.BuyRate,
            ),
            sellingPrice: readOmsNumber(
              item.MRP,
              (item as Record<string, unknown>).mrp,
              item.SalesRate,
              (item as Record<string, unknown>).salesRate,
            ),
            deliveryTargetDays: null,
          };
          return acc;
        }, {} as Record<string, ProductSyncPayload>),
      );

      const productsubGroup = Object.values(
        subGroup.reduce((acc, item) => {
          const key = String(item.PCode || "").trim();
          if (!key) return acc;
          acc[key] = {
            pCode: key,
            subGroupName: String(item.SubGroupName || "").trim(),
            variationName: String(item.PDesc || "").trim(),
           // salesRate: item.SalesRate,
            MRP: readOmsNumber(
              item.MRP,
              (item as Record<string, unknown>).mrp,
              (item as Record<string, unknown>).SalesRate,
              (item as Record<string, unknown>).salesRate,
            ),
          };
          return acc;
        }, {} as Record<string, SubGroupSyncPayload>),
      );

      if (uniqueCategoryNames.length === 0) {
        toast("No categories found in OMS", {
          id: syncToastId,
          icon: "⚠️",
        });
        return;
      }

      const payload = {
        categories: uniqueCategoryNames.map((categoryName) => ({
          categoryName,
          slug: "",
          categoryDescription: "",
          categoryImage: "",
          categoryLogo: "",
          categoryBanner: "",
          userId: "1",
          categoryStatus: false,
        })),
        products: product.map((item) => ({
          productCode: item.productCode,
          categoryName: item.categoryId,
        })),
      };

      const requestDataProduct = {
        product,
      };

      const requestDataSubGroup = {
        productsubGroup,
      };
      const categorySync = await apiPostRequest("/categories", payload);
      const productSync = await apiPostRequest("/products", requestDataProduct);
      const subCategorySync = await apiPostRequest(
        "/subcategories",
        requestDataSubGroup,
      );
      if (!categorySync.success || !productSync.success || !subCategorySync.success) {
        toast.error(
          categorySync.message ||
            productSync.message ||
            subCategorySync.message ||
            "OMS sync failed",
          { id: syncToastId },
        );
        return;
      }

      toast.success(
        `OMS sync completed: ${uniqueCategoryNames.length} categories, ${product.length} products, ${productsubGroup.length} variants checked.`,
        { id: syncToastId },
      );
      await fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("OMS sync failed", { id: syncToastId });
    } finally {
      setSyncingOms(false);
    }
  };

  const confirmOmsSync = () => {
    openConfirm({
      title: "Sync OMS Data",
      message:
        "This will refresh categories, products and variants from OMS. New synced items remain inactive until you review and activate them.",
      onConfirm: handleOmsSync,
    });
  };

  const handleEditOpen = (category: Category) => {
    setEditForm({
      categoryId: String(category.categoryId),
      categoryName: category.categoryName,
      slug: category.slug || "",
      categoryDescription: category.categoryDescription || "",
      categoryImage: category.categoryImage,
      categoryLogo: category.categoryLogo,
      categoryBanner: category.categoryBanner,
      categoryStatus: Boolean(category.categoryStatus),
    });
    setCategoryImageFile(null);
    setCategoryLogoFile(null);
    setCategoryBannerFile(null);
    toast("Category edit form opened");
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm.categoryId) {
      toast.error("Please select a category before updating");
      return;
    }

    const updateToastId = toast.loading("Updating category...");
    setLoading(true);
    try {
      let categoryImage = editForm.categoryImage;
      let categoryLogo = editForm.categoryLogo;
      let categoryBanner = editForm.categoryBanner;

      if (
        [categoryImageFile, categoryLogoFile, categoryBannerFile].some(Boolean)
      ) {
        toast.loading("Uploading category media...", { id: updateToastId });
        
        const uploadFormData = new FormData();
        if (categoryImageFile)
          uploadFormData.append("categoryImage", categoryImageFile);
        if (categoryLogoFile)
          uploadFormData.append("categoryLogo", categoryLogoFile);
        if (categoryBannerFile)
          uploadFormData.append("categoryBanner", categoryBannerFile);

        const uploadResponse = await apiUploadRequest<{
          categoryImage?: string;
          categoryLogo?: string;
          categoryBanner?: string;
        }>("/uploads/category-assets", uploadFormData);

        if (!uploadResponse.success) {
          toast.error(uploadResponse.message ?? "Image upload failed", {
            id: updateToastId,
          });
          setLoading(false);
          return;
        }

        categoryImage = uploadResponse.data?.categoryImage ?? categoryImage;
        categoryLogo = uploadResponse.data?.categoryLogo ?? categoryLogo;
        categoryBanner = uploadResponse.data?.categoryBanner ?? categoryBanner;
      }

      const response = await apiPutRequest("/categories", {
        categoryId: editForm.categoryId,
        slug: editForm.slug,
        categoryDescription: editForm.categoryDescription,
        categoryImage,
        categoryLogo,
        categoryBanner,
        categoryStatus: editForm.categoryStatus,
      });

      if (!response.success) {
        toast.error(response.message ?? "Failed to update category", {
          id: updateToastId,
        });
        setLoading(false);
        return;
      }

      toast.success(response.message ?? "Category updated successfully", {
        id: updateToastId,
      });
      setEditForm(emptyForm);
      setCategoryImageFile(null);
      setCategoryLogoFile(null);
      setCategoryBannerFile(null);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category", { id: updateToastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (categoryId: number) => {
    openConfirm({
      title: "Delete Category",
      message:
        "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        const deleteToastId = toast.loading("Deleting category...");
        try {
          const response = await apiDeleteRequest("/categories", {
            categoryId,
          });
          if (!response.success) {
            toast.error(response.message ?? "Failed to delete category", {
              id: deleteToastId,
            });
            return;
          }
          toast.success(response.message ?? "Category deleted", {
            id: deleteToastId,
          });
          await fetchCategories();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete category", { id: deleteToastId });
        }
      },
    });
  };

  return (
    <div className="p-6">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-4 items-center">
            <div className="relative text-gray-900">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 text-center text-2xl text-gray-800 font-semibold">
              Categories
            </div>
            <button
              onClick={confirmOmsSync}
              disabled={syncingOms}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
                syncingOms
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1f6a45] hover:bg-[#155235]"
              }`}
            >
              {syncingOms ? "Syncing..." : "OMS Data Sync"}
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            External API categories are synced automatically. You can only
            update
            <strong> slug, description and images</strong> here.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-black border-gray-200 rounded-lg">
            <thead className="bg-slate-500 border-b text-white border-gray-200">
              <tr>
                <th className="p-2 text-center text-xs border">ID</th>
                <th className="p-2 text-center text-xs border">Name</th>
                
                <th className="p-2 text-center text-xs border">
                  Category Image
                </th>
                <th className="p-2 text-center text-xs border">
                  Category Logo
                </th>
                <th className="p-2 text-center text-xs border">
                  Category Banner
                </th>
                <th className="p-2 text-center text-xs border">Created At</th>
                <th className="p-2 text-center text-xs border">Status</th>
                <th className="p-2 text-center text-xs border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="hover:bg-green-100 text-sm text-gray-900"
                  >
                    <td className="p-1 text-center">{category.categoryId}</td>
                    <td className="p-1 text-center">{category.categoryName}</td>
                    
                    <td className="p-1 text-center">
                      {category.categoryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(category.categoryImage)}
                          alt=""
                          className="h-12 w-12 rounded object-cover border mx-auto"
                          onError={(event) => {
                            event.currentTarget.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {category.categoryLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(category.categoryLogo)}
                          alt=""
                          className="h-12 w-12 rounded object-cover border mx-auto"
                          onError={(event) => {
                            event.currentTarget.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {category.categoryBanner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(category.categoryBanner)}
                          alt=""
                          className="h-12 w-24 rounded object-cover border mx-auto"
                          onError={(event) => {
                            event.currentTarget.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {new Date(category.createdAt).toLocaleString()}
                    </td>
                    <td className="p-1 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          category.categoryStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.categoryStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => {
                          setInfoDialog(category);
                          toast("Category details opened");
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Info size={16} />
                      </button>
                      <button
                        onClick={() => handleEditOpen(category)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.categoryId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {infoDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0072bc] to-blue-600 px-6 py-5 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Category Details</h2>
                <p className="text-sm text-blue-100 mt-1">
                  View complete category information
                </p>
              </div>
              <button
                onClick={() => setInfoDialog(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 font-medium">
                  {infoDialog.categoryName || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug
                </label>
                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                  {infoDialog.slug || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <div className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {infoDialog.categoryDescription || "No description available"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs text-gray-500 mb-1">Category ID</p>
                  <p className="font-semibold text-gray-800">
                    #{infoDialog.categoryId}
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p
                    className={`font-semibold ${
                      infoDialog.categoryStatus
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {infoDialog.categoryStatus ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t flex justify-end">
                <button
                  onClick={() => setInfoDialog(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0072bc] text-white font-medium hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editForm.categoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-[#0072bc] to-blue-600 text-white">
              <div>
                <h2 className="text-xl font-bold">Edit Category</h2>
                <p className="text-sm text-blue-100 mt-1">
                  Update category details and media assets
                </p>
              </div>
              <button
                onClick={() => setEditForm(emptyForm)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  readOnly
                  value={editForm.categoryName}
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Category name is synced from OMS and non-editable
                </p>
              </div>

             

             

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Media Uploads
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Category Image",
                      current: editForm.categoryImage,
                      setter: setCategoryImageFile,
                    },
                    {
                      title: "Category Logo",
                      current: editForm.categoryLogo,
                      setter: setCategoryLogoFile,
                    },
                    {
                      title: "Category Banner",
                      current: editForm.categoryBanner,
                      setter: setCategoryBannerFile,
                    },
                  ].map((item) => (
                    <label
                      key={item.title}
                      className="group cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 transition p-5 text-center"
                    >
                      {item.current ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(item.current)}
                          alt=""
                          className="mx-auto mb-2 h-14 w-14 rounded border object-cover"
                          onError={(event) => {
                            event.currentTarget.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        <div className="text-3xl mb-2">📁</div>
                      )}
                      <p className="font-medium text-gray-700 group-hover:text-blue-600">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to replace
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          item.setter(file);
                          if (file) {
                            toast.success(`${item.title} selected`);
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.categoryStatus}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        categoryStatus: e.target.checked,
                      }))
                    }
                  />
                  Set this category Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t">
                <button
                  type="button"
                  onClick={() => setEditForm(emptyForm)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-xl text-white font-medium transition ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-[#0072bc] hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Processing..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
