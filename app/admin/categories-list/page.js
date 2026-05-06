"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useConfirmModalStore from "@/store/confirmModalStore";
import toast from "react-hot-toast";

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const openConfirm = useConfirmModalStore((state) => state.open);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setCategories(data.data.categories);
      } else {
        alert("Failed to fetch categories!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching categories!");
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  // Delete category
  async function handleDelete(id) {
    openConfirm({
      title: "Delete Category",
      message:
        "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            toast.success("Category deleted successfully!");
            setCategories(categories.filter((cat) => cat.id !== id));
          } else {
            toast.error("Failed to delete category!");
          }
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong while deleting!");
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
                <th className="px-4 py-2 border-b text-left">Logo</th>
                <th className="px-4 py-2 border-b text-left">Banner</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Created At</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{cat.id}</td>
                    {/* <td className="px-4 py-2 border-b">{cat.}</td> */}
                    <td className="px-4 py-2 border-b">{cat.category}</td>
                    <td className="px-4 py-2 border-b">{cat.slug || "TEST"}</td>
                    <td className="px-4 py-2 border-b">{cat.description || "TEST"}</td>
                    <td className="px-4 py-2 border-b">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">{cat.status || "TEST"}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(cat.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-b text-center space-x-2">
                      <button
                        onClick={() => alert(JSON.stringify(cat, null, 2))}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Info
                      </button>
                      <Link
                        href={`/admin/edit-categories/${cat.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
    </div>
  );
}
