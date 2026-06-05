import Image from "next/image";
// replace with your actual image path

export default function LeaderSection() {
  return (
    <section
      className="
    flex flex-col md:flex-row items-center md:items-start justify-between
    gap-8 md:gap-12 w-full overflow-hidden
    bg-[#2d5f4f] px-6 sm:px-10 md:px-20
    pt-8 sm:pt-10 md:pt-14 pb-8
  "
    >
      {/* Text block */}
      <div className="flex-1 max-w-full md:max-w-[740px] text-center md:text-left">
        <h2
          className="
        font-serif italic font-semibold text-[#c8a951]
        text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]
        tracking-[0.01em] mb-[18px] sm:mb-[22px]
      "
        >
          Founder&apos;s Note
        </h2>

        <p className="text-[#dcd8d0] font-sans text-[13px] sm:text-[14px] md:text-[15px] leading-[1.78] mb-[12px] sm:mb-[15px]">Anveshan wasn&apos;t born in a boardroom. It started with a memory. Of ghee that filled the house with aroma. Of cold-pressed oil that poured from steel cans. Of food that was deeply personal.</p>

        <p className="text-[#dcd8d0] font-sans text-[13px] sm:text-[14px] md:text-[15px] leading-[1.78] mb-[12px] sm:mb-[15px]">By 2020, most of it had vanished. In its place were processed, polished, packaged imitations. The gap between what we ate and what we trusted kept growing.</p>

        <p className="text-[#dcd8d0] font-sans text-[13px] sm:text-[14px] md:text-[15px] leading-[1.78]">
          So we left our jobs. Went back to the villages. Sat with farmers. Set up our own micro-units. One cow. One kolhu. One farmer. One family at a time.
          <br />
          And just like that, Anveshan began.
        </p>
      </div>

      {/* Image block */}
      <div className="shrink-0 flex items-center md:items-end justify-center md:justify-end w-full md:w-auto mt-6 md:mt-0">
        <Image
          src="/assets/partner.png"
          alt="Inityagro founders"
          width={420}
          height={300}
          priority
          className="
        block object-contain object-bottom
        grayscale w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px]
        max-h-[200px] sm:max-h-[240px] md:max-h-[300px]
      "
        />
      </div>
    </section>
  );
}