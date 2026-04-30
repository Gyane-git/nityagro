"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import RelatedProduct from "@/components/relatedProduct";
import { apiRequest } from "@/utils/ApisafeCalls";
import { isAuthenticatedClient } from "@/utils/clientAuth";
import { addCartItem } from "@/utils/cartClient";
import toast from "react-hot-toast";
import { Share2 } from "lucide-react";

interface ProductImage {
  id: string;
  mainImage: string;
  productCode: string;
  imagePath: string[] | null;
}

interface Brand {
  id: number;
  name: string;
  image: string | null;
}

interface Category {
  id: string;
  category: string;
  image: string;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  specifications: string | null;
  packaging: string | null;
  warranty: string | null;
  categoryId: string;
  categoryName: string;
  brandId: number;
  brandName: string;
  deliveryTargetDays: number;
  actualPrice: string;
  sellPrice: string;
  discount: string;
  stockQuantity: string;
  availableQuantity: string;
  mainImage: string;
  images: ProductImage[];
  brand: Brand;
  category: Category;
  weeklyProduct: boolean;
  flashSaleProduct: boolean;
  specialProduct: boolean;
  todayDeals: boolean;
  reviews: {
    id: string;
    name: string;
    review: string;
    rating: string;
    createdAt?: string;
  }[];
}

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "/yumei_logo.png";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function renderStars(ratingValue: number) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= ratingValue ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const normalizedProductId = Array.isArray(productId) ? productId[0] : productId;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  useEffect(() => {
    if (!normalizedProductId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await apiRequest(`/products/${normalizedProductId}`, false);
        const found = result?.data || result?.product || null;
        setProduct(found);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [normalizedProductId]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  const imageList = useMemo(() => {
    if (!product) return [];
    const gallery = product.images?.[0]?.imagePath || [];
    const normalizedGallery = Array.isArray(gallery) ? gallery : [];
    const all = [product.mainImage, ...normalizedGallery].filter(Boolean);
    const unique = Array.from(new Set(all));
    return unique;
  }, [product]);

  const incrementQuantity = () => {
    if (product && quantity < Number(product.availableQuantity)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleShareProduct = async () => {
    if (!product) return;
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/all-product/${product.id}`
        : "";

    try {
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: product.name,
          text: `Check this product: ${product.name}`,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied");
        return;
      }

      const tempInput = document.createElement("input");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      toast.success("Product link copied");
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      toast.error("Unable to share product");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (addToCartLoading || buyNowLoading) return;
    setAddToCartLoading(true);

    const authed = await isAuthenticatedClient();
    if (!authed) {
      setAddToCartLoading(false);
      toast.error("Please login to add items to cart");
      router.push("/account?next=/all-product/" + product.id);
      return;
    }

    try {
      addCartItem({
        id: product.id,
        productCode: product.productCode,
        name: product.name,
        image: resolveImageUrl(product.mainImage),
        price: Number(product.sellPrice || 0),
        quantity,
        availableQuantity: Number(product.availableQuantity || 0),
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      toast.success("Added to cart");
      window.dispatchEvent(new CustomEvent("open-cart"));
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (buyNowLoading || addToCartLoading) return;
    setBuyNowLoading(true);

    const authed = await isAuthenticatedClient();
    if (!authed) {
      setBuyNowLoading(false);
      toast.error("Please login to continue checkout");
      router.push("/account?next=/Checkout");
      return;
    }

    router.push(`/Checkout?productId=${product.id}&qty=${quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/categories")}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  const discount = Number(product.actualPrice) > Number(product.sellPrice)
    ? Math.round(((Number(product.actualPrice) - Number(product.sellPrice)) / Number(product.actualPrice)) * 100)
    : 0;

  const isInStock = Number(product.availableQuantity) > 0;
  const isLowStock = Number(product.availableQuantity) <= 10 && Number(product.availableQuantity) > 0;
  const selectedImageUrl = resolveImageUrl(imageList[selectedImage] || product.mainImage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => router.push("/")} className="hover:text-orange-600 transition">
              Home
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <button onClick={() => router.push("/categories")} className="hover:text-orange-600 transition">
              Categories
            </button>
            {product.category && (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => router.push(`/categories/${product.categoryId}`)}
                  className="hover:text-orange-600 transition"
                >
                  {product.categoryName}
                </button>
              </>
            )}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative bg-white rounded-2xl overflow-hidden aspect-square border border-gray-200 group"
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPosition({
                  x: Math.max(0, Math.min(100, x)),
                  y: Math.max(0, Math.min(100, y)),
                });
              }}
            >
              <img
                src={selectedImageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
              />

              {zoomActive && (
                <div
                  className="hidden lg:block absolute w-28 h-28 border-2 border-orange-500/70 bg-white/20 pointer-events-none"
                  style={{
                    left: `calc(${zoomPosition.x}% - 56px)`,
                    top: `calc(${zoomPosition.y}% - 56px)`,
                  }}
                />
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    {discount}% OFF
                  </span>
                )}
                {product.flashSaleProduct && (
                  <span className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Flash Sale
                  </span>
                )}
                {product.todayDeals && (
                  <span className="px-3 py-1.5 bg-purple-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    Today's Deal
                  </span>
                )}
                {product.specialProduct && (
                  <span className="px-3 py-1.5 bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    Special
                  </span>
                )}
              </div>

              {/* Product Code */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-600">
                {product.productCode}
              </div>
            </div>

            {/* Thumbnail Images */}
            {imageList.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imageList.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-white rounded-xl overflow-hidden aspect-square transition-all duration-300 border-2 ${
                      selectedImage === index
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={resolveImageUrl(image)}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-contain p-3"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            {zoomActive && (
              <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 aspect-square overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('${selectedImageUrl}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: "260%",
                  }}
                />
              </div>
            )}
            <div className={zoomActive ? "space-y-6 lg:hidden" : "space-y-6"}>
            {/* Brand */}
            {product.brand && (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                    {product.brand.name}
                  </span>
                </div>
              </div>
            )}

            {/* Product Name */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <button
                  type="button"
                  onClick={handleShareProduct}
                  className="shrink-0 h-11 w-11 rounded-full border border-orange-200 bg-orange-50 text-orange-600 shadow-sm hover:bg-orange-100 hover:border-orange-300 hover:shadow transition flex items-center justify-center"
                  title="Share product"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              {product.category && (
                <p className="text-sm text-gray-600">
                  Category: <span className="font-medium text-gray-900">{product.categoryName}</span>
                </p>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  Rs. {Number(product.sellPrice).toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {Number(product.actualPrice).toLocaleString("en-IN")}
                    </span>
                    <span className="px-2 py-1 bg-green-500 text-white text-sm font-bold rounded">
                      Save Rs. {(Number(product.actualPrice) - Number(product.sellPrice)).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">
                    {isLowStock ? `Only ${product.availableQuantity} left in stock!` : "In Stock"}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Delivery Info */}
            {product.deliveryTargetDays && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Fast Delivery</p>
                  <p className="text-xs text-blue-700">Delivered in {product.deliveryTargetDays} days</p>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {isInStock && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1, Math.min(val, Number(product.availableQuantity))));
                      }}
                      className="w-16 h-12 text-center border-x-2 border-gray-300 focus:outline-none font-semibold"
                      min="1"
                      max={product.availableQuantity}
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= Number(product.availableQuantity)}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Max: {product.availableQuantity} available
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addToCartLoading || buyNowLoading}
                className="w-full py-4 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-semibold text-lg hover:bg-gray-50 transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {addToCartLoading ? (
                  <>
                    <span className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : addedToCart ? (
                  <>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ADD TO CART
                  </>
                )}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!isInStock || buyNowLoading || addToCartLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold text-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {buyNowLoading ? (
                  <>
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    BUY IT NOW
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <p className="text-xs font-medium text-gray-700">Gift Wrap Available</p>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="space-y-1">
            {/* Description */}
            {product.description && (
              <>
                <button
                  onClick={() => setActiveTab(activeTab === "description" ? "" : "description")}
                  className="w-full flex items-center justify-between py-5 border-b border-gray-200 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Description</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                      activeTab === "description" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeTab === "description" && (
                  <div className="py-6 px-4 text-gray-700 leading-relaxed animate-slideDown">
                    <p className="whitespace-pre-wrap">{product.description}</p>
                  </div>
                )}
              </>
            )}

            {/* Specifications */}
            {product.specifications && (
              <>
                <button
                  onClick={() => setActiveTab(activeTab === "specs" ? "" : "specs")}
                  className="w-full flex items-center justify-between py-5 border-b border-gray-200 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Technical Specifications</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                      activeTab === "specs" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeTab === "specs" && (
                  <div className="py-6 px-4 text-gray-700 animate-slideDown">
                    <p className="whitespace-pre-wrap">{product.specifications}</p>
                  </div>
                )}
              </>
            )}

            {/* Packaging */}
            {product.packaging && (
              <>
                <button
                  onClick={() => setActiveTab(activeTab === "packaging" ? "" : "packaging")}
                  className="w-full flex items-center justify-between py-5 border-b border-gray-200 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Packaging Information</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                      activeTab === "packaging" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeTab === "packaging" && (
                  <div className="py-6 px-4 text-gray-700 animate-slideDown">
                    <p className="whitespace-pre-wrap">{product.packaging}</p>
                  </div>
                )}
              </>
            )}

            {/* Warranty */}
            {product.warranty && (
              <>
                <button
                  onClick={() => setActiveTab(activeTab === "warranty" ? "" : "warranty")}
                  className="w-full flex items-center justify-between py-5 border-b border-gray-200 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Warranty Information</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                      activeTab === "warranty" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeTab === "warranty" && (
                  <div className="py-6 px-4 text-gray-700 animate-slideDown">
                    <p className="whitespace-pre-wrap">{product.warranty}</p>
                  </div>
                )}
              </>
            )}

            {/* Shipping */}
            <button
              onClick={() => setActiveTab(activeTab === "shipping" ? "" : "shipping")}
              className="w-full flex items-center justify-between py-5 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">Shipping & Delivery</span>
              </div>
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                  activeTab === "shipping" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeTab === "shipping" && (
              <div className="py-6 px-4 text-gray-700 space-y-4 animate-slideDown">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">We offer free shipping across kathmandu valley.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Expected Delivery</p>
                    <p className="text-sm text-gray-600">
                      Your order will be delivered within {product.deliveryTargetDays} days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">Orders are typically processed within 1-2 business days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <button
              onClick={() => setActiveTab(activeTab === "reviews" ? "" : "reviews")}
              className="w-full flex items-center justify-between py-5 border-t border-gray-200 text-left group hover:bg-gray-50 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">
                  Reviews ({product.reviews?.length || 0})
                </span>
              </div>
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                  activeTab === "reviews" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeTab === "reviews" && (
              <div className="py-6 px-4 animate-slideDown">
                {(product.reviews || []).length === 0 ? (
                  <p className="text-gray-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((review) => {
                      const rating = Math.max(1, Math.min(5, Number(review.rating || 0)));
                      const name = review.name || "Customer";
                      const avatar = name.trim().charAt(0).toUpperCase() || "C";
                      return (
                        <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                              {avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900">{name}</p>
                                <span className="text-xs text-gray-500">
                                  {review.createdAt ? formatDate(review.createdAt) : ""}
                                </span>
                              </div>
                              {renderStars(rating)}
                              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{review.review}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProduct
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
