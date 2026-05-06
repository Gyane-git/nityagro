"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Info, Plus, Search } from "lucide-react";
import Link from "next/link";
import useConfirmModalStore from "@/store/confirmModalStore";

import toast from "react-hot-toast";

const PRODUCT_API = "/api/products";
const CATEGORY_API = "/api/categories";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // const [showConfirm, setShowConfirm] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);
  const openConfirm = useConfirmModalStore((state) => state.open);

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(PRODUCT_API);
        const data = await res.json();
        // console.log(data.products[0])
        setProducts(data.products || []);
      } catch (err) {
        console.error("Products fetch error:", err);
      }
    }
    fetchProducts();
  }, []);

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(CATEGORY_API);
        const data = await res.json();
        setCategories(data.data?.categories || []);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    }
    fetchCategories();
  }, []);

  // Filter Products by search & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.productCode || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "" || String(p.categoryId || p.category?.id || "") === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Delete product
  const handleDelete = (id) => {
    openConfirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`${PRODUCT_API}/${id}`, { method: "DELETE" });

          setProducts((prev) => prev.filter((p) => p.id !== id));
          toast.success("Product deleted successfully 🗑️");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete product!");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/add-product" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-75 text-gray-900 ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Catalog</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Warranty Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition text-center">
                {/* Image */}
                <td className="px-6 py-4">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                    <img src={resolveImageUrl(product.mainImage || product.images?.[0]?.mainImage)} alt={product.name} className="object-cover" />
                  </div>
                </td>

                {/* Catalog */}
                <td className="px-6 py-4">
                  {product.productCatalog ? (
                    <a
                      href={product.productCatalog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      📄 View Catalog
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No catalog</span>
                  )}
                </td>

                {/* Code */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{product.productCode}</span>
                </td>

                {/* Product Name */}
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.brandName || "Yuemi"}</div>
                    <div className="text-xs text-gray-500 mt-1">Brand Name</div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{product.categoryName || "Uncategorized"}</span>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <div>
                    <div className="text-xs text-gray-400 line-through text-nowrap">Rs. {product.actualPrice}</div>
                    <div className="text-sm font-bold text-gray-900 text-nowrap">Rs. {product.sellPrice}</div>
                  </div>
                </td>

                {/* Stock */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{product.availableQuantity || 0}</span>
                </td>

                {/* Warranty Type */}
                <td className="px-6 py-4">
                  {product.requiresSerial ? (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">Serial Required</span>
                  ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Non-Serial</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {product.status > 0 ? (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>
                  ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Out of Stock</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Info size={18} />
                    </button>
                    <Link href={`/admin/edit-product/${product.id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
