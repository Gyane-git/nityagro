"use client";

const DELIVERY_ZONES = [
  {
    zone: "Inside Valley",
    coverage: "Kathmandu, Bhaktapur, Lalitpur",
    timeline: "1-2 Working Days",
    charges: "Free Above NPR 199",
  },
  {
    zone: "Outside Valley",
    coverage: "Most Provinces Capitals Across Nepal",
    timeline: "2-4 Working Days",
    charges: "Free Above NPR 299",
  },
  {
    zone: "Hilly & Mountain Region",
    coverage: "Hilly Regions, Islands, North-East States",
    timeline: "4-6 Working Days",
    charges: "Free Above NPR 399",
  },
];

const SECTIONS = [
  {
    number: "01",
    title: "Order Processing",
    paragraphs: [
      "Orders placed before 2:00 PM on a working day are processed the same day. Orders placed later, or on Saturday and public holidays, move into the next working day's queue.",
      "Because we press oils in small batches, certain SKUs may take 1–2 extra working days during peak season. We'll notify you proactively if your order is affected.",
    ],
  },
  {
    number: "02",
    title: "Packaging Standards",
    paragraphs: [
      "Each glass bottle is wrapped in food-grade bubble film, cushioned with shredded kraft paper, and secured inside double-walled corrugated boxes. We use no plastic peanuts or single-use foam.",
      "Tamper-evident seals are placed across every box flap so you can identify any in-transit interference at a glance.",
    ],
  },
  {
    number: "03",
    title: "Tracking Your Order",
    paragraphs: [
      "Once dispatched, you'll receive an SMS, WhatsApp and email with a live tracking link from our courier partner (PathaoCourier, Pick & Drop or NepalCanMove depending on your pincode).",
      "If your tracking shows no movement for more than 48 hours, please write to care@nityagro.com — we will escalate it directly with the courier.",
    ],
  },
  {
    number: "04",
    title: "Delivery Attempts & Failures",
    paragraphs: [
      "Couriers make up to 3 delivery attempts before returning the parcel to us. Please ensure someone is available at the shipping address and your phone is reachable.",
      "If a parcel is RTO'd (returned to origin) due to incorrect address or non-availability, re-shipping charges of NPR 120 will apply.",
    ],
  },
  {
    number: "05",
    title: "International Shipping",
    paragraphs: [
      "We currently ship across Nepal only. International shipping is on our roadmap — please subscribe to our newsletter to be notified when we launch in your country.",
    ],
  },
];

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

export default function ShippingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Hero Header ── */}
      <section
        style={{
          background: "#F9F5EC",
         
          margin: "0 auto",
          padding: "56px 40px 48px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: "24px",
          }}
        >
          ✦ Terms &amp; Conditions
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: "700",
            color: "#1a1a1a",
            maxWidth: "640px",
            margin: "0 auto 20px",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.2,
          }}
        >
          From our press to your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            kitchen.
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
          We ship across Nepal in protective, plastic-free packaging — usually
          within a week. Here's everything you need to know about how your order
          travels.
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

      {/* ── Gold divider ── */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #D4A853 30%, #D4A853 70%, transparent)",
        }}
      />

      {/* ── Delivery Zones Table ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "56px 40px 40px",
        }}
      >
        {/* Table heading */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            Delivery Zones &amp; Charges
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              fontFamily: "sans-serif",
            }}
          >
            Transparent shipping fees based on your region.
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #e5e5e0",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "sans-serif",
              fontSize: "13.5px",
            }}
          >
            {/* Header */}
            <thead>
              <tr style={{ background: "#00462C" }}>
                {["Zone", "Coverage", "Timeline", "Charges"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "13px 18px",
                      textAlign: "left",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "11.5px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {DELIVERY_ZONES.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? "#ffffff" : "#fafaf7",
                    borderBottom:
                      i < DELIVERY_ZONES.length - 1
                        ? "1px solid #efefea"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 18px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    {row.zone}
                  </td>
                  <td style={{ padding: "14px 18px", color: "#4b5563" }}>
                    {row.coverage}
                  </td>
                  <td style={{ padding: "14px 18px", color: "#4b5563" }}>
                    {row.timeline}
                  </td>
                  <td style={{ padding: "14px 18px", color: "#4b5563" }}>
                    {row.charges}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Sections ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "16px 40px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SECTIONS.map((section, idx) => {
            const isLast = idx === SECTIONS.length - 1;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
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
                  {/* Light gray rounded-square icon */}
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
                      opacity: 0.7,
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
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