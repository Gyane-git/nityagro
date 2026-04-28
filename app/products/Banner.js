"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "170px", borderRadius: "10px" }}
    >
      {/* Background image */}
      <Image
        src="/banner1.jpg"
        alt="Nityagro Banner"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      
    </div>
  );
}