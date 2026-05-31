"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full rounnded-lg overflow-hidden" style={{ borderRadius: "0px" }}>
      {/* Responsive height */}
      <div className="relative w-full rounded-lg h-[140px] sm:h-[180px] md:h-[220px] lg:h-[260px] xl:h-[300px]">
        {/* Background image */}
        <Image src="/banner1.jpg" alt="Nityagro Banner" fill className="object-cover rounded-md object-center" priority />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}