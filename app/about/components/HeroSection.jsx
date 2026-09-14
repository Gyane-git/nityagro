import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="w-full">
        <Image
          src="/assets/about us 1.jpg"
          alt="Nityagro Traditional Food"
          width={1700}
          height={520}
          priority
          className="block w-full h-auto"
        />
      </div>
    </section>
  );
}