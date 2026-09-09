"use client";

const SECTIONS = [
  {
    number: "01",
    title: "Our Quality Promise",
    subtitle: "If Something Isn’t Right, We’ll Make It Right",
    paragraphs: [
      "We take care to ensure every Nityagro product is properly checked, packed, and sealed before it leaves us.",
      "If your order arrives damaged, leaking, tampered with, or different from what you ordered, please let us know. We’ll review the issue and work to resolve it as quickly as possible.",
      "As our wood-pressed oils, stone-ground flours, and whole spices are food products, our return and replacement policy is designed to protect both product freshness and food safety.",
    ],
    points: [],
  },

  {
    number: "02",
    title: "When You Can Request a Return or Replacement",
    subtitle: "",
    paragraphs: [
      "We accept return or replacement requests when:",
    ],
    points: [
      "The product arrives damaged, leaking, or with a broken seal.",
      "You receive an incorrect product or quantity compared to your order.",
      "The product has passed its Best Before date on arrival.",
      "There is a clear product or manufacturing issue, such as contamination, foreign particles, or an unusual/off smell.",
    ],
  },

  {
    number: "03",
    title: "Return & Replacement Window",
    subtitle: "",
    paragraphs: [
      "Please contact us within 48 hours of delivery by emailing admin@nityagro.com.",
      "Include your order ID, a short description of the issue, and clear photographs of the product and outer packaging.",
      "Requests made after 48 hours may not be eligible for return or replacement, as it becomes difficult to verify the condition of the product after delivery.",
    ],
    points: [],
  },

  {
    number: "04",
    title: "What We Cannot Accept",
    subtitle: "",
    paragraphs: [
      "For food safety and hygiene reasons, we cannot accept:",
    ],
    points: [
      "Opened or partially used bottles, packets, or jars.",
      "Returns based solely on personal taste or preference. Wood-pressed oils naturally have a distinct aroma, colour, and flavour.",
      "Products purchased through unauthorised sellers or third-party sources.",
      "Damage caused by improper storage after delivery, including exposure to excessive heat or direct sunlight.",
    ],
  },

  {
    number: "05",
    title: "How the Process Works",
    subtitle: "",
    paragraphs: [],
    points: [],
    steps: [
      {
        title: "Contact us",
        description:
          "Email admin@nityagro.com within 48 hours of delivery with your order ID, photographs, and a brief description of the issue.",
      },
      {
        title: "We review your request",
        description:
          "Our team will review the details and get back to you within 1 working day with the next steps.",
      },
      {
        title: "We resolve the issue",
        description:
          "Depending on the situation, we may offer a replacement or refund. For eligible damaged products, we may not require the item to be returned.",
      },
      {
        title: "Resolution",
        description:
          "Once approved, your replacement will be dispatched or your refund will be processed within 3–5 working days.",
      },
    ],
  },

  {
    number: "06",
    title: "Refund Timelines",
    subtitle: "",
    paragraphs: [
      "Once a refund is approved, the amount will be returned to your original payment method, subject to the processing time of the payment provider or bank.",
      "For digital payments and wallets, refunds may be processed faster, while card or bank payments may take additional working days to reflect in your account.",
      "For Cash on Delivery (COD) orders, refunds will be processed through bank transfer. Our team will contact you for the required bank details.",
    ],
    points: [],
  },

  {
    number: "07",
    title: "Terms & Conditions",
    subtitle: "",
    paragraphs: [
      "By accessing nityagro.com or placing an order through our website, you agree to our Terms & Conditions, Return & Replacement Policy, and Privacy Policy.",
      "Nityagro reserves the right to update its policies from time to time. Any changes will be updated on this website and will apply to orders placed after the updated policy comes into effect.",
    ],
    points: [],
  },

  {
    number: "08",
    title: "Order Cancellations",
    subtitle: "Need to Cancel Your Order?",
    paragraphs: [
      "Orders can be cancelled free of charge before dispatch.",
      "If you wish to cancel your order, please contact us as soon as possible at admin@nityagro.com with your order ID.",
      "Once an order has been dispatched, cancellation may no longer be possible. If the parcel is refused or returned after dispatch, applicable shipping or return charges may be deducted from the refund.",
    ],
    points: [],
  },
];

