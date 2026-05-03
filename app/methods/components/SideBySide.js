// components/SideBySide.jsx
import Image from "next/image";

export default function SideBySide() {
  return (
    <div
      className="w-full bg-white px-16 pt-16"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── Centered Header ── */}
      <div className="text-center mb-14">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#d0ccc4] rounded-full px-[18px] py-2 mb-7">
          <span className="text-[13px] text-[#c9963a]">✦</span>
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#4a4a46]">
            Side By Side
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-[46px] font-bold leading-[1.2] text-[#1e5c34] mb-4">
          One is <span className="text-[#c9963a] italic">Crafted.</span>
          <br />
          The other is{" "}
          <span className="text-[#b0b8b0] italic line-through">
            Manufactured.
          </span>
        </h2>

        <p className="text-[15px] font-light text-[#5a5a55] leading-[1.7] max-w-130 mx-auto">
          Look closer. Every step of how oil is made shapes what reaches your
          kitchen.
        </p>
      </div>

      {/* ── Two Cards ── */}
      <div className="flex relative rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(201,150,58,0.25)]">
        {/* LEFT: Traditional — dark green */}
        <div className="flex-1 bg-[#1e5c34] rounded-tl-[20px] flex flex-col">
          {/* Image */}
          <div className="relative mx-10 mt-10 rounded-xl overflow-hidden">
            <Image
              src="/methods/wood-pressed-oil.jpeg"
              alt="Traditional wood pressed oil"
              width={700}
              height={400}
              className="w-full h-80 object-cover"
            />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#c9963a] rounded-full px-[18px] py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1e1a0a]">
              🌿 Traditional
            </span>
          </div>
          {/* Content */}
          <div className="px-8 pt-6 pb-12">
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#c9963a] mb-2.5">
              The Nityagro Way
            </p>
            <h3 className="text-[34px] font-bold text-white mb-3.5">
              Wood-Pressed
            </h3>
            <p className="text-[14px] font-light leading-[1.8] text-white/78">
              Slow. Quiet. Patient. A wooden ghani turning under 30 RPM, the way
              it has for four generations — coaxing oil out, never forcing it.
            </p>
          </div>
        </div>

        {/* CENTER divider circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14.5 h-14.5 bg-white rounded-full flex items-center justify-center"
          style={{
            border: "2.5px solid #c9963a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
        >
          <span
            className="text-[18px] font-bold tracking-[0.02em]"
            style={{
              fontFamily: "Georgia, serif",
              color: "#8B1A1A",
            }}
          >
            VS
          </span>
        </div>

        {/* RIGHT: Industrial — cream */}
        <div className="flex-1 bg-[#f0ece3] rounded-tr-[20px] flex flex-col">
          {/* Image — grayscale */}
          <div className="relative mx-10 mt-10 rounded-xl overflow-hidden">
            <Image
              src="/methods/industrial-factory.png"
              alt="Industrial factory"
              width={700}
              height={400}
              className="w-full h-80 object-cover grayscale"
            />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#2a4a36] rounded-full px-[18px] py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white">
              ⚙ Industrial
            </span>
          </div>
          {/* Content */}
          <div className="px-8 pt-6 pb-12">
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#7a8a7a] mb-2.5">
              The Factory Way
            </p>
            <h3 className="text-[34px] font-bold text-[#1e5c34] mb-3.5">
              Refined
            </h3>
            <p className="text-[14px] font-light leading-[1.8] text-[#4a4a46]">
              Fast. Hot. Chemical. Steel expellers spinning at 1500 RPM, hexane
              baths and bleaching clay — engineered for shelf life, not for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
