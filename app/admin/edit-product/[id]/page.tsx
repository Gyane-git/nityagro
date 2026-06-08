"use client";
import { apiGetRequest, apiPutRequest } from "@/apihelper/apiHelper";
import { ChevronDown, ChevronUp, FileText, ImageIcon, Info, Package, Plus, Save, Tag, Trash2, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  images?: Array<{ imageUrl?: string | null; url?: string | null }>;
  productImages?: Array<string | { imageUrl?: string | null; url?: string | null }> | string;
  galleryImages?: string[];
}
type ExpandedSections = {
  basic: boolean;
  flags: boolean;
  variants: boolean;
  description: boolean;
  media: boolean;
  pricing: boolean;
  delivery: boolean;
};

type SectionKey = keyof ExpandedSections;

type SectionHeaderProps = {
  title: string;
  icon: React.ElementType;
  sectionKey: SectionKey;
  color?: string;
};
export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [products, setProducts] = useState<Products>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    basic: true,
    flags: true,
    variants: true,
    description: true,
    media: true,
    pricing: true,
    delivery: true,
  });
  const [activeDescTab, setActiveDescTab] = useState("productDetails");

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  type ProductForm = {
    productCode: string;
    productName: string;

    categoryId: string;
    categoryName: string;

    brandId: string;
    brandName: string;

    delivaryTargetDays: string;
    returnDays: string;

    productStatus: boolean;
    flashSale: boolean;
    specialOffer: boolean;

    weeklyProduct: boolean;
    todayDeals: boolean;
    requiresSerial: boolean;
    warrantyAvailable: boolean;

    actualPrice: string;
    SellingPrice: string;

    availableQuantity: string;
    stockQuantity: string;

    productDescription: string;
    productVariation: string;

    nutritionalInformation: string;

    cookingDescription: string;
    cookingRecommendedUses: string;

    storageInstruction: string;

    packaging: string;
    warranty: string;
    warrantyDays: string;

    productImage: File | null;
    productImages: File[];
    productCatalog: File | null;
  };

  const defaultForm: ProductForm = {
    productCode: "",
    productName: "",

    categoryId: "",
    categoryName: "",

    brandId: "",
    brandName: "",

    delivaryTargetDays: "",
    returnDays: "7",

    productStatus: true,
    flashSale: false,
    specialOffer: false,

    weeklyProduct: false,
    todayDeals: false,
    requiresSerial: true,
    warrantyAvailable: false,

    actualPrice: "",
    SellingPrice: "",

    availableQuantity: "",
    stockQuantity: "",

    productDescription: "",
    productVariation: "",

    nutritionalInformation: "",

    cookingDescription: "",
    cookingRecommendedUses: "",

    storageInstruction: "",

    packaging: "",
    warranty: "",
    warrantyDays: "",

    productImage: null,
    productImages: [],
    productCatalog: null,
  };

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? url : `/${url}`;
  };
  const [formData, setFormData] = useState<ProductForm>(defaultForm);
  // Fetch Products
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchProductById = async () => {
      setLoading(true);
      try {
        const response = await apiGetRequest<Products>(`/products/${productId}`);
        if (response.success) {
          setProducts(response.data);
          setPreviewImage(resolveImageUrl(response.data?.pImage));

          const rawImages =
            response.data?.galleryImages ||
            response.data?.productImages ||
            response.data?.images;

          let images: string[] = [];

          if (Array.isArray(rawImages)) {
            images = rawImages
              .map((img: any) =>
                typeof img === "string" ? img : img?.imageUrl || img?.url || "",
              )
              .filter(Boolean);
          } else if (typeof rawImages === "string") {
            images = rawImages.split(",").filter(Boolean);
          }

          const normalized = images.map((img: any) => resolveImageUrl(typeof img === "string" ? img : img?.url));

          setExistingGalleryImages(images);
          setGalleryPreview(normalized);

          setFormData((prev) => ({
            ...prev,
            productCode: response.data?.productCode || "",
            productName: response.data?.subGroupName || "",
            categoryId: response.data?.categoryId || "",
            productDescription: response.data?.productDescription || "",
            nutritionalInformation: response.data?.nutritionInfo || "",
            cookingDescription: response.data?.cookingInstruction || "",
            storageInstruction: response.data?.storageInstruction || "",
            productVariation: response.data?.productVariation || "",
            delivaryTargetDays:
              response.data?.deliveryTargetDays === null ||
              response.data?.deliveryTargetDays === undefined
                ? ""
                : String(response.data.deliveryTargetDays),
            actualPrice: String(response.data?.actualPrice) || "0.0",
            SellingPrice: String(response.data?.sellingPrice) || "0.0",
            availableQuantity: String(response.data?.availableQuantity) ?? "0.0",
            stockQuantity: String(response.data?.stockQuantity ?? ""),
            productStatus: response.data?.productStatus || false,
            specialOffer: Boolean(response.data?.specialOffer),
            productImage: null,
          }));
        } else {
          toast.error(response.message || "Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProductById();
  }, []);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProductImageFile(file);
    setPreviewImage(URL.createObjectURL(file));

    toast.success("Main product image selected");
  };

  const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files], // ✅ append instead of replace
    }));

    setGalleryFiles((prev) => [...prev, ...files]); // optional but consistent

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setGalleryPreview((prev) => [...prev, ...newPreviews]);

    toast.success(`${files.length} image(s) added`);
  };

  const handleReset = () => {
    setActiveDescTab("productDetails");
    toast("Description tab reset");
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.productCode) {
      toast.error("Product code is missing. Please reload the page.");
      return;
    }

    const saveToastId = toast.loading("Updating product...");
    setSaving(true);

    const data = new FormData();

    data.append("productCode", formData.productCode);
    data.append("productDescription", formData.productDescription);
    data.append("nutritionalInformation", formData.nutritionalInformation);
    data.append("cookingDescription", formData.cookingDescription);
    data.append("storageInstruction", formData.storageInstruction);
    data.append("productStatus", String(formData.productStatus));
    data.append("specialOffer", String(formData.specialOffer));
    data.append("subGroupName", formData.productName);
    data.append("delivaryTargetDays", formData.delivaryTargetDays);

    if (productImageFile) {
      data.append("productImage", productImageFile);
    }

    existingGalleryImages.forEach((img) => {
      data.append("existingImages", img);
    });

    galleryFiles.forEach((file) => {
      data.append("productImages", file);
    });

    try {
      const response = await apiPutRequest("/products", data);
      if (response.success) {
        toast.success(response.message || "Product updated successfully", {
          id: saveToastId,
        });
        router.push("/admin/product-list");
      } else {
        toast.error(response.message || "Product update failed", {
          id: saveToastId,
        });
      }
    } catch (e) {
      toast.error("Product update failed", { id: saveToastId });
    } finally {
      setSaving(false);
    }
  };
  // Shared style tokens ──
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";
  const selectClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white";
  const textareaClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white placeholder-gray-400";
  const cardClass = "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden";

  const SectionHeader = ({ title, icon: Icon, sectionKey, color = "blue" }: SectionHeaderProps) => (
    <button type="button" onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors rounded-t-xl">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${color}-600`} />
        </div>

        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>

      {expandedSections[sectionKey] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Update New Product</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleSubmit} disabled={saving || loading} className={`px-5 py-2 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm ${saving || loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─────────── LEFT COLUMN ─────────── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Information */}
              <div className={cardClass}>
                <SectionHeader title="Basic Information" icon={Package} sectionKey="basic" />
                {expandedSections.basic && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* model: productCode */}

                      {/* model: productName */}
                      <div>
                        <label className={labelClass}>
                          Product Code <span className="text-red-500">*</span>
                        </label>
                        <input readOnly type="text" name="productCode" value={formData.productCode} onChange={(e) => ({})} placeholder="e.g. productCode" className={inputClass} />
                      </div>

                      {/* to be added to model */}
                      <div>
                        <label className={labelClass}>
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input readOnly type="text" name="productName" value={formData.productName} onChange={(e) => ({})} placeholder="e.g. Red Chilli Powder" className={inputClass} />
                      </div>

                      {/* model: productStatus (Boolean) */}
                      <div>
                        <label className={labelClass}>Status</label>
                        <select
                          name="productStatus"
                          value={formData.productStatus ? "true" : "false"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              productStatus: e.target.value === "true",
                            }))
                          }
                          className={selectClass}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>

                      {/* model: delivaryTargetDays — typo preserved to match Prisma */}
                      <div>
                        <label className={labelClass}>Delivery Target Days</label>
                        <input
                          type="number"
                          name="delivaryTargetDays"
                          value={formData.delivaryTargetDays}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              delivaryTargetDays: e.target.value,
                            }))
                          }
                          //  onChange={handleInputChange}
                          placeholder="e.g. 3"
                          min="0"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Best Seller</label>
                        <input
                          type="checkbox"
                          name="bestSeller"
                          checked={formData.specialOffer}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specialOffer: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Descriptions & Specs */}
              <div className={cardClass}>
                <SectionHeader title="Descriptions & Specifications" icon={FileText} sectionKey="description" color="orange" />
                {expandedSections.description && (
                  <div className="border-t border-gray-100">
                    <div className="flex border-b border-gray-200 px-5 gap-1 overflow-x-auto">
                      {[
                        { key: "productDetails", label: "Product Details" },
                        {
                          key: "nutritional",
                          label: "Nutritional Information",
                        },
                        {
                          key: "cooking",
                          label: "Cooking Instructions / Usage",
                        },
                        { key: "storage", label: "Storage Instructions" },
                      ].map((t) => (
                        <button key={t.key} type="button" onClick={() => setActiveDescTab(t.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeDescTab === t.key ? "border-green-700 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Product Details → productDescription + productVariation + packaging + warranty */}
                      {activeDescTab === "productDetails" && (
                        <div className="space-y-4">
                          {/* model: productDescription */}
                          <div>
                            <label className={labelClass}>Product Description</label>
                            <textarea
                              name="productDescription"
                              value={formData.productDescription}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  productDescription: e.target.value,
                                }))
                              }
                              rows={5}
                              placeholder="Our products are crafted with a deep respect for tradition and purity..."
                              className={textareaClass}
                            />
                            <p className="text-xs text-gray-400 mt-1">Shown as paragraphs on the product page</p>
                          </div>
                        </div>
                      )}

                      {/* Nutritional → model: nutritionInfo (JSON.stringify) */}
                      {activeDescTab === "nutritional" && (
                        <div className="space-y-4">
                          {/* model: productDescription */}
                          <div>
                            <label className={labelClass}>Nutritional Information</label>
                            <textarea
                              name="nutritionalInformation"
                              value={formData.nutritionalInformation}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nutritionalInformation: e.target.value,
                                }))
                              }
                              rows={5}
                              placeholder="Our products are crafted with a deep respect for tradition and purity..."
                              className={textareaClass}
                            />
                            <p className="text-xs text-gray-400 mt-1">Shown as paragraphs on the nutirition page</p>
                          </div>
                        </div>
                      )}

                      {/* Cooking → model: cookingInstruction (merged on submit) */}
                      {activeDescTab === "cooking" && (
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Cooking Instructions / Usage</label>

                            <textarea
                              name="cookingDescription"
                              value={formData.cookingDescription}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  cookingDescription: e.target.value,
                                }))
                              }
                              rows={4}
                              placeholder="Yellow Mustard Oil has a distinctive pungent aroma and a high smoke point of around 480°F (250°C), making it ideal for high-heat cooking..."
                              className={textareaClass}
                            />
                          </div>
                        </div>
                      )}

                      {/* Storage → model: storageInstruction */}
                      {activeDescTab === "storage" && (
                        <div className="space-y-3">
                          <div>
                            <label className={labelClass}>Storage Instructions</label>

                            <textarea
                              name="storageInstruction"
                              value={formData.storageInstruction}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  storageInstruction: e.target.value,
                                }))
                              }
                              rows={7}
                              placeholder={"Store in a cool, dry place away from direct sunlight\nKeep the bottle tightly sealed after each use\nDo not store near heat sources or open flames\nBest used within 12 months of manufacture date"}
                              className={textareaClass}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─────────── RIGHT COLUMN ─────────── */}
            <div className="space-y-5">
              {/* Pricing & Inventory */}
              <div className={cardClass}>
                <SectionHeader title="Pricing & Inventory" icon={Tag} sectionKey="pricing" color="green" />
                {expandedSections.pricing && (
                  <div className="px-5 pb-5 border-t border-gray-100 space-y-3 mt-4">
                    {/* model: actualPrice */}
                    <div className="mt-2">
                      <label className={labelClass}>Actual Price (NRP)</label>
                      <input readOnly type="number" name="actualPrice" value={formData.actualPrice} onChange={handleInputChange} placeholder="0.00" min="0" className={inputClass} />
                    </div>

                    {/* model: SellingPrice — capital S matches Prisma schema */}
                    <div>
                      <label className={labelClass}>Selling Price (NRP)</label>
                      <input readOnly type="number" name="SellingPrice" value={formData.SellingPrice} onChange={handleInputChange} placeholder="0.00" min="0" className={inputClass} />
                    </div>

                    {formData.actualPrice && formData.SellingPrice && Number(formData.SellingPrice) < Number(formData.actualPrice) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700">
                        Discount:{" "}
                        {/* {Math.round(
                            ((formData.actualPrice - formData.SellingPrice) /
                              formData.actualPrice) *
                              100,
                          )} */}
                        % off
                      </div>
                    )}

                    {/* model: availableQuantity */}
                    <div>
                      <label className={labelClass}>Available Quantity</label>
                      <input readOnly type="number" name="availableQuantity" value={formData.availableQuantity} onChange={handleInputChange} placeholder="0" min="0" className={inputClass} />
                    </div>
                  </div>
                )}
              </div>

              {/* Images & Media */}
              <div className={cardClass}>
                <SectionHeader title="Images & Media" icon={ImageIcon} sectionKey="media" color="pink" />
                {expandedSections.media && (
                  <div className="px-5 pb-5 border-t border-gray-100 space-y-4 mt-4">
                    {/* model: productImage */}
                    <div>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                          onError={(event) => {
                            event.currentTarget.src = "/no-image.png";
                          }}
                        />
                      )}
                      <label htmlFor="productImage" className={labelClass}>
                        {" "}
                        Main Image
                      </label>
                      <input type="file" id="productImage" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                      <label htmlFor="productImage" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${formData.productImage ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                        {formData.productImage ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <ImageIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700 font-medium text-center truncate max-w-full px-2">{/* {formData.productImage.name} */}</p>
                            <p className="text-xs text-green-500 mt-1">Click to change</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Upload Main Image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* to be added to model: gallery images */}
                    <div>
                      <label className={labelClass}>Product Gallery</label>
                      <input type="file" id="productImages" multiple accept="image/*" onChange={handleMultipleImageChange} className="hidden" />

                      <label htmlFor="productImages" className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${formData.productImages.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                        {/* Gallery Preview */}
                        {galleryPreview.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {galleryPreview.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`gallery-${index}`}
                                className="w-full h-20 object-cover rounded border"
                                onError={(event) => {
                                  event.currentTarget.src = "/no-image.png";
                                }}
                              />
                            ))}
                          </div>
                        )}
                        {existingGalleryImages.length + galleryFiles.length > 0 ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <ImageIcon className="w-5 h-5 text-green-600" />
                            </div>

                            <p className="text-sm text-green-700 font-medium">
                              {existingGalleryImages.length + galleryFiles.length} image
                              {existingGalleryImages.length + galleryFiles.length > 1 ? "s" : ""} selected
                            </p>

                            <p className="text-xs text-green-500 mt-1">Click to change</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Upload Gallery Images</p>
                            <p className="text-xs text-gray-400 mt-1">Select multiple images</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
