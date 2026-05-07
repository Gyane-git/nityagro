"use client";

import Image from "next/image";

export default function ShopCTABanner() {
  return (
    <section className="w-full max-w-340 mx-auto px-4 sm:px-6 pt-19">
      <div
        className="relative flex items-center"
        style={{
          minHeight: "238px",
          borderRadius: "24px",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255,255,255,0.30)",
          padding: "41px",
          gap: "10px",
          overflow: "visible",
        }}
      >
        <div
          className="relative z-10 flex flex-col gap-3"
          style={{ width: "555px", maxWidth: "555px" }}
        >
          <h2
            className="font-bold text-[#1e5631] leading-snug"
            style={{ fontSize: "28px" }}
          >
            Get your daily needs from our shop
          </h2>

          <p className="text-[15px] text-[#1e5631] font-semibold">
            Start your daily shopping with Nityagro
          </p>

          {/* One combined pill: input + button inside */}
          <div
            className="flex items-center mt-1 bg-white border border-gray-200 rounded-full overflow-hidden"
            style={{
              width: "370px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-2.5 text-sm text-gray-400 bg-transparent outline-none placeholder:text-gray-400 border-0 min-w-0"
            />
            <button className=" px-6 py-2.25 bg-[#2d6b3f] hover:bg-[#245a34] active:bg-[#1e5631] text-white text-base font-semibold rounded-full transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* img1 — b1.png */}
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{
            width: "325.55px",
            height: "289px",
            top: "-79px",
            right: "33.45px",
          }}
        >
          <Image
            src="/b1.png"
            alt="Nityagro products showcase"
            fill
            className="object-contain"
          />
        </div>

        {/* img2 — b2.png */}
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{
            width: "325.55px",
            height: "479.74px",
            top: "-212px",
            right: "269.45px",
          }}
        >
          <Image
            src="/b2.png"
            alt="Nityagro products secondary"
            fill
            className="object-contain"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      </div>
    </section>
  );
}