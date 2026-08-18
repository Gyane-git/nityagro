// // components/Sustainability.jsx

// import { Mountain } from "lucide-react";

// export default function Sustainability() {
//   const stats = [
//     {
//       value: "18–19 RPM",
//       label:
//         "Our mechanical wood press operates at approximately 18–19 RPM for slow, controlled oil extraction.",
//     },
//     {
//       value: "No Added Preservatives",
//       label: "Our products are made without added chemical preservatives.",
//     },
//     {
//       value: "Traditional Processing",
//       label:
//         "Our flours and spices are processed using traditional stone-based methods, including Jaato and Okhal.",
//     },
//     {
//       value: "Minimal Intervention",
//       label:
//         "We avoid unnecessary industrial processing and keep our methods as straightforward as possible.",
//     },
//   ];

//   return (
//     <section
//       className="w-full bg-[#f7f6f2] flex flex-col lg:flex-row items-center gap-10 sm:gap-14 lg:gap-20 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-50 py-12 sm:py-16 lg:py-20 min-h-fit lg:min-h-130"
//       style={{ fontFamily: "var(--font-jost)" }}
//     >
//       {/* LEFT */}
//       <div className="w-full lg:w-90 shrink -mt-10">
//         {/* Badge */}
//         <div className="inline-flex items-start gap-2 bg-[#f5e9cf] rounded-full px-4 py-1 mb-6 lg:mb-7">
//           <Mountain className="w-4 h-4 text-[#1A5C36]" />
//           <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A5C36]">
//             Sustainability
//           </span>
//         </div>

//         {/* Headline */}
//         <h2
//           className="text-[32px] sm:text-[34px] lg:text-[36px] font-semibold leading-[1.18] text-[#1A5C36] mb-5 lg:mb-7"
//           style={{ fontFamily: "var(--font-garamond)" }}
//         >
//           BECAUSE FOOD WAS NEVER MEANT TO BE{" "}
//           <span className="text-[#d4a82a]">FAST.</span>
//         </h2>

//         {/* Body */}
//         <p className="text-[15px] sm:text-[16px] font-light leading-[1.85] text-[#4F5F56] max-w-full lg:max-w-85">
//           Not everything from the past needs to be left behind. Traditional food
//           practices were shaped by patience, simplicity, and experience —
//           principles that still have meaning in the way we think about food
//           today.
//         </p>
//       </div>

//       {/* RIGHT: 2×2 grid */}
//       <div className="flex-1 w-full grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="bg-[#f0ede6] rounded-xl px-5 sm:px-6 lg:px-8 py-6 sm:py-7 lg:py-8"
//           >
//             <p
//               className="text-[30px] sm:text-[36px] lg:text-[44px] font-normal leading-none text-[#1F5131] mb-2 lg:mb-3"
//               style={{ fontFamily: "var(--font-garamond)" }}
//             >
//               {stat.value}
//             </p>
//             <p className="text-[11px] sm:text-[12px] lg:text-[13px] font-normal text-[#5A695F] leading-snug">
//               {stat.label}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// components/Sustainability.jsx

import { Mountain } from "lucide-react";

export default function Sustainability() {
  const stats = [
    {
      value: "18–19 RPM",
      label:
        "Our mechanical wood press operates at approximately 18–19 RPM for slow, controlled oil extraction.",
    },
    {
      value: "No Added Preservatives",
      label: "Our products are made without added chemical preservatives.",
    },
    {
      value: "Traditional Processing",
      label:
        "Our flours and spices are processed using traditional stone-based methods, including Jaato and Okhal.",
    },
    {
      value: "Minimal Intervention",
      label:
        "We avoid unnecessary industrial processing and keep our methods as straightforward as possible.",
    },
  ];

  return (
    <section
      className="w-full bg-[#f7f6f2] flex flex-col lg:flex-row items-center gap-10 sm:gap-14 lg:gap-20 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-50 py-12 sm:py-16 lg:py-20 min-h-fit lg:min-h-130"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* LEFT */}
      <div className="w-full lg:w-90 shrink-0 lg:-mt-10">
        {/* Badge */}
        <div className="inline-flex items-start gap-2 bg-[#f5e9cf] rounded-full px-4 py-1 mb-6 lg:mb-7">
          <Mountain className="w-4 h-4 text-[#1A5C36]" />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A5C36]">
            Sustainability
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold leading-[1.18] text-[#1A5C36] mb-5 lg:mb-7"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          BECAUSE FOOD WAS NEVER MEANT TO BE{" "}
          <span className="text-[#d4a82a]">FAST.</span>
        </h2>

        {/* Body */}
        <p className="text-[15px] sm:text-[16px] font-light leading-[1.85] text-[#4F5F56] max-w-full lg:max-w-85">
          Not everything from the past needs to be left behind. Traditional food
          practices were shaped by patience, simplicity, and experience —
          principles that still have meaning in the way we think about food
          today.
        </p>
      </div>

      {/* RIGHT: 2×2 grid */}
      <div className="flex-1 w-full min-w-0 grid grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 bg-[#f0ede6] rounded-xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8"
          >
            <p
              className="break-words hyphens-auto text-[20px] xs:text-[24px] sm:text-[32px] lg:text-[36px] font-normal leading-[1.05] text-[#1F5131] mb-1.5 sm:mb-2 lg:mb-3"
              style={{ fontFamily: "var(--font-garamond)" }}
            >
              {stat.value}
            </p>
            <p className="break-words text-[14px] lg:text-[18px] font-normal text-[#5A695F] leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
