"use client";

const SECTIONS = [
  {
    number: "01",
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing nityagro.com or placing an order with us, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please refrain from using our website or services.",
      "We may update these terms occasionally. Continued use of the site after changes are posted means you accept the revised terms.",
    ],
  },
  {
    number: "02",
    title: "Orders & Pricing",
    paragraphs: [
      "All prices on our site are listed in Nepalese Rupees (NPR) and include applicable taxes unless stated otherwise. We reserve the right to update pricing without prior notice.",
      "Once an order is confirmed, it represents a binding contract. We will notify you promptly if any item becomes unavailable or if there is a pricing error.",
    ],
  },
  {
    number: "03",
    title: "Shipping & Delivery",
    paragraphs: [
      "We aim to dispatch orders within 2–3 business days of confirmation. Delivery timelines vary by location and are estimates, not guarantees.",
      "Risk of loss and title for products pass to you upon delivery. We are not liable for delays caused by courier services or events beyond our control.",
    ],
  },
  {
    number: "04",
    title: "Returns & Refunds",
    paragraphs: [
      "If you receive a damaged or incorrect product, please contact us within 48 hours of delivery at care@nityagro.com with photos and your order number.",
      "Refunds or replacements are issued at our discretion after review. We do not accept returns on food products for reasons other than damage or error on our part.",
    ],
  },
  {
    number: "05",
    title: "Intellectual Property",
    paragraphs: [
      "All content on this website — including text, images, logos and product descriptions — is the property of Nityagro and protected under applicable intellectual property laws.",
      "You may not reproduce, distribute or use our content for commercial purposes without prior written consent from Nityagro.",
    ],
  },
  {
    number: "06",
    title: "Health & Product Disclaimer",
    paragraphs: [
      "Our products are traditional, natural food items. They are not intended to diagnose, treat, cure or prevent any disease. Please consult a qualified health professional for medical advice.",
      "While we take great care in production and quality control, individual results from using our products may vary.",
    ],
  },
  {
    number: "07",
    title: "Limitation of Liability",
    paragraphs: [
      "To the extent permitted by law, Nityagro shall not be liable for any indirect, incidental or consequential damages arising from the use of our website or products.",
      "Our total liability in any matter shall not exceed the value of the order placed by the customer.",
    ],
  },
  {
    number: "08",
    title: "Governing Law",
    paragraphs: [
      "These Terms & Conditions are governed by the laws of Nepal. Any disputes shall be subject to the jurisdiction of the courts of Kathmandu.",
      "If you have any questions about these terms, please reach out to us at care@nityagro.com — we're happy to clarify.",
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
          The simple{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            agreement
          </span>{" "}
          between us.
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
          These Terms &amp; Conditions govern your use of nityagro.com and any
          purchase you make from us. We&apos;ve kept them clear and fair — the
          way good business should be.
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