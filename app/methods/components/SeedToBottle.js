export default function SeedToBottle({ data }) {
  const steps = data?.steps || [];

  return (
    <div
      className="w-full bg-[#f0ece3] px-20 py-16 overflow-x-hidden"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* Header */}
      <div className="mb-16">
        <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#c9963a] mb-4">
          {data?.title}
        </p>

        <div className="flex items-start justify-between gap-16">
          <h2 className="text-[48px] font-bold text-[#1e5c34] leading-[1.1]">
            {data?.headline1}
            <span className="text-[#c9963a]">{data?.headlineGold}</span>
          </h2>

          <p className="shrink-0 w-95 pt-2.5 text-[14.5px] font-light leading-[1.85] text-[#4a4a46]">
            {data?.desc}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-18">
        {steps.map((s) => (
          <div
            key={s.step}
            className={`flex items-center gap-16 ${
              s.reverse ? "flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="shrink-0 w-[48%] relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={s.image}
                  alt={s.alt}
                  className="w-full object-cover block"
                  style={{ aspectRatio: "4/3" }}
                />
              </div>

              <span className="absolute top-4 left-4 bg-[#f0ece3]/92 rounded-full px-4.5 py-2 text-[11px] font-medium">
                {s.step}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-[22px] mb-4">{s.icon}</div>

              <h3 className="text-[26px] font-bold text-[#1e5c34] mb-3.5">
                {s.title}
              </h3>

              <p className="text-[14.5px] font-light leading-[1.85] text-[#4a4a46] mb-5">
                {s.desc}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-8 h-[1.5px] bg-[#c9963a]" />
                <span className="text-[13px] font-semibold text-[#c9963a]">
                  {data?.tested}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
