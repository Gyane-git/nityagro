// components/ColdPressedFlour.jsx
import Image from "next/image";

export default function ColdPressedFlour({ data }) {
  return (
    <div className="w-full bg-white" style={{ fontFamily: "var(--font-jost)" }}>
      {/* ── Centered page header ── */}
      <div className="text-center px-16 pt-12 pb-10">
        <h1 className="text-[26px] font-bold text-[#1e5c34] tracking-[0.01em] mb-1.5">
          {data?.title}
        </h1>
        <p className="text-[22px] font-normal text-[#1e5c34]">
          {data?.description}
        </p>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="flex items-start pl-20 pr-16 pb-20 gap-0">
        {/* LEFT */}
        <div className="shrink-0 w-[48%] pt-8 pr-10">
          {/* Badge (optional: make dynamic later) */}
          <div className="inline-flex items-center gap-2 bg-[#fdf0d0] rounded-full px-4.5 py-2 mb-8">
            <div className="w-1.75 h-1.75 rounded-full bg-[#d4a82a] shrink-0" />
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#5a4a1a]">
              {data?.badge}
            </span>
          </div>

          {/* Headline (still static for now) */}
          <h2
            className="text-[68px] font-semibold leading-[1.08] text-[#1e5c34] mb-7"
            style={{ fontFamily: "var(--font-garamond)" }}
          >
            {data?.headline1}
            <br />
            {data?.headline2}{" "}
            <span className="text-[#d4a82a]">{data?.headlineGold}.</span>
          </h2>

          {/* Body */}
          <p className="text-[15px] font-light leading-[1.82] text-[#4a4a46] mb-9 max-w-120">
            {data?.desc || "No description"}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mb-14">
            <button className="inline-flex items-center gap-2.5 bg-[#1e5c34] rounded-full px-7 py-3.5 text-[13px] font-medium text-white">
              {data?.btnPrimary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="inline-flex items-center bg-transparent border-[1.5px] border-[#1e5c34] rounded-full px-7 py-3.5 text-[13px] font-medium text-[#1e5c34]">
              {data?.btnSecondary}
            </button>
          </div>

          {/* Stats (still static) */}
          <div className="flex items-start">
            {data?.stats?.map((stat, index) => (
              <div
                key={index}
                className={`pr-9 ${
                  index !== 0 ? "pl-9 border-l border-[#d0cdc8]" : ""
                }`}
              >
                <p className="text-[32px] font-bold text-[#1e2a1e] mb-1">
                  {stat.value}
                </p>
                <p className="text-[13px] font-light text-[#6a6a66]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-end items-start pt-4">
          <div
            className="relative w-[88%] rounded-[36px] p-5.5"
            style={{
              background:
                "0 0 60px 30px rgba(235,185,70,0.35), 0 0 100px 50px rgba(235,185,70,0.15)",
            }}
          >
            <div
              className="rounded-[22px] overflow-hidden w-full"
              style={{
                boxShadow: "0 0 30px 15px rgba(201,150,58,0.20)",
              }}
            >
              <Image
                src="/methods/mill.png"
                alt="Stone grinding flour"
                width={700}
                height={875}
                className="w-full object-cover rounded-[22px]"
                style={{ height: "600px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
