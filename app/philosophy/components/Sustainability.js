// components/Sustainability.jsx

import { Mountain } from "lucide-react";

export default function Sustainability() {
  const stats = [
    { value: "100%", label: "Chemical-Free Processing" },
    { value: "Low °C", label: "Cold-Pressed Methods" },
    { value: "0", label: "Industrial Refining Steps" },
    { value: "Direct", label: "Farm-to-Kitchen Chain" },
  ];

  return (
    <section
      className="w-full bg-[#f7f6f2] flex items-center gap-20 px-17.5 px-50 py-20 min-h-130"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* LEFT */}
      <div className="shrink-0 w-90">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#f5e9cf] rounded-full px-4 py-1.5 mb-7">
          <Mountain className="w-4 h-4 text-[#1A5C36]" />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A5C36]">
            Sustainability
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-[48px] font-normal leading-[1.18] text-[#1A5C36] mb-7"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          A lighter footprint by design — not by claim.
        </h2>

        {/* Body */}
        <p className="text-[15px] font-light leading-[1.85] text-[#4F5F56] max-w-85">
          Our traditional processing operates at low speed and low temperatures,
          reducing the need for heavy energy use or chemical processing. Simple
          responsible production that keeps food close to its natural form.
        </p>
      </div>

      {/* RIGHT: 2×2 grid */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#f0ede6] rounded-2xl px-8 py-8">
            <p
              className="text-[52px] font-normal leading-none text-[#1F5131] mb-3"
              style={{ fontFamily: "var(--font-garamond)" }}
            >
              {stat.value}
            </p>
            <p className="text-[13px] font-normal text-[#5A695F] leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
