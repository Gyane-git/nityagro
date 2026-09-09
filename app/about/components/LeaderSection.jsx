import Image from "next/image";

export default function LeaderSection() {
  return (
    <section
      className="
        flex flex-col md:flex-row
        items-center md:items-start
        justify-between
        gap-6 md:gap-8
        w-full
        overflow-hidden
        bg-[#2d5f4f]
        px-6 sm:px-10 md:px-16 lg:px-20
        pt-8 sm:pt-10 md:pt-14
        pb-8 sm:pb-10
      "
    >
      {/* Text block */}
      <div className="flex-1 max-w-full md:max-w-[1050px] text-center md:text-left">
        {/* Heading */}
        <h2
          className="
            font-serif italic font-semibold
            text-[#c8a951]
            text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]
            tracking-[0.01em]
            mb-5 sm:mb-6
          "
        >
          Founder&apos;s Note
        </h2>

        {/* Opening */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-4
          "
        >
          It started with a simple question.
        </p>

        {/* Paragraph 1 */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-4
          "
        >
          As a mother of a three-year-old, I began looking more closely at
          something we often take for granted—{" "}
          <strong className="font-semibold text-white">
            what goes into the food we eat every day.
          </strong>
        </p>

        {/* Paragraph 2 */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-4
          "
        >
          The more I looked, the more I realised how difficult it had become
          to find food that felt simple, honest and close to its natural form.
          Somewhere along the way,{" "}
          <strong className="font-semibold text-white">
            purity had become harder to find.
          </strong>
        </p>

        {/* Paragraph 3 */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-4
          "
        >
          That thought led me to look beyond the kitchen—to understand where
          our food comes from, how it is processed and the people behind it.
        </p>

        {/* Paragraph 4 */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-5
          "
        >
          <strong className="font-semibold text-white">
            Nityagro was born from that journey.
          </strong>
        </p>

        {/* Closing */}
        <p
          className="
            text-[#dcd8d0]
            font-sans
            text-[13px] sm:text-[14px] md:text-[15px]
            leading-[1.78]
            mb-6
          "
        >
          We want to bring together traditional wisdom, modern knowledge and
          responsible practices to make better choices more accessible—for
          our families, our farmers and the future.
        </p>

        {/* Quote */}
        <blockquote
          className="
            border-l-2
            border-[#c8a951]
            pl-4 sm:pl-5
            mb-5
            text-[#f0ece3]
            font-serif
            italic
            text-[15px] sm:text-[16px] md:text-[17px]
            leading-[1.6]
          "
        >
          “Because what we choose today shapes what we leave behind tomorrow.”
        </blockquote>

        {/* Founder */}
        <div className="mt-4">
          <p className="text-white font-semibold text-[14px] sm:text-[15px]">
            — Anna Sharma
          </p>

          <p className="text-[#c8a951] text-[12px] sm:text-[13px] mt-1">
            Founder, Nityagro
          </p>
        </div>
      </div>

      {/* Image block */}
      <div
        className="
          shrink-0
          flex
          items-center md:items-end
          justify-center md:justify-end
          w-full md:w-auto
          mt-6 md:mt-0
        "
      >
        <Image
          src="/assets/partner.png"
          alt="Nityagro founder"
          width={420}
          height={300}
          priority
          className="
            block
            object-contain
            object-bottom
            grayscale
            w-full
            max-w-[260px]
            sm:max-w-[320px]
            md:max-w-[360px]
            max-h-[190px]
            sm:max-h-[230px]
            md:max-h-[280px]
          "
        />
      </div>
    </section>
  );
}