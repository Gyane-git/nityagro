"use client";

const SECTIONS = [
  {
    number: "01",
    title: "Our Quality Promise",
    paragraphs: [
      "Every bottle of Nityagro oil is hand-inspected, lab-tested and sealed within hours of pressing. If a product reaches you damaged, leaked, or not matching your order — we'll make it right, fast.",
"Because our wood-pressed oils stone-ground flours and whole spices are perishable food items, our return policy is designed around safety and freshness for every customer.",
    ],
  },
  {
    number: "02",
    title: "When You Can Request a Return",
    paragraphs: [
      "We accept return or replacement requests in the following situations:",
"• The product arrived damaged, leaking or with a broken seal.",
"• You received an incorrect product or quantity versus your order.",
"• The product is past its 'best before' date on arrival.",
"• There is a clear manufacturing defect (off-smell, contamination, foreign particles)."
    ],
  },
  {
    number: "03",
    title: "Return Window",
    paragraphs: [
      "Please raise your request within 48 hours of delivery by emailing care@nityagro.com with your order ID and clear photographs of the issue (including the outer packaging).",
"Requests raised after 48 hours unfortunately cannot be processed, as we cannot verify in-transit conditions beyond that window."
    ],
  },
  {
    number: "04",
    title: "What We Cannot Accept",
    paragraphs: [
      "• Opened or partially used bottles, packets or jars (food-safety regulation).",
"• Returns based on personal taste preference — wood-pressed oils have a naturally stronger aroma and colour than refined oils.",
"• Products purchased from third-party marketplaces or unauthorised resellers.",
"• Damage caused by improper storage after delivery (exposure to direct sunlight or heat)."
    ],
  },
  {
    number: "05",
    title: "How the Process Works",
    paragraphs: [
      "1. Email care@nityagro.com within 48 hours with your order ID, photos and a short description.",
"2. Our team reviews and responds within 1 working day with a resolution — replacement, store credit or refund.",
"3. For damaged items, we usually do not require a physical return. For wrong items, we arrange a free reverse pickup.",
"4. Once approved, your refund or replacement is dispatched within 3–5 working days.",
    ],
  },
  {
    number: "06",
    title: "Refund Timelines",
    paragraphs: [
      "Approved refunds are credited to your original payment method within 5–7 working days of approval. Fonepay and wallet refunds are usually instant; card and net-banking refunds may take up to one billing cycle depending on your bank.",
"Cash-on-delivery orders are refunded via bank transfer — we'll request your account details over secure email.",
    ],
  },
  {
    number: "07",
    title: "Limitation of Liability",
    paragraphs: [
      "By accessing nityagro.com or placing an order with us, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please refrain from using our website or services.",
"We may update these terms occasionally. Continued use of the site after changes are posted means you accept the revised terms.",
    ],
  },
  {
    number: "08",
    title: "Order Cancellations",
    paragraphs: [
      "Orders can be cancelled free of charge until they are dispatched (typically within 24 hours of placement). Once shipped, cancellations are not possible — but you may refuse delivery and we will process a refund minus actual shipping costs.",
    ],
  },
];

// Light gray rounded-square icon with green leaf — matches screenshot exactly
const LeafIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2D7A4F"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export default function TermsConditionsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Hero Header ── */}
      <section
        className="w-full px-6 pt-14 pb-12 text-center"
        style={{ background: "#F9F5EC", margin: "0 auto" }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-white"
          style={{
            background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          ✦ Terms &amp; Conditions
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-tight mb-5"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            color: "#1a1a1a",
            maxWidth: "640px",
            margin: "0 auto 20px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Return & Refund{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Policy.
          </span>{" "}
          
        </h1>

        {/* Subtitle */}
        <p
          style={{
            maxWidth: "580px",
            margin: "0 auto 14px",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.75",
            fontFamily: "sans-serif",
          }}
        >
          Your trust matters more than any single order. If something isn't right with what reached you, we'll resolve it quickly — here's exactly how.
        </p>

        {/* Date */}
        <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: "sans-serif" }}>
          Last updated: 1 May 2026
        </p>
      </section>

      {/* ── Gold divider ── */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #D4A853 30%, #D4A853 70%, transparent)",
        }}
      />

      {/* ── Sections ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "56px 40px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SECTIONS.map((section, idx) => {
            const isLast = idx === SECTIONS.length - 1;
            return (
              <div
                key={idx}
                style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
              >
                {/* ── Left: icon + number + vertical line ── */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: "52px",
                  }}
                >
                  {/* Light gray rounded-square icon — matches screenshot */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#F2F2F0",
                      border: "1px solid #E5E5E0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LeafIcon />
                  </div>

                  {/* Section number below icon */}
                  <span
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#D4A853",
                      opacity: 0.5,
                      marginTop: "6px",
                      lineHeight: 1,
                    }}
                  >
                    {section.number}
                  </span>

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div
                      style={{
                        width: "2px",
                        flex: 1,
                        minHeight: "32px",
                        marginTop: "8px",
                        background:
                          "linear-gradient(180deg, #D4A853 0%, transparent 100%)",
                        opacity: 0.3,
                      }}
                    />
                  )}
                </div>

                {/* ── Right: content ── */}
                <div
                  style={{
                    flex: 1,
                    paddingBottom: isLast ? "0" : "40px",
                    paddingTop: "4px",
                  }}
                >
                  {/* Section title */}
                  <h2
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                      fontWeight: "700",
                      color: "#00462C",
                      marginBottom: "12px",
                      lineHeight: 1.3,
                    }}
                  >
                    {section.title}
                  </h2>

                  {/* Paragraphs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {section.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        style={{
                          fontSize: "14px",
                          color: "#4b5563",
                          lineHeight: "1.78",
                          fontFamily: "sans-serif",
                          margin: 0,
                        }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}