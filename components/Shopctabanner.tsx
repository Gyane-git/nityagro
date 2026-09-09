"use client";

import Image from "next/image";

export default function ShopCTABanner() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 lg:pt-12">
      <div
        className="
          relative
          overflow-visible
          grid grid-cols-1 lg:grid-cols-2
          items-center
          h-[224px]
          rounded-[24px]
          px-6 sm:px-10 lg:px-14
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.85),
              rgba(255,255,255,0.85)
            ),
            url('/bg.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      >
        {/* LEFT CONTENT */}
        <div className="relative z-20 max-w-[555px]">
          <h2
            className="
              text-[#1e5631]
              font-bold
              leading-[1.2]
              text-[24px]
            "
            style={{ fontFamily: "Roboto Slab, serif" }}
          >
            Get your daily needs from our shop
          </h2>

          <p className="mt-3 text-[#356344] text-[15px] font-normal">
            Start your daily shopping with Nityagro
          </p>

          {/* EMAIL INPUT */}
          <div
            className="
              mt-6
              flex
              items-center
              bg-white
              rounded-full
              overflow-hidden
              shadow-sm
              border border-gray-200
              max-w-[440px]
              h-[36px]
            "
          >
            <input
              type="email"
              placeholder="Your email address"
              className="
                flex-1
                h-full
                px-5
                text-[14px]
                font-normal
                bg-transparent
                outline-none
                placeholder:text-gray-400
              "
              style={{ fontFamily: "Roboto Slab, serif" }}
            />

            <button
              className="
                w-[165px]
                h-[36px]
                rounded-full
                bg-[#2d6b3f]
                hover:bg-[#245a34]
                text-white
                text-xs
                font-normal
                tracking-wider
                transition
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - SINGLE IMAGE */}
        <div
          className="
            absolute
            right-[-20px]
            top-[-70px]
            hidden
            lg:block
            w-[580px]
            h-[300px]
            z-10
            pointer-events-none
          "
        >
          <Image
            src="/public/allskuimage.png"
            alt="Nityagro products"
            fill
            priority
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
}