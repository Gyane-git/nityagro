"use client";

const SECTIONS = [
  {
    number: "Section 01",
    title: "Information We Collect",
    paragraphs: [
      "Personal details you share with us — name, email, phone number, billing and shipping address — when you place an order, create an account, or subscribe to our newsletter.",
      "Order and payment information processed securely through our certified payment partners. Nityagro does not store your full card details on our servers.",
      "Technical data such as IP address, browser type, device information and pages visited, collected automatically to help us improve your experience.",
    ],
  },
  {
    number: "Section 02",
    title: "How We Use Your Information",
    paragraphs: [
      "To process and deliver your orders of wood-pressed oils, flours and spices, including order confirmations and shipping updates.",
      "To respond to enquiries, provide customer support and share information about our farms, methods and new harvests when you opt in.",
      "To improve our website, products and services through anonymised analytics — never to sell your personal data to third parties.",
    ],
  },
  {
    number: "Section 03",
    title: "Cookies & Tracking",
    paragraphs: [
      "We use essential cookies to keep your cart and session active, and analytics cookies to understand how visitors use our site. You may disable non-essential cookies through your browser settings at any time.",
    ],
  },
  {
    number: "Section 04",
    title: "Data Security",
    paragraphs: [
      "Your information is stored on secure servers protected by industry-standard encryption (SSL/TLS). Access is restricted to authorised Nityagro team members on a need-to-know basis.",
      "We retain personal data only as long as necessary to fulfil the purposes outlined in this policy or as required by Nepal law.",
    ],
  },
  {
    number: "Section 05",
    title: "Sharing With Third Parties",
    paragraphs: [
      "We share data only with trusted partners who help us run our business — payment processors, shipping couriers and email providers — under strict confidentiality.",
      "We may disclose information if required by law, court order or to protect the rights and safety of Nityagro and its customers.",
    ],
  },
  {
    number: "Section 06",
    title: "Your Rights",
    paragraphs: [
      "You may request access to, correction of, or deletion of your personal data at any time by writing to us at care@nityagro.com.",
      "You can unsubscribe from marketing emails using the link in any newsletter, or by contacting our team directly.",
    ],
  },
];

// Gold leaf icon matching screenshot
const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── Hero Header ── */}
      <section
        className="w-full flex flex-col items-center text-center px-6 pt-14 pb-12"
        style={{ background: "#F9F5EC" }}
      >
        {/* Privacy Policy badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-white text-xs font-bold tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
            letterSpacing: "0.12em",
          }}
        >
          ✦ Privacy Policy
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-tight mb-5"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            color: "#1a1a1a",
            maxWidth: "640px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Your trust is our most{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            valuable
          </span>{" "}
          harvest.
        </h1>

        {/* Subtitle */}
        <p
          className="text-gray-600 leading-relaxed mb-4"
          style={{ maxWidth: "580px", fontSize: "14px" }}
        >
          This Privacy Policy explains how Nityagro collects, uses and safeguards the information
          you share with us — written in plain language, the same way we believe in honest food.
        </p>

        {/* Date */}
        <p className="text-gray-400 text-sm">Last updated: 1 May 2026</p>
      </section>

      {/* ── Thin divider ── */}
      <div className="w-full" style={{ height: "1px", background: "linear-gradient(90deg, transparent, #D4A853 30%, #D4A853 70%, transparent)" }} />

      {/* ── Sections ── */}
      <section className="mx-auto px-6 py-14 " style={{ maxWidth: "1240px" }}>
        <div className="flex flex-col gap-12">
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="flex gap-6 items-start">

              {/* ── Left: gold icon + vertical line ── */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ paddingTop: "4px" }}>
                {/* Gold circle icon */}
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
                    boxShadow: "0 4px 14px rgba(193,113,21,0.30)",
                    flexShrink: 0,
                  }}
                >
                  <LeafIcon />
                </div>
                {/* Vertical connecting line */}
                {idx < SECTIONS.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      minHeight: "60px",
                      marginTop: "8px",
                      background: "linear-gradient(180deg, #D4A853 0%, transparent 100%)",
                      opacity: 0.35,
                    }}
                  />
                )}
              </div>

              {/* ── Right: content ── */}
              <div className="flex flex-col gap-3 flex-1 pb-2">
                {/* Section number */}
                <span
                  className="font-semibold text-xs tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "0.1em",
                  }}
                >
                  {section.number}
                </span>

                {/* Section title */}
                <h2
                  className="font-bold leading-tight"
                  style={{
                    color: "#00462C",
                    fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {section.title}
                </h2>

                {/* Paragraphs */}
                <div className="flex flex-col gap-3">
                  {section.paragraphs.map((p, pi) => (
                    <p
                      key={pi}
                      className="leading-relaxed text-gray-600"
                      style={{ fontSize: "14px", lineHeight: "1.75" }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      

    </main>
  );
}