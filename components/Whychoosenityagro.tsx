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
  return (
    <section className="bg-white py-16 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1e5631] leading-tight">
          Why Choose Nityagro?
        </h2>
        <p className="text-2xl sm:text-3xl text-[#2d7a4f] font-normal mt-1">
          Authentic Goodness in Every Bundle
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center text-center gap-4"
          >
            {/* Icon */}
            <div className="w-24 h-24 relative flex items-center justify-center">
              {/*
               * IMPORTANT: Replace <img> with Next.js <Image> once you have real image files.
               * Example:
               * <Image
               *   src={feature.icon}
               *   alt={feature.alt}
               *   width={96}
               *   height={96}
               *   className="object-contain"
               *   style={{ filter: "invert(27%) sepia(51%) saturate(550%) hue-rotate(95deg) brightness(70%) contrast(90%)" }}
               * />
               *
               * The filter above converts a black/white PNG to the dark green (#1e5631) color.
               * Adjust the filter values to match your exact brand green.
               */}
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
            <h3 className="text-base font-bold text-[#1e5631]">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-45">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
