"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    background: "#fff",
    fontSize: "13.5px",
    color: "#374151",
    fontFamily: "sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Top Section: Form + Right Panel ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "64px 40px 64px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* ── Left: Contact Form Card ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px 40px 36px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "13px",
              fontWeight: "600",
              color: "#C17115",
              letterSpacing: "0.04em",
              marginBottom: "10px",
            }}
          >
            Write to Us
          </p>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
              fontWeight: "700",
              color: "#00462C",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            Tell us what's on your mind
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.7",
              marginBottom: "28px",
            }}
          >
            Fill the form and a human from our team will reply within 4 working
            hours.
          </p>

          {submitted ? (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                background: "#f0faf4",
                borderRadius: "10px",
                border: "1px solid #bbf0d4",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#00462C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p style={{ fontFamily: "'Georgia', serif", fontWeight: "700", color: "#00462C", fontSize: "1.1rem", marginBottom: "6px" }}>
                Message sent!
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: "13.5px", color: "#6b7280" }}>
                We'll get back to you within 4 working hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name + Email row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "sans-serif",
                      fontSize: "12.5px",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#00462C")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "sans-serif",
                      fontSize: "12.5px",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#00462C")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "sans-serif",
                    fontSize: "12.5px",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter your subject"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#00462C")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: "28px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "sans-serif",
                    fontSize: "12.5px",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Share details about your enquiry..."
                  required
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "120px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00462C")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Submit */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  style={{
                    padding: "13px 28px",
                    borderRadius: "8px",
                    background: "#00462C",
                    color: "#fff",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#005c38")}
                  onMouseLeave={(e) => (e.target.style.background = "#00462C")}
                >
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Right Column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Reach us directly — dark green card */}
          <div
            style={{
              background: "#00462C",
              borderRadius: "16px",
              padding: "32px 28px",
              color: "#fff",
            }}
          >
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#fff",
                marginBottom: "24px",
              }}
            >
              Reach us directly
            </h2>

            {/* Phone */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  color: "#e2f0e8",
                  marginBottom: "2px",
                }}
              >
                977- 9801135604
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#8fbfa0",
                }}
              >
                Mon–Sat, 9 AM – 7 PM
              </p>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  color: "#e2f0e8",
                  marginBottom: "2px",
                }}
              >
                hello@nityagro.in
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#8fbfa0",
                }}
              >
                For everything else
              </p>
            </div>

            {/* Address */}
            <div>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  color: "#e2f0e8",
                  marginBottom: "2px",
                }}
              >
                Nityagro Press House
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#8fbfa0",
                }}
              >
                Rupendehi, Lumbini, Nepal
              </p>
            </div>
          </div>

          {/* Quick answers card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                color: "#C17115",
                letterSpacing: "0.04em",
                marginBottom: "16px",
              }}
            >
              Quick answers
            </p>

            {/* Q1 */}
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#00462C",
                  marginBottom: "4px",
                }}
              >
                Can I order on WhatsApp?
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.65",
                }}
              >
                Yes — message us on 977- 9801135604 to place orders directly.
              </p>
            </div>

            {/* Q2 */}
            <div style={{ marginBottom: "18px" }}>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#00462C",
                  marginBottom: "4px",
                }}
              >
                Do you ship internationally?
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.65",
                }}
              >
                Currently shipping pan-Nepal. International coming soon.
              </p>
            </div>

            {/* Read all FAQs link */}
            <a
              href="/faqs"
              style={{
                fontFamily: "sans-serif",
                fontSize: "13.5px",
                fontWeight: "600",
                color: "#C17115",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Read all FAQs
            </a>
          </div>
        </div>
      </section>

      {/* ── Come Visit Section ── */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto 64px",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "380px",
          }}
        >
          {/* Left: dark green content */}
          <div
            style={{
              background: "#00462C",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Label */}
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: "600",
                color: "#F9B81F",
                letterSpacing: "0.04em",
                marginBottom: "14px",
              }}
            >
              Come Visit
            </p>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "18px",
                lineHeight: 1.2,
              }}
            >
              Smell the ghani in person.
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#a8d4b8",
                lineHeight: "1.75",
                marginBottom: "28px",
                maxWidth: "380px",
              }}
            >
              Step inside our open workshop, watch the wooden kolhu turn at 28
              RPM, taste oil straight off the press, and walk away with a bottle
              pressed for you that morning.
            </p>

            {/* Address + Hours */}
            <div style={{ marginBottom: "28px" }}>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  color: "#e2f0e8",
                  marginBottom: "4px",
                }}
              >
                Rupendehi, Lumbini
              </p>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  color: "#e2f0e8",
                }}
              >
                Tue–Sat, 10 AM – 5 PM
              </p>
            </div>

            {/* Get Direction button */}
            <div>
              <a
                href="https://maps.google.com/?q=Rupendehi,Lumbini,Nepal"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  background: "#F9B81F",
                  color: "#1a1a1a",
                  fontFamily: "sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                Get Direction
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Google Maps embed */}
          <div style={{ position: "relative", minHeight: "380px" }}>
            <iframe
              title="Nityagro Press House Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31739249717!2d83.40358!3d27.68588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996864339ab4d37%3A0x8ba6e38ec4c0cdd6!2sRupandehi%2C%20Lumbini%20Province%2C%20Nepal!5e0!3m2!1sen!2snp!4v1715000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{
                border: "none",
                display: "block",
                minHeight: "380px",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}