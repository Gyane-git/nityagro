// "use client";

// import Image from "next/image";

// export default function ShopCTABanner() {
//   return (
//     <section className="w-full max-w-335 mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20">
//       <div
//         className="relative grid grid-cols-1 lg:grid-cols-2 items-center"
//         style={{
//           minHeight: "238px",
//           borderRadius: "24px",
//           backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/bg.png')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           border: "1px solid rgba(255,255,255,0.30)",
//           padding: "24px",
//         }}
//       >
//         {/* LEFT CONTENT */}
//         <div className="relative z-10 flex flex-col gap-3 w-full max-w-138.75">
//           <h2 className="font-bold text-[#1e5631] leading-snug text-xl sm:text-2xl lg:text-[28px]">
//             Get your daily needs from our shop
//           </h2>

//           <p className="text-sm sm:text-[15px] text-[#1e5631] font-semibold">
//             Start your daily shopping with Nityagro
//           </p>

//           {/* Input + Button */}
//           <div className="flex items-center mt-2 bg-white border border-gray-200 rounded-full overflow-hidden w-full max-w-92.5 shadow-sm">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-1 px-4 sm:px-5 py-2.5 text-sm text-gray-500 bg-transparent outline-none placeholder:text-gray-400 min-w-0"
//             />
//             <button className="px-4 sm:px-6 py-2.5 bg-[#2d6b3f] hover:bg-[#245a34] active:bg-[#1e5631] text-white text-sm sm:text-base font-semibold rounded-full whitespace-nowrap">
//               Subscribe
//             </button>
//           </div>
//         </div>

//         {/* RIGHT IMAGE AREA */}
//         <div className="relative hidden lg:block w-full h-75">
//           {/* img2 (back) */}
//           <div className="absolute right-[20%] top-[-30%] w-55 h-90">
//             <Image
//               src="/b2.png"
//               alt="Nityagro products secondary"
//               fill
//               className="object-contain scale-x-[-1]"
//             />
//           </div>

//           {/* img1 (front) */}
//           <div className="absolute right-[5%] top-[-10%] w-55 h-65">
//             <Image
//               src="/b1.png"
//               alt="Nityagro products showcase"
//               fill
//               className="object-contain"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

export default function ShopCTABanner() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 lg:pt-12">
      <div
        className="
           relative overflow-visible
           grid grid-cols-1 lg:grid-cols-2
           items-center
           h-[224px] sm:h-[224px]
           rounded-[24px]
           px-6 sm:px-10 lg:px-14
         "
        style={{
          backgroundImage: `
      linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)),
      url('/bg.png')
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      >
        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-[555px]">
          <h2
            className="text-[#1e5631] font-bold leading-[1.2] text-[24px] sm:text-[24 px]"
            style={{ fontFamily: "Roboto Slab, serif" }}
          >
            Get your daily needs from our shop
          </h2>

          <p className="mt-3 text-[#356344] text-[15px] font-normal">
            Start your daily shopping with Nityagro
          </p>

          {/* INPUT */}
          <div className="mt-6 flex text-gray-700 items-center bg-white rounded-full overflow-hidden shadow-sm border border-gray-200 max-w-[300px] h-[36px]">
            <input
              type="email"
              placeholder="Your email address"
              className="
                flex-1 h-full
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
              w-[170px]
              h-[36px]
              rounded-full
              bg-[#2d6b3f]
              hover:bg-[#245a34]
              text-white
              text-xs
              font-normal
              tracking-wider
              transition
              flex items-center justify-center
            "
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGES */}
        <div className="relative hidden lg:block h-full me-5">
          {/* BACK IMAGE (b2) - FULL VISIBILITY */}
          <div className="absolute right-[165px] top-[-270px] w-[300px] h-[600px] z-10 overflow-visible">
            <Image
              src="/b2.png"
              alt="Products back"
              fill
              className="object-contain scale-x-[-1]"
            />
          </div>

          {/* FRONT IMAGE WRAPPER (b1) - CLIPPED BY ITS BOX */}
          <div className="absolute right-[-55px] top-[-115px] w-[300px] h-[360px] z-0 overflow-hidden">
            <Image
              src="/b1.png"
              alt="Products front"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}