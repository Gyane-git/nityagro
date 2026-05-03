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
    <section
      className="w-full bg-[#f0ece3] px-50 pt-16 pb-24"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── Top row: align items to BOTTOM so body text sits at bottom of headline ── */}
      <div className="flex items-end mb-16 gap-0">
        {/* LEFT 52%: label + underline + headline */}
        <div className="w-[52%] shrink-0">
          {/* inline-block so underline matches label text width only */}
          <div className="inline-block mb-5.5">
            <p className="text-[16px] font-bold tracking-[0.18em] uppercase text-[#1e5c34] mb-2">
              03 — Our Approach
            </p>
            <div className="h-0.5 bg-[#1a5c36] w-full mt-2" />
          </div>

          <h2
            className="text-[50px] font-normal leading-[1.16] text-[#123621]"
            style={{ fontFamily: "var(--font-garamond)" }}
          >
            <span className="text-[#123621"> Three methods.&nbsp;&nbsp;</span>
            <em>
              One
              <br />
              promise.
            </em>
          </h2>
        </div>

        {/* RIGHT: body text */}
        <div className="flex-1 pl-50 pb-1.5">
          <p className="text-[16px] font-light leading-[1.82] text-[#4d4d48]">
            Low temperatures. Low speeds. No chemicals. Each process is chosen
            for what it preserves, not what it produces faster.
          </p>
        </div>
      </div>

      {/* ── Three cards ── */}
      <div className="grid grid-cols-3 gap-6">
        {cards.map((card) => {
          return (
            <div key={card.title}>
              <div className="relative rounded-xl overflow-hidden mb-5.5">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={600}
                  height={480}
                  className="w-full h-120 object-cover" />
                <span className="absolute top-4 left-4 bg-[#f0ece3]/93 text-[#1c6b3d] rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase">
                  {card.badge}
                </span>
              </div>
              <h3
                className="text-[32px] font-normal text-[#1e5c34] mb-2.5"
                style={{ fontFamily: "var(--font-garamond)" }}
              >
                {card.title}
              </h3>
              <p className="text-[13.5px] font-light leading-[1.82] text-[#4d4d48]">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
