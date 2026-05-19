import Image from "next/image";

// Replace these imports with your actual image paths
// import nativeSourcingIcon from "@/assets/icons/native-sourcing.png";
// import traditionalProcessingIcon from "@/assets/icons/traditional-processing.png";
// import chemicalFreeIcon from "@/assets/icons/chemical-free.png";
// import ruralLivesIcon from "@/assets/icons/rural-lives.png";

const features = [
  {
    id: "native-sourcing",
    // Replace src with your actual image: src: nativeSourcingIcon
    icon: "/w4.png",
    alt: "Bullock cart icon representing native sourcing",
    title: "Native Sourcing",
    description:
      "Highest quality raw material from native regions all over Nepal.",
  },
  {
    id: "traditional-processing",
    icon: "/w2.png",
    alt: "Stone well icon representing traditional processing",
    title: "Traditional Processing",
    description:
      "Minimally processed using time-tested methods, made better. For maximum nutrition.",
  },
  {
    id: "chemical-free",
    icon: "/w3.png",
    alt: "Mortar and pestle icon representing chemical-free products",
    title: "100% Chemical-Free",
    description:
      "Everything goes through 40+ lab tests, to make sure that you get only what is best.",
  },
  {
    id: "rural-lives",
    icon: "/w1.png",
    alt: "Family and village icon representing better rural lives",
    title: "Better Rural Lives",
    description:
      "500K+ families prefer every healthy and traditional products from Nityagro.",
  },
];

export default function WhyChooseNityagro() {
  const newLocalOld = "mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8";

  return (
    <section className="bg-white py-1 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <div className="w-full max-w-1380 min-h-auto">
        <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        <div className={newLocalOld}>
          {/* ── Header ── */}
          <div className="flex flex-col items-center  text-center pt-3 sm:pt-1 lg:pt-1 pb-4 mb-4">
            <h1
              className="font-bold text-xl sm:text-2xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]"
              style={{ fontFamily: "Roboto Slab" }}
            >
              Why Choose Nityagro?
            </h1>
            <p
              className="font-normal text-lg sm:text-xl lg:text-[32px] leading-tight tracking-[0.6px] text-[#235A49]"
              style={{ fontFamily: "Roboto Slab" }}
            >
              Authentic Goodness in Every Bundle
            </p>
          </div>

          {/* Feature Cards */}
          <div className="max-w-6xl mx-auto mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Icon */}
                <div className="w-[141px] h-[68px] relative flex items-center justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                    style={{
                      filter:
                        "invert(27%) sepia(51%) saturate(550%) hue-rotate(95deg) brightness(70%) contrast(90%)",
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[#1e5631]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm font-normal text-gray-600 leading-relaxed max-w-45 font-figtree">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
