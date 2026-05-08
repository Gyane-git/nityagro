"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Info, Plus, Search } from "lucide-react";
import Link from "next/link";
import useConfirmModalStore from "@/store/confirmModalStore";

import toast from "react-hot-toast";
import { apiGetRequest } from "@/apihelper/apiHelper";

const PRODUCT_API = "/api/products";
const CATEGORY_API = "/api/categories";

interface Products {
  productId: string;
  productCode: string;
  categoryId: string;
  userId: string;
  productName: string;
  slug: null;
  productVariation: null;
  productDescription: null;
  nutritionInfo: null;
  cookingInstruction: null;
  storageInstruction: null;
  pImage: null;
  productStatus: true;
  actualPrice: number;
  sellingPrice: 0;
  deliveryTargetDays: null;
  stockQuantity: null;
  availableQuantity: null;
  flashSale: boolean;
  specialOffer: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Products []>([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
  const fetchProduct = async () => {
    setLoading(true)
      try {
        const response = await apiGetRequest<Products[]>("/products");
        if (response.success) {
          setLoading(false);
          setProducts(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching ledger:", error);
      }
    };
    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProduct();
    }, []);


  // Filter Products by search & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      (p.productCode || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      String(p.categoryId || p.categoryId || "") === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Delete product
  const handleDelete = (id : string) => {
    openConfirm({
      title: "Delete Product",
      message:
        "Are you sure you want to delete this product? This action cannot be undone.",
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
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 text-center  items-center text-2xl text-gray-800 font-semibold">Products</div>
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

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full border text-black border-gray-200 rounded-lg">
           <thead className="bg-slate-500 border-b text-white border-gray-200">
            <tr>
               <th className="p-2 text-center text-xs border">
                S.n
              </th>
              <th className="p-2 text-center text-xs border">
                Product Name
              </th>
                <th className="p-2 text-center text-xs border">
                Code
              </th>
              <th className="p-2 text-center text-xs border">
                Image
              </th>
              <th className="p-2 text-center text-xs border">
                Category
              </th>
              <th className="p-2 text-center text-xs border">
                Price
              </th>
              <th className="p-2 text-center text-xs border">
                Stock
              </th>
             
              <th className="p-2 text-center text-xs border">
                Status
              </th>
              <th className="p-2 text-center text-xs border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((product,index) => (
               <tr
                key={product.productCode}
                className="hover:bg-green-100 text-sm text-gray-900 cursor-pointer"
              >
                 <td className="p-1 text-center">{index +1}</td>
               

                {/* Catalog */}
              <td className="p-1 text-left">
                  {product.productName}
                </td>

                {/* Code */}
               <td className="p-1 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {product.productCode}
                  </span>
                </td>
 {/* Image */}
               <td className="p-1 text-center">
                  <div className="w-8 h-8 relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={resolveImageUrl(
                        product.pImage ,
                      )}
                      alt={product.productName}
                      className="object-cover"
                    />
                  </div>
                </td>
                {/* Product Name */}
               <td className="p-1 text-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {product.categoryId || "Yuemi"}
                    </div>
                  </div>
                </td>

               

                {/* Price */}
                <td className="p-1 text-center">
                  <div>
                    <div className="text-xs text-gray-400 line-through text-nowrap">
                      Rs. {product.actualPrice}
                    </div>
                    <div className="text-sm font-bold text-gray-900 text-nowrap">
                      Rs. {product.sellingPrice}
                    </div>
                  </div>
                </td>

                {/* Stock */}
              <td className="p-1 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {product.availableQuantity || 0}
                  </span>
                </td>

             

                {/* Status */}
               <td className="p-1 text-center">
                  {Number(product.availableQuantity) > 0 ? (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      Out of Stock
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-1 text-center">
                  <div className="flex items-center gap-2 justify-center items-end">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Info size={18} />
                    </button>
                    <Link
                      href={`/admin/edit-product/${product.productCode}`}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.productCode)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
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
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
