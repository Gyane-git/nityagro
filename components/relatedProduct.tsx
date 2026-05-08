"use client";

import Link from "next/link";
import { ALL_PRODUCTS } from "@/app/products/productsData";

type RelatedProductProps = {
  categoryId?: string;
  currentProductId?: string;
};

export default function RelatedProduct({ currentProductId }: RelatedProductProps) {
  const items = ALL_PRODUCTS.filter(
    (item) => String(item.id) !== String(currentProductId),
  ).slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h3 className="mb-4 text-xl font-bold text-gray-900">Related Products</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="rounded-lg border border-gray-200 bg-white p-3 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-gray-800">{item.name}</p>
            <p className="mt-1 text-sm text-[#00462C]">NPR {item.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

