"use client";

import Image from "next/image";

export default function Banner({ image = "/banner1.jpg", title = "All Products" }) {
  return (
    <div className="relative w-full aspect-3/1 sm:aspect-4/1 overflow-hidden rounded-lg transition-transform duration-300 ease-out hover:scale-101">
      <Image src={image || "/banner1.jpg"} alt={title ? `${title} banner` : "Nityagro Banner"} fill className="object-cover object-center" priority />
      {/* Overlay tint */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
        }}
      />
      {/* Content */}
    </div>
  );
}