// ─────────────────────────────────────────────
// Leaf Icon
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function TermsConditionsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ─────────────────────────────────────
          Hero Header
      ───────────────────────────────────── */}

      <section
        className="w-full px-6 pt-14 pb-12 text-center"
        style={{
          background: "#F9F5EC",
          margin: "0 auto",
        }}
      >
        {/* Badge */}

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          ✦ Return &amp; Refund Policy
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
          Return &amp; Refund{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Policy.
          </span>
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
          Your trust matters more than any single order. If something isn&apos;t
          right with what reached you, we&apos;ll resolve it quickly — here&apos;s
          exactly how.
        </p>

        {/* Date */}

        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            fontFamily: "sans-serif",
          }}
        >
          Last updated: 1 May 2026
        </p>
      </section>

      {/* ─────────────────────────────────────
          Gold Divider
      ───────────────────────────────────── */}

      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #D4A853 30%, #D4A853 70%, transparent)",
        }}
      />

      {/* ─────────────────────────────────────
          Sections
      ───────────────────────────────────── */}

      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "56px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {SECTIONS.map((section, idx) => {
            const isLast = idx === SECTIONS.length - 1;

            return (
              <div
                key={section.number}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "stretch",
                }}
              >
                {/* ─────────────────────────────
                    Left: Icon + Number + Line
                ───────────────────────────── */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: "52px",
                  }}
                >
                  {/* Icon */}

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

                  {/* Section Number */}

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

                  {/* Connecting Line */}

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

                {/* ─────────────────────────────
                    Right: Content
                ───────────────────────────── */}

                <div
                  style={{
                    flex: 1,
                    paddingBottom: isLast ? "0" : "40px",
                    paddingTop: "4px",
                  }}
                >
                  {/* Section Title */}

                  <h2
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                      fontWeight: "700",
                      color: "#00462C",
                      marginBottom: section.subtitle ? "6px" : "12px",
                      lineHeight: 1.3,
                    }}
                  >
                    {section.title}
                  </h2>

                  {/* ─────────────────────────
                      Subtitle
                  ───────────────────────── */}

                  {section.subtitle && (
                    <h3
                      style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#D4A853",
                        marginBottom: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {section.subtitle}
                    </h3>
                  )}

                  {/* ─────────────────────────
                      Paragraphs
                  ───────────────────────── */}

                  {section.paragraphs.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.78",
                            fontFamily: "sans-serif",
                            margin: 0,
                          }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* ─────────────────────────
                      Bullet Points
                  ───────────────────────── */}

                  {section.points.length > 0 && (
                    <ul
                      style={{
                        margin: "14px 0 0",
                        paddingLeft: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "9px",
                      }}
                    >
                      {section.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            lineHeight: "1.7",
                            fontFamily: "sans-serif",
                            paddingLeft: "4px",
                          }}
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* ─────────────────────────
                      Numbered Process Steps
                  ───────────────────────── */}

                  {section.steps && section.steps.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                        marginTop: "8px",
                      }}
                    >
                      {section.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          style={{
                            display: "flex",
                            gap: "14px",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Step Number */}

                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              minWidth: "30px",
                              borderRadius: "50%",
                              background: "#F9F5EC",
                              border: "1px solid #D4A853",
                              color: "#C17115",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "sans-serif",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {stepIndex + 1}
                          </div>

                          {/* Step Content */}

                          <div
                            style={{
                              flex: 1,
                              paddingTop: "2px",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 4px",
                                fontFamily: "'Georgia', serif",
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#00462C",
                                lineHeight: 1.4,
                              }}
                            >
                              {step.title}
                            </h4>

                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#4b5563",
                                lineHeight: "1.7",
                                fontFamily: "sans-serif",
                              }}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}