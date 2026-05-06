"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useConfirmModalStore from "@/store/confirmModalStore";
import toast from "react-hot-toast";
import { apiDeleteRequest, apiGetRequest, apiPostRequest, apiPutRequest } from "@/app/apihelper/apiHelper";

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
  categoryImage: string | null;
  categoryLogo: string | null;
  categoryBanner: string | null;
  userId: string;
};
export default function CategoriesListPage() {
  const [loading, setLoading] = useState(false);
  const openConfirm = useConfirmModalStore((state) => state.open);
  const [infoDialg, setInfoDialog] = useState<Categories | null>(null);
  const [editDialg, setEditDialog] = useState<Categories | null>(null);
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

  const [formdata, setFormData] = useState(initialFormData);

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
    fetchCategories();
  }, []);

  const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(JSON.stringify(formdata));
    try {
      const response = await apiPutRequest("/categories", formdata)
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
      alert("Network error:")
      console.error("Network error:", error);
    }
  };

  // Delete category
  async function handleDelete(id:number) {

    openConfirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        const payLoad = {
          categoryId:id
        }
        try {
      const response = await apiDeleteRequest("/categories", payLoad)
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
      alert("Network error:")
      console.error("Network error:", error);
    }
      },
    });
  }

  if (loading)
    return <p className="text-center mt-10">Loading categories...</p>;

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl text-gray-800 font-semibold mb-6">
          Categories List
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-black border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Slug</th>
                <th className="px-4 py-2 border-b text-left">Description</th>
                <th className="px-4 py-2 border-b text-left">Image</th>
                <th className="px-4 py-2 border-b text-left">Created At</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{cat.categoryId}</td>
                    {/* <td className="px-4 py-2 border-b">{cat.}</td> */}
                    <td className="px-4 py-2 border-b">{cat.categoryName}</td>
                    <td className="px-4 py-2 border-b">{cat.slug ?? "N/A"}</td>
                    <td className="px-4 py-2 border-b">
                      {cat.categoryDescription ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b"></td>
                    <td className="px-4 py-2 border-b">
                      {new Date(cat.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-b text-center space-x-2">
                      <button
                        onClick={() => setInfoDialog(cat)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Info
                      </button>
                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: String(cat.categoryId),
                            categoryName:cat.categoryName,
                            slug: cat.slug,
                            categoryDescription: cat.categoryDescription,
                            categoryImage: cat.categoryImage,
                            categoryLogo: cat.categoryLogo,
                            categoryBanner: cat.categoryBanner,
                            userId: "1",
                          }));
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                         onClick={() => handleDelete(cat.categoryId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
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

            <form onSubmit={updateSubmit}>
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
                  value={formdata.categoryDescription ??""}
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
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-slate-600 rounded"
                  onClick={() => setFormData((prev)=>({...prev,categoryName:""}))}
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
