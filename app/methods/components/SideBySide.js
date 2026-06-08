import Image from "next/image";

export default function SideBySide({ data }) {
  return (
    // <div className="w-full bg-white px-16 pt-16" style={{ fontFamily: "var(--font-jost)" }}>
    //   {/* Header */}
    //   <div className="text-center mb-14">
    //     <div className="inline-flex items-center gap-2 border border-[#d0ccc4] rounded-full px-4.5 py-2 mb-7">
    //       <span className="text-[13px] text-[#c9963a]">{data.icon}</span>
    //       <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#4a4a46]">{data.badge}</span>
    //     </div>

    //     <h2 className="text-[46px] font-bold leading-[1.2] text-[#1e5c34] mb-4">
    //       {data.headline1} <span className="text-[#c9963a] italic">{data.headlineGold}</span>
    //       <br />
    //       {data.headline2} <span className="text-[#b0b8b0] italic line-through">{data.headlineCross}</span>
    //     </h2>

    //     <p className="text-[15px] font-light text-[#5a5a55] leading-[1.7] max-w-130 mx-auto">{data.desc}</p>
    //   </div>

    //   {/* Cards */}
    //   <div className="flex relative rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(201,150,58,0.25)]">
    //     {/* LEFT */}
    //     <div className="flex-1 bg-[#1e5c34] flex flex-col">
    //       <div className="relative mx-10 mt-10 rounded-xl overflow-hidden">
    //         <Image src={data.image1} alt="Traditional" width={700} height={400} className="w-full h-80 object-cover" />
    //         <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#c9963a] rounded-full px-4.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1e1a0a]">
    //           {data.badge1Icon} {data.badge1}
    //         </span>
    //       </div>

    //       <div className="px-8 pt-6 pb-12">
    //         <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#c9963a] mb-2.5">{data.subtitle1}</p>
    //         <h3 className="text-[34px] font-bold text-white mb-3.5">{data.subHeading1}</h3>
    //         <p className="text-[14px] font-light leading-[1.8] text-white/78">{data.subDesc1}</p>
    //       </div>
    //     </div>

    //     {/* VS */}
    //     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14.5 h-14.5 bg-white rounded-full flex items-center justify-center border-[2.5px] border-[#c9963a] shadow">
    //       <span className="text-[18px] font-bold text-[#8B1A1A] font-serif">VS</span>
    //     </div>

    //     {/* RIGHT */}
    //     <div className="flex-1 bg-[#f0ece3] flex flex-col">
    //       <div className="relative mx-10 mt-10 rounded-xl overflow-hidden">
    //         <Image src={data.image2} alt="Industrial" width={700} height={400} className="w-full h-80 object-cover grayscale" />
    //         <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#2a4a36] rounded-full px-4.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white">
    //           {data.badge2Icon} {data.badge2}
    //         </span>
    //       </div>

    //       <div className="px-8 pt-6 pb-12">
    //         <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#7a8a7a] mb-2.5">The Factory Way</p>
    //         <h3 className="text-[34px] font-bold text-[#1e5c34] mb-3.5">{data.subHeading2}</h3>
    //         <p className="text-[14px] font-light leading-[1.8] text-[#4a4a46]">{data.subDesc2}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full bg-white px-5 sm:px-8 md:px-12 lg:px-16 pt-10 sm:pt-12 lg:pt-16" style={{ fontFamily: "var(--font-jost)" }}>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12 lg:mb-14">
        <div className="inline-flex items-center gap-2 border border-[#d0ccc4] rounded-full px-4 py-2 mb-5 lg:mb-7">
          <span className="text-[13px] text-[#c9963a]">{data.icon}</span>
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#4a4a46]">{data.badge}</span>
        </div>

        <h2 className="text-[26px] sm:text-[34px] lg:text-[46px] font-bold leading-[1.2] text-[#1e5c34] mb-3 lg:mb-4">
          {data.headline1} <span className="text-[#c9963a] italic">{data.headlineGold}</span>
          <br />
          {data.headline2} <span className="text-[#b0b8b0] italic line-through">{data.headlineCross}</span>
        </h2>

        <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-light text-[#5a5a55] leading-[1.7] max-w-full sm:max-w-lg lg:max-w-130 mx-auto">{data.desc}</p>
      </div>

      {/* Cards wrapper — position:relative so VS can anchor to it on sm+ */}
      <div className="relative">
        {/* ── MOBILE: stacked layout with VS overlapping the seam ── */}
        <div className="flex flex-col sm:hidden rounded-[16px] overflow-visible shadow-[0_10px_30px_rgba(201,150,58,0.25)]">
          {/* LEFT card (top on mobile) */}
          <div className="bg-[#1e5c34] flex flex-col rounded-t-[16px]">
            <div className="relative mx-5 mt-6 rounded-xl overflow-hidden">
              <Image src={data.image1} alt="Traditional" width={700} height={400} className="w-full h-52 object-cover" />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#c9963a] rounded-full px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#1e1a0a]">
                {data.badge1Icon} {data.badge1}
              </span>
            </div>
            <div className="px-5 pt-5 pb-10">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#c9963a] mb-2">{data.subtitle1}</p>
              <h3 className="text-[22px] font-bold text-white mb-2.5">{data.subHeading1}</h3>
              <p className="text-[13px] font-light leading-[1.8] text-white/78">{data.subDesc1}</p>
            </div>
          </div>

          {/* VS divider — overlaps both cards */}
          <div className="relative z-10 flex items-center justify-center -my-5">
            <div className="w-12 h-12 bg-white rounded-full border-[2.5px] border-[#c9963a] shadow-md flex items-center justify-center">
              <span className="text-[15px] font-bold text-[#8B1A1A] font-serif">VS</span>
            </div>
          </div>

          {/* RIGHT card (bottom on mobile) */}
          <div className="bg-[#f0ece3] flex flex-col rounded-b-[16px]">
            <div className="relative mx-5 mt-6 rounded-xl overflow-hidden">
              <Image src={data.image2} alt="Industrial" width={700} height={400} className="w-full h-52 object-cover grayscale" />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#2a4a36] rounded-full px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.14em] uppercase text-white">
                {data.badge2Icon} {data.badge2}
              </span>
            </div>
            <div className="px-5 pt-5 pb-8">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#7a8a7a] mb-2">The Factory Way</p>
              <h3 className="text-[22px] font-bold text-[#1e5c34] mb-2.5">{data.subHeading2}</h3>
              <p className="text-[13px] font-light leading-[1.8] text-[#4a4a46]">{data.subDesc2}</p>
            </div>
          </div>
        </div>

        {/* ── SM+: side-by-side layout with absolute VS ── */}
        <div className="hidden sm:flex relative rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(201,150,58,0.25)]">
          {/* LEFT */}
          <div className="flex-1 bg-[#1e5c34] flex flex-col">
            <div className="relative mx-7 lg:mx-10 mt-8 lg:mt-10 rounded-xl overflow-hidden">
              <Image src={data.image1} alt="Traditional" width={700} height={400} className="w-full h-60 lg:h-80 object-cover" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#c9963a] rounded-full px-4.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1e1a0a]">
                {data.badge1Icon} {data.badge1}
              </span>
            </div>
            <div className="px-7 lg:px-8 pt-5 lg:pt-6 pb-10 lg:pb-12">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#c9963a] mb-2">{data.subtitle1}</p>
              <h3 className="text-[26px] lg:text-[34px] font-bold text-white mb-3">{data.subHeading1}</h3>
              <p className="text-[14px] font-light leading-[1.8] text-white/78">{data.subDesc1}</p>
            </div>
          </div>

          {/* VS — absolute center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white rounded-full flex items-center justify-center border-[2.5px] border-[#c9963a] shadow">
            <span className="text-[18px] font-bold text-[#8B1A1A] font-serif">VS</span>
          </div>

          {/* RIGHT */}
          <div className="flex-1 bg-[#f0ece3] flex flex-col">
            <div className="relative mx-7 lg:mx-10 mt-8 lg:mt-10 rounded-xl overflow-hidden">
              <Image src={data.image2} alt="Industrial" width={700} height={400} className="w-full h-60 lg:h-80 object-cover grayscale" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#2a4a36] rounded-full px-4.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white">
                {data.badge2Icon} {data.badge2}
              </span>
            </div>
            <div className="px-7 lg:px-8 pt-5 lg:pt-6 pb-10 lg:pb-12">
              <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#7a8a7a] mb-2">The Factory Way</p>
              <h3 className="text-[26px] lg:text-[34px] font-bold text-[#1e5c34] mb-3">{data.subHeading2}</h3>
              <p className="text-[14px] font-light leading-[1.8] text-[#4a4a46]">{data.subDesc2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}