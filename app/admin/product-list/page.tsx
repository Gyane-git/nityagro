"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Info, Plus, Search, X } from "lucide-react";
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
  subGroupName: string;
  slug: null;
  productVariation: null;
  productDescription: null;
  nutritionInfo: null;
  cookingInstruction: null;
  storageInstruction: null;
  pImage: null;
  productStatus: boolean;
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

interface ProductVariant {
  variantId: string;
  pCode: string;
  subGroupName: string;
  variationName: string;
  stockQuantity: number;
  //salesRate: number;
  MRP: number;
  createdAt: string;
  updatedAt: string;
}
interface ProductVariantDetails {
  pCode: string;
  subGroupName: string;
  variationName: string;
  //salesRate: number;
  MRP: number;
  stockQuantity: number;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [productsVariant, setProductsVariant] = useState<ProductVariant[]>([]);
  const [open, setOpen] = useState(false);
  const [subGroupName, setSubGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productVariantDetails, setProductVariantDetails] = useState<ProductVariantDetails>({
    pCode: "",
    subGroupName: "",
    variationName: "",
    //salesRate: 0,
    MRP: 0,
    stockQuantity: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  // const [showConfirm, setShowConfirm] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);
  const openConfirm = useConfirmModalStore((state) => state.open);

  const resolveImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/no-image.png";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  };

  // Fetch Products
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await apiGetRequest<Products[]>("/products");
      if (response.success) {
        setProducts(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Fetch Products
  const fetchProductVariant = async (productId: string) => {
    const variantToastId = toast.loading("Loading product variants...");
    setLoading(true);
    try {
      const response = await apiGetRequest<ProductVariant[]>(`/subcategories/${productId}`);
      if (response.success) {
        setOpen(true);
        const variants = response.data || [];
        setProductsVariant(variants);
        if (variants.length > 0) {
          toast.success(`${variants.length} variant${variants.length > 1 ? "s" : ""} loaded`, {
            id: variantToastId,
          });
        } else {
          toast("No variants found for this product", {
            id: variantToastId,
            icon: "ℹ️",
          });
        }
      } else {
        toast.error(response.message || "Failed to fetch variants", {
          id: variantToastId,
        });
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
      toast.error("Failed to fetch variants", { id: variantToastId });
    } finally {
      setLoading(false);
    }
  };

  // Filter Products by search & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.productName.toLowerCase().includes(search.toLowerCase()) || (p.productCode || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "" || String(p.categoryId || p.categoryId || "") === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex  gap-4">
          <div className="relative flex text-gray-900 ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className=" pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <th className="p-2 text-center text-xs border">S.n</th>
              <th className="p-2 text-center text-xs border">Product Name</th>
              <th className="p-2 text-center text-xs border">Code</th>
              <th className="p-2 text-center text-xs border">Image</th>
              <th className="p-2 text-center text-xs border">Category</th>

              <th className="p-2 text-center text-xs border">Price</th>
              <th className="p-2 text-center text-xs border">Subgroup Status</th>
              <th className="p-2 text-center text-xs border">Inventory</th>
              <th className="p-2 text-center text-xs border">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((product, index) => (
              <tr key={product.productCode} className="hover:bg-green-100 text-sm text-gray-900 cursor-pointer">
                <td className="p-1 text-center">{startIndex + index + 1}</td>

                {/* Catalog */}
                <td className="p-1 text-left">
                  {product.subGroupName}
                  {/* {product.productName}  {product.subGroupName} */}
                </td>

                {/* Code */}
                <td className="p-1 text-center">
                  <span className="text-sm font-medium text-gray-900">{product.productCode}</span>
                </td>
                {/* Image */}
                <td className="p-1 text-center">
                  <div className="inline-flex justify-center w-full">
                    <div className="w-8 h-8 relative rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={resolveImageUrl(product.pImage)}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = "/no-image.png";
                        }}
                      />
                    </div>
                  </div>
                </td>
                {/* Product Name */}
                <td className="p-1 text-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.categoryId || "Yuemi"}</div>
                  </div>
                </td>

                {/* Price */}
                <td className="p-1 text-center">
                  <div>
                    <div className="text-xs text-gray-400 line-through text-nowrap">Rs. {product.actualPrice}</div>
                    <div className="text-sm font-bold text-gray-900 text-nowrap">Rs. {product.sellingPrice}</div>
                  </div>
                </td>

                {/* Subgroup Status */}
                <td className="p-1 text-center">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${product.productStatus ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{product.productStatus ? "Active" : "Inactive"}</span>
                </td>

                {/* Inventory */}
                <td className="p-1 text-center">{Number(product.availableQuantity) > 0 ? <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">In Stock</span> : <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Out of Stock</span>}</td>

                {/* Actions */}
                <td className="p-1 text-center">
                  <div className="flex items-center gap-2 justify-center ">
                    <button
                      onClick={(e) => {
                        fetchProductVariant(product.subGroupName);
                        setSubGroupName(product.subGroupName);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Info size={18} />
                    </button>
                    <Link href={`/admin/edit-product/${product.productCode}`} onClick={() => toast("Opening product editor...")} className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Edit size={18} />
                    </Link>
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
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(startIndex + currentItems.length, filteredProducts.length)}</span> of{" "}
            <span className="font-semibold">{filteredProducts.length}</span> products
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={!canGoPrevious}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                canGoPrevious ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>
              {i + 1}
            </button>
          ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={!canGoNext}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                canGoNext ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 text-slate-600 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[500px]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">{subGroupName}</h2>
              <X onClick={() => setOpen(false)} className="bg-slate-400 cursor-pointer text-black hover:bg-green-700 hover:text-white"></X>
            </div>

            {productsVariant.length > 0 ? (
              <div className="space-y-3">
                {productsVariant.map((item) => (
                  <button
                    onClick={() => {
                      setProductVariantDetails((prev) => ({
                        ...prev,
                        pCode: item.pCode,
                        subGroupName: item.subGroupName,
                        variationName: item.variationName,
                        //salesRate: item.salesRate,
                        MRP: item.MRP,
                        stockQuantity: item.stockQuantity,
                      }));
                    }}
                    key={item.variantId}
                    //  onClick={() => setSelectedWeight(w)}
                    className="px-4 py-2 cursor-pointer text-sm bg-green-700 hover:bg-green-900 text-white font-medium border rounded-md transition-all duration-150"
                  >
                    {item.variationName}
                  </button>
                ))}
              </div>
            ) : (
              <p>No variants found</p>
            )}
          </div>
        </div>
      )}

      {productVariantDetails.subGroupName && (
        <div className="fixed inset-0 bg-black/50 text-slate-600 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[500px]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">{subGroupName}</h2>
              <X
                onClick={() =>
                  setProductVariantDetails((prev) => ({
                    ...prev,

                    subGroupName: "",
                  }))
                }
                className="bg-slate-400 cursor-pointer text-black hover:bg-green-700 hover:text-white"
              ></X>
            </div>

            <p>Name: {productVariantDetails.subGroupName}</p>
            <p>Sale Price: {productVariantDetails.MRP}</p>
            <p>Stock Quantity: {productVariantDetails.stockQuantity}</p>
          </div>
        </div>
      )}
    </div>
  );
}
