"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitError(error?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
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
    <main style={{ minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "64px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px 40px 36px",
            border: "1px solid #e5e7eb",
          }}
        >
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
            Tell us what&apos;s on your mind
          </h1>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.7",
              marginBottom: "28px",
            }}
          >
            Fill the form and our team will reply within 4 working hours.
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
              <p
                style={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: "700",
                  color: "#00462C",
                  fontSize: "1.1rem",
                  marginBottom: "6px",
                }}
              >
                Message sent!
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: "13.5px", color: "#6b7280" }}>
                We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12.5px", color: "#374151", marginBottom: "6px" }}>
                    Your name
                  </label>
                  <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12.5px", color: "#374151", marginBottom: "6px" }}>
                    Email
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12.5px", color: "#374151", marginBottom: "6px" }}>
                    Phone
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12.5px", color: "#374151", marginBottom: "6px" }}>
                  Subject
                </label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required style={inputStyle} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12.5px", color: "#374151", marginBottom: "6px" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                />
              </div>

              {submitError ? (
                <p style={{ color: "#b42318", fontFamily: "sans-serif", fontSize: "13px", marginBottom: "12px" }}>
                  {submitError}
                </p>
              ) : null}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "13px 28px",
                    borderRadius: "8px",
                    background: "#00462C",
                    color: "#fff",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "background 0.2s",
                    letterSpacing: "0.02em",
                  }}
                >
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#00462C", borderRadius: "16px", padding: "32px 28px", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px" }}>
              Reach us directly
            </h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#e2f0e8" }}>977-9801135604</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#e2f0e8" }}>hello@nityagro.in</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#e2f0e8" }}>Rupendehi, Lumbini, Nepal</p>
          </div>
        </div>
      </section>
    </main>
  );
}
