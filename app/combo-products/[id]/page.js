import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import Banner from "@/app/products/[id]/Banner";
import ProductImageGallery from "@/app/products/[id]/Productimagegallery";
import DeliveryCard from "@/app/products/[id]/Deliverycard";
import FrequentlyBoughtTogether from "@/app/products/[id]/Frequentlyboughttogether";
import ComboProductInfo from "./ComboProductInfo";
import { getComboAvailability, resolveComboItems } from "@/lib/comboItems";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveImages(combo) {
  const images = Array.isArray(combo.productImages) ? combo.productImages : [];
  return images
    .map((image) => image.imageUrl)
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

function Breadcrumb({ comboName }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 py-3">
      <Link href="/" className="hover:text-[#00462C] transition-colors">Home</Link>
      <span className="text-gray-400">›</span>
      <Link href="/combo-products" className="hover:text-[#00462C] transition-colors">Combo Products</Link>
      <span className="text-gray-400">›</span>
      <span className="font-semibold text-gray-800">{comboName}</span>
    </nav>
  );
}

export default async function ComboProductDetailPage({ params }) {
  noStore();
  const { id } = await params;
  if (!/^\d+$/.test(String(id))) notFound();

  const combo = await prisma.comboProduct.findUnique({
    where: { comboProductId: BigInt(id) },
    include: {
      productImages: {
        orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!combo || combo.comboStatus === false) notFound();

  const safeCombo = JSON.parse(
    JSON.stringify(combo, (_, value) => (typeof value === "bigint" ? value.toString() : value)),
  );
  const images = resolveImages(safeCombo);
  const comboItems = await resolveComboItems(prisma, safeCombo.productCodes);
  const comboAvailability = getComboAvailability(comboItems);
  const normalizedCombo = {
    id: Number(safeCombo.comboProductId),
    code: safeCombo.comboCode || "",
    name: safeCombo.comboName || "Combo Product",
    description: safeCombo.comboDescription || "",
    productCodes: safeCombo.productCodes || "",
    productPrices: Number(safeCombo.productPrices || 0),
    comboPrice: Number(safeCombo.comboPrice || 0),
    discount: Number(safeCombo.discount || 0),
    image: images[0] || "/no-image.png",
    images: images.length ? images : ["/no-image.png"],
    comboItems,
    ...comboAvailability,
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 py-4 md:py-6" style={{ maxWidth: "1440px" }}>
        <Banner />
        <Breadcrumb comboName={normalizedCombo.name} />

        <div className="flex flex-col lg:flex-row gap-6 items-start mt-2 mb-8">
          <ProductImageGallery images={normalizedCombo.images} />
          <ComboProductInfo combo={normalizedCombo} />
          <DeliveryCard deliveryTargetDays="3" />
        </div>

        <div className="border-t border-gray-200 my-10" />
        <section className="max-w-4xl">
          <h2 className="text-[#00462C] font-bold text-xl mb-3">Combo Description</h2>
          <p className="text-sm leading-7 text-gray-600">{normalizedCombo.description || "This combo pack is specially curated by Nityagro for better value and convenience."}</p>
        </section>

        <div className="border-t border-gray-200 my-10" />
        <FrequentlyBoughtTogether />

        <div className="h-16" />
      </div>
    </main>
  );
}
