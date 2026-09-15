"use client";

import { useState } from "react";
import ProductImageGallery from "./Productimagegallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetailMedia({ product }) {
  const [variantImage, setVariantImage] = useState("");

  const images = variantImage
    ? [variantImage, ...(product.images || []).filter((image) => image !== variantImage)]
    : product.images;

  return (
    <>
      <ProductImageGallery key={variantImage || "base"} images={images} />
      <ProductInfo product={product} onVariantImageChange={setVariantImage} />
    </>
  );
}
