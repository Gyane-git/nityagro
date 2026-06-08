export default function Belief() {
  return (
    <section className="w-full bg-white flex flex-col lg:flex-row items-start px-5 sm:px-10 md:px-16 lg:px-24 xl:px-40 py-12 sm:py-16 lg:py-24 gap-8 lg:gap-0" aria-label="Belief">
      {/* LEFT: 30% */}
      <div className="w-full lg:w-[30%] shrink-0 pt-1">
        <div className="inline-block">
          <p className="text-[13px] sm:text-[15px] lg:text-[16px] font-bold tracking-[0.2em] uppercase text-[#1a5c36]" style={{ fontFamily: "var(--font-jost)" }}>
            01 — The Belief
          </p>
          <div className="h-0.5 bg-[#1a5c36] w-full mt-2" />
        </div>
      </div>

      {/* RIGHT: 70% */}
      <div className="w-full lg:w-[70%]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal italic leading-tight text-[#1a5c36] mb-7 lg:mb-10 max-w-full" style={{ fontFamily: "var(--font-garamond)" }}>
          We believe food is something we trust with our families, our children, and our everyday lives.
        </h2>

        <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-light leading-[1.9] text-[#266A3F] mb-5 max-w-full" style={{ fontFamily: "var(--font-jost)" }}>
          Long before machines sped things up, grains were ground on stone, oils were pressed in wood, and spices were crushed without ever being overheated. The result was food with memory — alive with the season it grew in.
        </p>

        <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-light leading-[1.9] text-[#266A3F] max-w-full" style={{ fontFamily: "var(--font-jost)" }}>
          Nityagro was born from a simple belief: traditional methods create food that feels better, tastes fuller, and stays closer to its natural form. We choose these time-tested practices not because they are old, but because they work.
        </p>
      </div>
    </section>
  );
}