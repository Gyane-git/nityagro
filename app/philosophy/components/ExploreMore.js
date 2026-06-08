"use client";
import { useRouter } from "next/navigation";
export default function CTABanner() {
  const router = useRouter();
  return (
    <div className="w-full bg-white px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 lg:py-12">
      <div
        className="rounded-[20px] px-6 sm:px-10 lg:px-17.5 py-10 sm:py-12 lg:py-16 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-8 sm:gap-6 min-h-fit lg:min-h-70"
        style={{
          background: "linear-gradient(120deg, #2a6b3c 0%, #2a6b3c 55%, #6b9a3a 100%)",
        }}
      >
        {/* Left: text */}
        <div className="w-full sm:max-w-[65%] lg:max-w-130 text-center sm:text-left">
          <h2 className="text-[30px] sm:text-[36px] lg:text-[46px] font-normal leading-[1.2] text-white mb-4 lg:mb-5" style={{ fontFamily: "var(--font-garamond)" }}>
            Join the quiet revolution in
            <br />
            <em className="italic text-[#d4a82a]">traditional food.</em>
          </h2>
          <p className="text-[13px] sm:text-[14px] font-light leading-[1.8] text-white/75 max-w-full lg:max-w-110" style={{ fontFamily: "var(--font-jost)" }}>
            Bring traditional, chemical-free nourishment to your family — and support the farmers who make it possible.
          </p>
        </div>

        {/* Right: CTA button */}
        <button onClick={() => router.push("/products")} className="shrink-0 inline-flex items-center gap-3 bg-[#d4a82a] rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-[10px] sm:text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1e3d22] cursor-pointer whitespace-nowrap" style={{ fontFamily: "var(--font-jost)" }}>
          Explore Products
          <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#1e3d22] rounded-full flex items-center justify-center text-[#d4a82a] text-sm">→</span>
        </button>
      </div>
    </div>
  );
}