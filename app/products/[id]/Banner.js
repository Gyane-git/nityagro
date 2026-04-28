"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "200px", borderRadius: "0px" }}
    >
      {/* Background image */}
      <Image
        src="/banner1.jpg"
        alt="Nityagro Banner"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Left dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
        }}
      />

      {/* Content */}
     
     
    </div>
  );
}