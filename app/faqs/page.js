"use client";

import { useEffect, useState, useMemo } from "react";

const FAQ_DATA = [
  {
    category: "Products & Quality",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    questions: [
      {
        q: "What makes Nityagro products different from regular products?",
        a: "Nityagro sources all ingredients directly from trusted farmers, uses traditional extraction methods like wood-pressed and cold-pressed to retain maximum nutrients, and avoids any chemical additives or preservatives.",
      },
      {
        q: "Are Nityagro products 100% natural and organic?",
        a: "Yes. All our products are free from artificial colours, flavours, and preservatives. Many of our ingredients are sourced from certified organic farms, and we are continuously expanding our certified organic range.",
      },
      {
        q: "What is the difference between Wood Pressed and Cold Pressed oils?",
        a: "Wood pressing uses a traditional wooden churner (ghani) that rotates slowly, generating minimal heat and preserving natural flavour and nutrients. Cold pressing uses a mechanical press under controlled low temperatures. Both methods retain more nutrition than refined oils.",
      },
      {
        q: "How long does delivery take and what are the charges?",
        a: "Inside the Kathmandu Valley: 1–2 working days (free above NPR 199). Outside Valley: 2–4 working days (free above NPR 299). Hilly & Mountain Regions: 4–6 working days (free above NPR 399).",
      },
      {
        q: "Can I return a product if I'm not satisfied?",
        a: "We accept returns within 48 hours of delivery if the product is damaged or incorrect. Please email care@nityagro.com with photos and your order number. We do not accept returns on food items for change-of-mind.",
      },
    ],
  },
  {
    category: "Orders & Payment",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept eSewa, Khalti, ConnectIPS, bank transfers, and cash on delivery (COD) for orders within the Kathmandu Valley. Card payments via our secure gateway are also available.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 2 hours of placement by contacting us at care@nityagro.com or calling our support line. Once dispatched, cancellations are no longer possible.",
      },
      {
        q: "Is cash on delivery available?",
        a: "Yes, COD is available for orders within the Kathmandu Valley. For outside-valley orders, prepayment via digital wallet or bank transfer is required.",
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes. You will receive an SMS and email confirmation immediately after placing your order, followed by a dispatch notification with a tracking link once your parcel is picked up.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    questions: [
      {
        q: "Do you ship outside Nepal?",
        a: "We currently ship across Nepal only. International shipping is on our roadmap — subscribe to our newsletter to be notified when we launch in your country.",
      },
      {
        q: "How do I track my order?",
        a: "Once dispatched, you'll receive a tracking link via SMS and email. You can also visit the courier's website and enter your tracking number directly.",
      },
      {
        q: "What happens if I miss a delivery attempt?",
        a: "Couriers make up to 3 delivery attempts. If all attempts fail, the parcel is returned to us and re-shipping charges of NPR 120 will apply for a new delivery.",
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is not currently available, but we're working on it for the Kathmandu Valley. Orders placed before 2:00 PM are dispatched the same day and typically arrive the next working day.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    ),
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 48 hours of delivery for damaged or incorrect products only. Food items cannot be returned for change-of-mind or personal preference.",
      },
      {
        q: "How long does a refund take?",
        a: "Once your return is approved, refunds are processed within 5–7 working days back to your original payment method.",
      },
      {
        q: "My product arrived damaged — what should I do?",
        a: "Please photograph the damaged product and packaging immediately, then email care@nityagro.com with your order number and photos within 48 hours. We will arrange a replacement or refund promptly.",
      },
    ],
  },
  {
    category: "Health & Usage",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    questions: [
      {
        q: "Are your oils suitable for high-heat cooking?",
        a: "Wood-pressed groundnut and coconut oils have high smoke points and are suitable for sautéing and shallow frying. Cold-pressed mustard oil is best for tadka. We recommend avoiding deep frying with any cold-pressed oil to preserve nutrients.",
      },
      {
        q: "Can diabetics or people with heart conditions use your products?",
        a: "Our products are natural and free from additives, but we are not a medical authority. Please consult your physician before making dietary changes, especially if you have a diagnosed condition.",
      },
      {
        q: "How should I store wood-pressed oils?",
        a: "Store in a cool, dry place away from direct sunlight. Once opened, use within 3–4 months for best flavour and nutrition. Refrigeration is not required but extends shelf life in warm climates.",
      },
    ],
  },
];

