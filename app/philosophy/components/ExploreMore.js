"use client";
import { useRouter } from "next/navigation";
export default function CTABanner() {
  const router = useRouter();
  return (
    <div className="w-full bg-white px-16 py-12">
      <div
        className="rounded-[20px] px-17.5 py-16 flex items-center justify-between min-h-70"
        style={{
          background:
            "linear-gradient(120deg, #2a6b3c 0%, #2a6b3c 55%, #6b9a3a 100%)",
        }}
      >
        {/* Left: text */}
        <div className="max-w-130">
          <h2
            className="text-[46px] font-normal leading-[1.2] text-white mb-5"
            style={{ fontFamily: "var(--font-garamond)" }}
          >
            Join the quiet revolution in
            <br />
            <em className="italic text-[#d4a82a]">traditional food.</em>
          </h2>
          <p
            className="text-[14px] font-light leading-[1.8] text-white/75 max-w-110"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            Bring traditional, chemical-free nourishment to your family — and
            support the farmers who make it possible.
          </p>
        </div>

        {/* Right: CTA button */}
        <button
          onClick={() => router.push("/products")}
          className="shrink-0 inline-flex items-center gap-3 bg-[#d4a82a] rounded-full px-7 py-4 text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#1e3d22] cursor-pointer"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          Explore Products
          <span className="w-7 h-7 bg-[#1e3d22] rounded-full flex items-center justify-center text-[#d4a82a] text-sm">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
