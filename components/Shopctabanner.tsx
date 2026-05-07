"use client";

import Image from "next/image";

// Replace with your actual image imports once you have the files:
// import productsMain from "@/assets/banner/products-main.png";
// import productsSecondary from "@/assets/banner/products-secondary.png";

export default function ShopCTABanner() {
  return (
    /**
     * Outer wrapper: pt-[70px] gives headroom for the product images
     * that overflow 69px above the banner's top edge.
     */
    <section className="w-full max-w-340 mx-auto px-4 sm:px-6 pt-17.5">
      {/**
       * ── Banner container — exact Figma values ──────────────────────────
       *   width: 1360px  |  height: 238px
       *   border-radius: 24px
       *   background: #CDE6D8
       *   border: 1px solid rgba(255,255,255,0.30)  ← #FFFFFF4D
       *   padding: 41px  |  gap: 10px
       *   overflow: visible so images can bleed above
       */}
      <div
        className="relative flex items-center"
        style={{
          minHeight: "238px",
          borderRadius: "24px",
          background: "#CDE6D8",
          border: "1px solid rgba(255,255,255,0.30)",
          padding: "41px",
          gap: "10px",
          overflow: "visible",
        }}
      >
        {/* ── Left: text + email form ────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col gap-4 max-w-115">
          {/* Heading with dashed underline */}
          <h2
            className="text-2xl sm:text-[28px] font-bold text-[#1e5631] leading-snug"
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              textDecorationColor: "#2d7a4f",
              textUnderlineOffset: "7px",
            }}
          >
            Get your daily needs from our shop
          </h2>

          <p className="text-sm sm:text-[15px] text-gray-700 font-medium">
            Start your daily shopping with Nityagro
          </p>

          {/* Pill input + button */}
          <div className="flex items-center mt-1 max-w-92.5 shadow-sm">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.75 text-sm text-gray-600 bg-white rounded-l-full outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#2d7a4f]/30 border-0 min-w-0"
            />
            <button className="px-6 py-2.75 bg-[#2d6b3f] hover:bg-[#245a34] active:bg-[#1e5631] text-white text-sm font-semibold rounded-r-full transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Right: two product images ──────────────────────────────────── */}

        {/**
         * SECONDARY image — left of the pair
         *   In Figma: left ~765px from section left edge
         *   angle: -180deg → horizontally flipped (scaleX(-1))
         *   Positioned: right: 310px so it sits just left of the main image
         *   Size: slightly narrower than main
         */}
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{
            width: "280px",
            height: "289.74px",
            top: "-69px",
            right: "308px",
          }}
        >
          {/**
           * When you have the image file, replace <img> with:
           *
           * import Image from "next/image";
           * import productsSecondary from "@/assets/banner/products-secondary.png";
           *
           * <Image
           *   src={productsSecondary}
           *   alt="Nityagro products secondary"
           *   fill
           *   className="object-contain object-bottom"
           *   style={{ transform: "scaleX(-1)" }}
           * />
           */}
          <Image
            width={280}
            height={289.74}
            src="/b1.png"
            alt="Nityagro products"
            className="w-full h-full object-contain object-bottom"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/**
         * MAIN image — right of the pair (highlighted blue box in Figma)
         *   Figma: width 325.55px | height 289.74px | top: -69px
         *   Anchored to the right edge of the banner
         */}
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{
            width: "325.55px",
            height: "289.74px",
            top: "-69px",
            right: "0px",
          }}
        >
          {/**
           * When you have the image file, replace <img> with:
           *
           * import Image from "next/image";
           * import productsMain from "@/assets/banner/products-main.png";
           *
           * <Image
           *   src={productsMain}
           *   alt="Nityagro products showcase"
           *   fill
           *   className="object-contain object-bottom"
           * />
           */}
          <Image
            width={325.55}
            height={289.74}
            src="/b.png"
            alt="Nityagro products showcase"
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