const SECTION_KEYS = [
  "products-quality",
  "orders-payment",
  "shipping-delivery",
  "returns-refunds",
  "health-usage",
];

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00462C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
  </svg>
);

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqData, setFaqData] = useState(FAQ_DATA);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch("/api/faqs?activeOnly=true", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) return;

        const apiFaqs = Array.isArray(payload.data) ? payload.data : [];
        const grouped = FAQ_DATA.map((section, index) => {
          const questions = apiFaqs
            .filter((item) => item.faqSection === SECTION_KEYS[index])
            .map((item) => ({
              q: item.question,
              a: item.answer || "",
            }));
          return {
            ...section,
            questions,
          };
        });

        setFaqData(grouped);
      } catch {
        // Static FAQs remain as graceful fallback.
      }
    };

    loadFaqs();
  }, []);

  // Search across all categories
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    faqData.forEach((cat) => {
      cat.questions.forEach((item) => {
        if (
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
        ) {
          results.push({ ...item, category: cat.category });
        }
      });
    });
    return results;
  }, [faqData, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const currentCategory = faqData[activeCategory] || faqData[0];

  const handleCategoryClick = (idx) => {
    setActiveCategory(idx);
    setOpenQuestion(null);
    setSearchQuery("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Hero ── */}
      <section
        style={{
          background: "#F9F5EC",
          padding: "56px 40px 52px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "999px",
            background: "#FDE9B0",
            color: "#B07D10",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#F9B81F",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Help Centre · FAQs
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: "700",
            color: "#00462C",
            maxWidth: "720px",
            margin: "0 auto 20px",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.15,
          }}
        >
          Questions,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F9B81F 0%, #C17115 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            answered
          </span>{" "}
          honestly.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            maxWidth: "560px",
            margin: "0 auto 32px",
            fontSize: "15px",
            color: "#6b7280",
            lineHeight: "1.7",
            fontFamily: "sans-serif",
          }}
        >
          Everything you wanted to know about our oils, our process, and
          ordering — without the jargon.
        </p>

        {/* Search bar */}
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs - eg.  shipping, smoke point, refund..."
            style={{
              width: "100%",
              padding: "15px 20px 15px 48px",
              borderRadius: "999px",
              border: "1.5px solid #e5e7eb",
              background: "#ffffff",
              fontSize: "14px",
              color: "#374151",
              fontFamily: "sans-serif",
              outline: "none",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#00462C")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: "18px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>
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

      {/* ── Main Content ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "56px 40px 80px",
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
        }}
      >
        {/* ── Sidebar ── */}
        {!isSearching && (
          <aside style={{ width: "280px", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {faqData.map((cat, idx) => {
                const isActive = idx === activeCategory;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCategoryClick(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 18px",
                      borderRadius: "10px",
                      border: isActive ? "none" : "1px solid #e5e7eb",
                      background: isActive ? "#00462C" : "#ffffff",
                      color: isActive ? "#ffffff" : "#6b7280",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "sans-serif",
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "400",
                      transition: "all 0.2s",
                      width: "100%",
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>
                      {cat.icon}
                    </span>
                    {cat.category}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ── FAQ Panel ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isSearching ? (
            /* Search Results */
            <>
              <h2
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#00462C",
                  marginBottom: "6px",
                }}
              >
                Search Results
              </h2>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "24px",
                }}
              >
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
              </p>
              {searchResults.length === 0 ? (
                <div
                  style={{
                    padding: "48px 32px",
                    textAlign: "center",
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontFamily: "sans-serif",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  No results found. Try a different keyword.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {searchResults.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      question={item.q}
                      answer={item.a}
                      badge={item.category}
                      isOpen={openQuestion === `search-${idx}`}
                      onToggle={() =>
                        setOpenQuestion(
                          openQuestion === `search-${idx}` ? null : `search-${idx}`
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Category FAQs */
            <>
              <h2
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                  fontWeight: "700",
                  color: "#00462C",
                  marginBottom: "24px",
                }}
              >
                {currentCategory.category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentCategory.questions.length === 0 ? (
                  <div
                    style={{
                      padding: "48px 32px",
                      textAlign: "center",
                      background: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontFamily: "sans-serif",
                      color: "#9ca3af",
                      fontSize: "14px",
                    }}
                  >
                    No FAQs added for this section yet.
                  </div>
                ) : (
                  currentCategory.questions.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      question={item.q}
                      answer={item.a}
                      isOpen={openQuestion === idx}
                      onToggle={() =>
                        setOpenQuestion(openQuestion === idx ? null : idx)
                      }
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle, badge }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        boxShadow: isOpen ? "0 2px 16px rgba(0,70,44,0.07)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1 }}>
          {badge && (
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontFamily: "sans-serif",
                fontWeight: "600",
                color: "#00462C",
                background: "#e8f5ee",
                padding: "2px 10px",
                borderRadius: "999px",
                marginBottom: "6px",
                letterSpacing: "0.04em",
              }}
            >
              {badge}
            </span>
          )}
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "14.5px",
              fontWeight: isOpen ? "600" : "400",
              color: isOpen ? "#00462C" : "#374151",
              margin: 0,
              lineHeight: 1.5,
              transition: "color 0.2s",
            }}
          >
            {question}
          </p>
        </div>
        <span
          style={{
            flexShrink: 0,
            color: isOpen ? "#00462C" : "#9ca3af",
            transition: "color 0.2s",
          }}
        >
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 24px 20px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: "1.78",
              margin: "16px 0 0",
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
