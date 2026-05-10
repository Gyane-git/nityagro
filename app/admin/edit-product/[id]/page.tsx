"use client";
import { apiGetRequest, apiPutRequest } from "@/apihelper/apiHelper";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ImageIcon,
  Info,
  Package,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [products, setProducts] = useState<Products>();
  const [loading, setLoading] = useState(false);

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
  const [formData, setFormData] = useState<ProductForm>(defaultForm);
  // Fetch Products

  useEffect(() => {
    const fetchProductById = async () => {
      setLoading(true);
      try {
        const response = await apiGetRequest<Products>(
          `/products/${productId}`,
        );
        if (response.success) {
          setLoading(false);
          setProducts(response.data);

          setFormData((prev) => ({
            ...prev,
            productCode: response.data?.productCode || "",
            productName: response.data?.subGroupName || "",
            categoryId: response.data?.categoryId || "",
            actualPrice: String(response.data?.actualPrice) || "0.0",
            SellingPrice: String(response.data?.sellingPrice) || "0.0",
            availableQuantity:
              String(response.data?.availableQuantity) ?? "0.0",
            productStatus: response.data?.productStatus || false,
          }));
        }
      } catch (error) {
        console.error("Error fetching ledger:", error);
      }
    };
    fetchProductById();
  }, []);

  const handleMainImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  console.log("file:", file);

  if (!file) return;

   const data = new FormData();
  data.append("productImage", formData.productImage || "");
   alert(data.name);
  setFormData((prev) => ({
    ...prev,
    productImage: file,
  }));
};
  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // setFormData((prev) => ({ ...prev, productImages: files }));
  };
  const handleReset = () => {
    setActiveDescTab("productDetails");
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
// "productCode":"5",
//      "productDescription":"asdklfjsk",
//       "nutritionalInformation":"nuwer",
//       "cookingRecommendedUses":"askdfysukdf",
//       "storageInstruction":"asdkuhy",
//       "productStatus":false,
//       "deliveryTargetDays":2
  const handleSubmit = async () => {
    console.log(JSON.stringify(formData));

    try{
      const response = await apiPutRequest("/products",formData);
      if(response.success){
       alert(response.message)
      }
    }catch(e){

    }

  };
  // Shared style tokens ──
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white placeholder-gray-400";
  const labelClass =
    "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";
  const selectClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white";
  const textareaClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white placeholder-gray-400";
  const cardClass =
    "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden";

  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
    color = "blue",
  }: SectionHeaderProps) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors rounded-t-xl"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${color}-600`} />
        </div>

        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>

      {expandedSections[sectionKey] ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Update New Product
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─────────── LEFT COLUMN ─────────── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Information */}
              <div className={cardClass}>
                <SectionHeader
                  title="Basic Information"
                  icon={Package}
                  sectionKey="basic"
                />
                {expandedSections.basic && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* model: productCode */}

                      {/* model: productName */}
                      <div>
                        <label className={labelClass}>
                          Product Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          readOnly
                          type="text"
                          name="productCode"
                          value={formData.productCode}
                          onChange={(e) => ({})}
                          placeholder="e.g. productCode"
                          className={inputClass}
                        />
                      </div>

                      {/* to be added to model */}
                      <div>
                        <label className={labelClass}>
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          readOnly
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={(e) => ({})}
                          placeholder="e.g. Red Chilli Powder"
                          className={inputClass}
                        />
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
                        <label className={labelClass}>
                          Delivery Target Days
                        </label>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Descriptions & Specs */}
              <div className={cardClass}>
                <SectionHeader
                  title="Descriptions & Specifications"
                  icon={FileText}
                  sectionKey="description"
                  color="orange"
                />
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
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setActiveDescTab(t.key)}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeDescTab === t.key
                              ? "border-green-700 text-green-700"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
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
                            <label className={labelClass}>
                              Product Description
                            </label>
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
                            <p className="text-xs text-gray-400 mt-1">
                              Shown as paragraphs on the product page
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Nutritional → model: nutritionInfo (JSON.stringify) */}
                      {activeDescTab === "nutritional" && (
                        <div className="space-y-4">
                          {/* model: productDescription */}
                          <div>
                            <label className={labelClass}>
                              Nutritional Information
                            </label>
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
                            <p className="text-xs text-gray-400 mt-1">
                              Shown as paragraphs on the nutirition page
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cooking → model: cookingInstruction (merged on submit) */}
                      {activeDescTab === "cooking" && (
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>
                              Cooking Instructions / Usage
                            </label>

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
                            <label className={labelClass}>
                              Storage Instructions
                            </label>

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
                              placeholder={
                                "Store in a cool, dry place away from direct sunlight\nKeep the bottle tightly sealed after each use\nDo not store near heat sources or open flames\nBest used within 12 months of manufacture date"
                              }
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
                <SectionHeader
                  title="Pricing & Inventory"
                  icon={Tag}
                  sectionKey="pricing"
                  color="green"
                />
                {expandedSections.pricing && (
                  <div className="px-5 pb-5 border-t border-gray-100 space-y-3 mt-4">
                    {/* model: actualPrice */}
                    <div className="mt-2">
                      <label className={labelClass}>Actual Price (NRP)</label>
                      <input
                        readOnly
                        type="number"
                        name="actualPrice"
                        value={formData.actualPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        className={inputClass}
                      />
                    </div>

                    {/* model: SellingPrice — capital S matches Prisma schema */}
                    <div>
                      <label className={labelClass}>Selling Price (NRP)</label>
                      <input
                        readOnly
                        type="number"
                        name="SellingPrice"
                        value={formData.SellingPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        className={inputClass}
                      />
                    </div>

                    {formData.actualPrice &&
                      formData.SellingPrice &&
                      Number(formData.SellingPrice) <
                        Number(formData.actualPrice) && (
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
                      <input
                        readOnly
                        type="number"
                        name="availableQuantity"
                        value={formData.availableQuantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Images & Media */}
              <div className={cardClass}>
                <SectionHeader
                  title="Images & Media"
                  icon={ImageIcon}
                  sectionKey="media"
                  color="pink"
                />
                {expandedSections.media && (
                  <div className="px-5 pb-5 border-t border-gray-100 space-y-4 mt-4">
                    {/* model: productImage */}
                    <div>
                      <label htmlFor="productImage" className={labelClass}>
                        {" "}
                        Main Image
                      </label>
                      <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="productImage"
                        className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${
                          formData.productImage
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {formData.productImage ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <ImageIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700 font-medium text-center truncate max-w-full px-2">
                              {/* {formData.productImage.name} */}
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                              Click to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                              Upload Main Image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* to be added to model: gallery images */}
                    <div>
                      <label className={labelClass}>Product Gallery</label>
                      <input
                        type="file"
                        id="productImages"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="productImages"
                        className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors ${
                          formData.productImages.length > 0
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {formData.productImages.length > 0 ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <ImageIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700 font-medium">
                              {formData.productImages.length} image
                              {formData.productImages.length > 1
                                ? "s"
                                : ""}{" "}
                              selected
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                              Click to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                              Upload Gallery Images
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Select multiple images
                            </p>
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
