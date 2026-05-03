const steps = [
  {
    step: "Step 01",
    icon: "🌱",
    title: "Hand-Picked Seeds",
    desc: "We source single-origin groundnut, sesame, coconut and mustard seeds directly from certified organic farms across India — sun-dried and inspected by hand.",
    image: "/methods/hand-picked-seeds.png",
    alt: "Hands holding seeds",
    reverse: false,
  },
  {
    step: "Step 02",
    icon: "⚙️",
    title: "Traditional Wooden Ghani",
    desc: "Seeds are crushed slowly in heritage wooden kolhus made from neem and sheesham. The press turns under 30 RPM, never letting temperatures cross 40°C.",
    image: "/methods/wooden-ghani.jpeg",
    alt: "Traditional wooden ghani press",
    reverse: true,
  },
  {
    step: "Step 03",
    icon: "🛡️",
    title: "Lab-Tested Purity",
    desc: "Every batch is tested in-house and by independent FSSAI-certified labs for nutrient retention, peroxide value and chemical-free purity before bottling.",
    image: "/methods/wooden-ghani.jpeg",
    alt: "Lab testing oil purity",
    reverse: false,
  },
  {
    step: "Step 04",
    icon: "📦",
    title: "Sealed in Glass",
    desc: "Filtered through unbleached cotton and bottled the same day in dark glass — protecting the natural aroma, antioxidants and golden colour from light.",
    image: "/methods/wooden-ghani.jpeg",
    alt: "Glass bottles of pressed oil",
    reverse: true,
  },
];

export default function SeedToBottle() {
  return (
    <div
      className="w-full bg-[#f0ece3] px-20 py-16 overflow-x-hidden"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── Top Header ── */}
      <div className="mb-16">
        <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#c9963a] mb-4">
          Four Steps · Zero Shortcuts
        </p>
        <div className="flex items-start justify-between gap-16">
          <h2 className="text-[48px] font-bold text-[#1e5c34] leading-[1.1]">
            From seed to <span className="text-[#c9963a]">sealed bottle</span>.
          </h2>
          <p className="shrink-0 w-95 pt-2.5 text-[14.5px] font-light leading-[1.85] text-[#4a4a46]">
            Every step happens within our own facility, by hands we know, in
            time measured by season — not by quarter.
          </p>
        </div>
      </div>

      {/* ── Step Rows ── */}
      <div className="flex flex-col gap-18">
        {steps.map((s) => (
          <div
            key={s.title}
            className={`flex items-center gap-16 ${
              s.reverse ? "flex-row-reverse" : ""
            }`}
          >
            {/* ── Image Column ── */}
            <div className="shrink-0 w-[48%] relative">
              <div
                className="rounded-2xl"
                style={{
                  boxShadow: "0 0 30px 15px rgba(201,150,58,0.20)",
                }}
              >
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full object-cover block"
                    style={{ aspectRatio: "4/3" }}
                  />
                </div>
              </div>

              <span className="absolute top-4 left-4 z-10 bg-[#f0ece3]/92 rounded-full px-[18px] py-2 text-[11px] font-medium text-[#2a2a26]">
                {s.step}
              </span>
            </div>

            {/* ── Content Column ── */}
            <div className="flex-1">
              {/* Icon box */}
              <div className="w-[52px] h-[52px] bg-[#e8f0e8] rounded-xl flex items-center justify-center text-[22px] mb-5">
                {s.icon}
              </div>

              {/* Title */}
              <h3 className="text-[26px] font-bold text-[#1e5c34] mb-3.5">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-[14.5px] font-light leading-[1.85] text-[#4a4a46] mb-5">
                {s.desc}
              </p>

              {/* Tags line */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1.5px] bg-[#c9963a] shrink-0" />
                <span className="text-[13px] font-semibold text-[#c9963a]">
                  Traditional · Time-Honoured · Tested
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
