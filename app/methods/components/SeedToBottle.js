export default function SeedToBottle({ data }) {
  const steps = data?.steps || [];

  return (
    <div className="w-full bg-[#f0ece3] px-5 sm:px-10 md:px-14 lg:px-20 py-10 sm:py-12 lg:py-16 overflow-x-hidden" style={{ fontFamily: "var(--font-jost)" }}>
      {/* Header */}
      <div className="mb-10 sm:mb-12 lg:mb-16">
        <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#c9963a] mb-3 lg:mb-4">{data?.title}</p>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8 lg:gap-16">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[48px] font-bold text-[#1e5c34] leading-[1.1]">
            {data?.headline1}
            <span className="text-[#c9963a]">{data?.headlineGold}</span>
          </h2>

          <p className="w-full sm:w-80 lg:w-95 shrink-0 sm:pt-2.5 text-[13px] sm:text-[14px] lg:text-[14.5px] font-light leading-[1.85] text-[#4a4a46]">{data?.desc}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-10 sm:gap-14 lg:gap-18">
        {steps.map((s) => (
          <div key={s.step} className={`flex flex-col gap-6 sm:gap-10 lg:gap-16 lg:items-center ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
            {/* Image */}
            <div className="w-full lg:w-[48%] shrink-0 relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={s.image} alt={s.alt} className="w-full object-cover block" style={{ aspectRatio: "4/3" }} />
              </div>
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#f0ece3]/92 rounded-full px-4 py-1.5 sm:px-4.5 sm:py-2 text-[10px] sm:text-[11px] font-medium">{s.step}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-[20px] sm:text-[22px] mb-3 lg:mb-4">{s.icon}</div>

              <h3 className="text-[22px] sm:text-[24px] lg:text-[26px] font-bold text-[#1e5c34] mb-3 lg:mb-3.5">{s.title}</h3>

              <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] font-light leading-[1.85] text-[#4a4a46] mb-4 lg:mb-5">{s.desc}</p>

              <div className="flex items-center gap-3">
                <div className="w-6 sm:w-8 h-[1.5px] bg-[#c9963a]" />
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#c9963a]">{data?.tested}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}