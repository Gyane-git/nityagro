// components/Approach.jsx
import Image from "next/image";
import woodPressOil from "@/public/images/wood-press-oil.jpeg";
import stoneGrain from "@/public/images/stone-ground-grain.jpeg";
import turmatic from "@/public/images/turmatic.jpeg";

export default function Approach() {
  const cards = [
    {
      badge: "Wood Pressed",
      image: woodPressOil,
      alt: "Wood pressed oil flowing from ghani",
      title: "Oils",
      desc: "Pressed slowly in wooden ghanis to retain aroma, flavour and natural nutrients.",
    },
    {
      badge: "Stone Pressed",
      image: stoneGrain,
      alt: "Hands holding stone ground grains",
      title: "Flour",
      desc: "Ground between cool stones — the flour stays alive, never scorched by speed.",
    },
    {
      badge: "Stone Pressed",
      image: turmatic,
      alt: "Turmeric being ground on stone",
      title: "Spices",
      desc: "Crushed without overheating, locking in the essential oils that define each spice.",
    },
  ];

  return (
    <section className="w-full bg-[#f0ece3] px-5 sm:px-10 md:px-16 lg:px-24 xl:px-50 pt-12 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24" style={{ fontFamily: "var(--font-jost)" }}>
      {/* ── Top row ── */}
      <div className="flex flex-col lg:flex-row lg:items-end mb-10 sm:mb-12 lg:mb-16 gap-6 lg:gap-0">
        {/* LEFT: label + headline */}
        <div className="w-full lg:w-[52%] shrink-0">
          <div className="inline-block mb-5">
            <p className="text-[13px] sm:text-[14px] lg:text-[16px] font-bold tracking-[0.18em] uppercase text-[#1e5c34] mb-2">03 — Our Approach</p>
            <div className="h-0.5 bg-[#1a5c36] w-full mt-2" />
          </div>

          <h2 className="text-[36px] sm:text-[42px] lg:text-[50px] font-normal leading-[1.16] text-[#123621]" style={{ fontFamily: "var(--font-garamond)" }}>
            <span className="text-[#123621]">Three methods.</span>
            <em>
              One
              <br />
              promise.
            </em>
          </h2>
        </div>

        {/* RIGHT: body text */}
        <div className="flex-1 lg:pl-24 xl:pl-50 pb-0 lg:pb-1.5">
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-light leading-[1.82] text-[#4d4d48]">Low temperatures. Low speeds. No chemicals. Each process is chosen for what it preserves, not what it produces faster.</p>
        </div>
      </div>

      {/* ── Three cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card) => (
          <div key={card.title}>
            <div className="relative rounded-xl overflow-hidden mb-4 sm:mb-5">
              <Image src={card.image} alt={card.alt} width={600} height={480} className="w-full h-64 sm:h-80 md:h-96 lg:h-120 object-cover" />
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#f0ece3]/93 hover:bg-gray-900 text-[#1c6b3d] rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase">{card.badge}</span>
            </div>
            <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] font-normal text-[#1e5c34] mb-2" style={{ fontFamily: "var(--font-garamond)" }}>
              {card.title}
            </h3>
            <p className="text-[13px] sm:text-[13.5px] font-light leading-[1.82] text-[#4d4d48]">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}