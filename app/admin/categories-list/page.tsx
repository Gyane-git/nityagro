"use client";

import { useState, useEffect, useRef } from "react";
import useConfirmModalStore from "@/store/confirmModalStore";
import toast from "react-hot-toast";
import {
  apiDeleteRequest,
  apiGetRequest,
  apiPutRequest,
  apiUploadRequest,
} from "@/apihelper/apiHelper";
import { Edit, Edit2, Info, Search, Trash, Trash2 } from "lucide-react";

interface Categories {
  categoryId: number;
  categoryName: string;
  slug: string;
  userId: string;
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  categoryStatus: string | null;
  categoryDescription: string;
  createdAt: string;
}
type FormData = {
  categoryId: string;
  categoryName: string;
  slug: string | null;
  categoryDescription: string | null;
  categoryImage: File | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};
export default function CategoriesListPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const openConfirm = useConfirmModalStore((state) => state.open);
  const [infoDialg, setInfoDialog] = useState<Categories | null>(null);
  const [categories, setCategories] = useState<Categories[]>([]);

  const initialFormData: FormData = {
    categoryId: "",
    categoryName: "",
    slug: null,
    categoryDescription: null,
    categoryImage: null,
    categoryLogo: null,
    categoryBanner: null,
    userId: "1",
  };

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

  const [formdata, setFormData] = useState(initialFormData);

  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  const [categoryLogo, setCategoryLogo] = useState<File | null>(null);

  const [categoryBanner, setCategoryBanner] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await apiGetRequest<Categories[]>("/categories");
      if (response.success) {
        setLoading(false);
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching ledger:", error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDatas = new FormData();

    formDatas.append("categoryId", formdata.categoryId);
    formDatas.append("categoryName", formdata.categoryName);
    formDatas.append("slug", formdata.slug ?? "");
    formDatas.append("categoryDescription", formdata.categoryDescription ?? "");
    formDatas.append("categoryDescription", formdata.categoryDescription ?? "");

    // formDatas.append(
    //   "categoryStatus",
    //   String(formdata.categoryStatus ?? false)
    // );
    
    setFormData((prev)=>({
      ...prev,
      categoryImage:imageFile
    }))
    // if (categoryImage) {
    //   formDatas.append("categoryImage", categoryImage);
    // }

     const response = await apiPutRequest("/categories", formDatas);
      if (response.success) {
        setFormData(initialFormData);
        toast.success("response.message");
        setLoading(false);
        fetchCategories();
        // reset form
        return;
      } else {
        toast.error(response.message ?? "");

        setLoading(false);
        console.log(response.message);
      }

   
  }

  const updateSubmit2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(JSON.stringify(formdata));
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
        }>("/uploads/category-assets", uploadFormData);

        if (!uploadResponse.success) {
          toast.error(uploadResponse.message ?? "Image upload failed");
          setLoading(false);
          return;
        }

        payloadToSave = {
          ...payloadToSave,
          categoryImage: payloadToSave.categoryImage,
          categoryLogo: payloadToSave.categoryLogo,
          categoryBanner: payloadToSave.categoryBanner,
        };
      }

      const response = await apiPutRequest("/categories", formdata);
      if (response.success) {
        setFormData(initialFormData);
        toast.success("response.message");
        setLoading(false);
        fetchCategories();
        // reset form
        return;
      } else {
        toast.error(response.message ?? "");

        setLoading(false);
        console.log(response.message);
      }
    } catch (error) {
      setLoading(false);
      alert("Network error:");
      console.error("Network error:", error);
    }
  };

  // Delete category
  async function handleDelete(id: number) {
    openConfirm({
      title: "Delete Category",
      message:
        "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        const payLoad = {
          categoryId: id,
        };
        try {
          const response = await apiDeleteRequest("/categories", payLoad);
          if (response.success) {
            toast.success("response.message");
            setLoading(false);
            fetchCategories();
            // reset form
            return;
          } else {
            toast.error(response.message ?? "");

            setLoading(false);
            console.log(response.message);
          }
        } catch (error) {
          setLoading(false);
          alert("Network error:");
          console.error("Network error:", error);
        }
      },
    });
  }

  if (loading)
    return <p className="text-center mt-10">Loading categories...</p>;

  return (
    <div className="p-6">
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex  gap-4">
            <div className="relative flex text-gray-900 ">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 text-center  items-center text-2xl text-gray-800 font-semibold">
              Categories
            </div>
            {/* 
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category}
              </option>
            ))}
          </select> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-black border-gray-200 rounded-lg">
            <thead className="bg-slate-500 border-b text-white border-gray-200">
              <tr>
                <th className="p-2 text-center text-xs border">ID</th>
                <th className="p-2 text-center text-xs border">Name</th>
                <th className="p-2 text-center text-xs border">Slug</th>
                <th className="p-2 text-center text-xs border">Description</th>
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
                <th className="p-2 text-center text-xs border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.categoryId}
                    className="hover:bg-green-100 text-sm text-gray-900 cursor-pointer"
                  >
                    <td className="p-1 text-center">{cat.categoryId}</td>
                    {/* <td className="px-4 py-2 border-b">{cat.}</td> */}
                    <td className="p-1 text-center">{cat.categoryName}</td>
                    <td className="p-1 text-center">{cat.slug ?? "N/A"}</td>
                    <td className="p-1 text-center">
                      {cat.categoryDescription ?? "N/A"}
                    </td>
                    <td className="p-1 text-center">
                      {cat.categoryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.categoryImage}
                          alt={`${cat.categoryName} category`}
                          className="h-12 w-12 rounded object-cover border"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {cat.categoryLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.categoryLogo}
                          alt={`${cat.categoryName} logo`}
                          className="h-12 w-12 rounded object-cover border"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {cat.categoryBanner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.categoryBanner}
                          alt={`${cat.categoryName} banner`}
                          className="h-12 w-24 rounded object-cover border"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-1 text-center">
                      {new Date(cat.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2  text-center space-x-2">
                      <button
                        onClick={() => setInfoDialog(cat)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Info size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition">
                        <Edit
                          size={16}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              categoryId: String(cat.categoryId),
                              categoryName: cat.categoryName,
                              slug: cat.slug,
                              categoryDescription: cat.categoryDescription,
                              categoryImage: null,
                              categoryLogo: cat.categoryLogo,
                              categoryBanner: cat.categoryBanner,
                              userId: "1",
                            }));
                          }}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.categoryId)}
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
      {/* Info Dialog */}
      {infoDialg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          {/* Modal box (clickable) */}
          <div className="bg-white p-5 rounded shadow-lg w-md pointer-events-auto ">
            <h2 className="text-lg text-slate-500 font-semibold mb-4">
              Category Info {infoDialg.categoryName}
            </h2>

            <label className="block text-gray-700 font-medium mb-2">
              Category Name
              <input
                readOnly
                value={infoDialg.categoryName}
                className="w-full border text-black rounded-lg px-4 py-2"
              />
            </label>

            <label className="block text-gray-700 font-medium mb-2">
              Slug
              <input
                readOnly
                value={infoDialg.slug}
                className="w-full border rounded-lg px-4 py-2 text-black"
              />
            </label>

            <label className="block text-gray-700 font-medium mb-2">
              Description
              <textarea
                readOnly
                value={infoDialg.categoryDescription}
                rows={4}
                className="w-full border rounded-lg px-4 py-2 text-black"
              />
            </label>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-gray-700 font-medium mb-1">Category Image</p>
                {infoDialg.categoryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={infoDialg.categoryImage}
                    alt="Category preview"
                    className="h-24 w-24 object-cover rounded border"
                  />
                ) : (
                  <p className="text-gray-500">N/A</p>
                )}
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-1">Category Logo</p>
                {infoDialg.categoryLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={infoDialg.categoryLogo}
                    alt="Category logo preview"
                    className="h-24 w-24 object-cover rounded border"
                  />
                ) : (
                  <p className="text-gray-500">N/A</p>
                )}
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  Category Banner
                </p>
                {infoDialg.categoryBanner ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={infoDialg.categoryBanner}
                    alt="Category banner preview"
                    className="h-24 w-full object-cover rounded border"
                  />
                ) : (
                  <p className="text-gray-500">N/A</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-slate-600 rounded"
                onClick={() => setInfoDialog(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Dialog */}
      {formdata.categoryName && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 ">
          {/* Modal box (clickable) */}
          <div className="bg-white p-5 rounded shadow-lg w-md ">
            <h2 className="text-lg text-slate-500 font-semibold mb-4">
              Edit Category Info {formdata.categoryName}
            </h2>

            <form  onSubmit={updateSubmit}>
              <label className="block text-gray-700 font-medium mb-2">
                Category Name
                <input
                  value={formdata.categoryName ?? ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryName: e.target.value,
                    }));
                  }}
                  className="w-full border text-black rounded-lg px-4 py-2"
                />
              </label>
              <label className="block text-gray-700 font-medium mb-2">
                Slug
                <input
                  value={formdata.slug ?? ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                  }}
                  className="w-full border rounded-lg px-4 py-2 text-black"
                />
              </label>
              <label className="block text-gray-700 font-medium mb-2">
                Description
                <textarea
                  value={formdata.categoryDescription ?? ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryDescription: e.target.value,
                    }));
                  }}
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2 text-black"
                />
              </label>
              <div className="grid grid-cols-1 gap-3">
                {/* Category Image */}

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="file"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />

                  <input
                    type="file"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />

                  <input
                    type="file"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-slate-600 rounded"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, categoryName: "" }))
                  }
                >
                  Cancel
                </button>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={` bg-[#0072bc] text-white py-2 px-4 cursor-pointer rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
