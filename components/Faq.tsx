"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes Nityagro products different from regular products?",
    answer:
      "Nityagro sources all ingredients directly from trusted farmers, uses traditional extraction methods like wood-pressed and cold-pressed to retain maximum nutrients, and avoids any chemical additives or preservatives.",
  },
  {
    id: 2,
    question: "Are Nityagro products 100% natural and organic?",
    answer:
      "Yes, all Nityagro products are 100% natural and free from artificial additives. Our products go through 40+ lab tests to ensure purity and quality before reaching your hands.",
  },
  {
    id: 3,
    question:
      "What is the difference between Wood Pressed and Cold Pressed oils?",
    answer:
      "Wood pressed oils are extracted using a traditional wooden churner (ghani) at low speeds, preserving natural aroma and nutrients. Cold pressed oils use a modern steel expeller with controlled low heat. Both methods avoid chemicals, but wood pressed is the more traditional method.",
  },
  {
    id: 4,
    question: "How long does delivery take and what are the charges?",
    answer:
      "Delivery typically takes 3–7 business days depending on your location. We offer free delivery on orders above a certain amount. Please check the shipping policy page for the most up-to-date details.",
  },
  {
    id: 5,
    question: "Can I return a product if I'm not satisfied?",
    answer:
      "Yes, we have a hassle-free return policy. If you're not satisfied with your purchase, you can request a return within 7 days of delivery. Please contact our support team to initiate the process.",
  },
];

const INITIAL_VISIBLE = 5;

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base font-medium leading-snug transition-colors ${
            isOpen ? "text-[#2d7a4f] font-semibold" : "text-gray-800"
          }`}
        >
          {item.question}
        </span>

        {/* +/− icon */}
        <span className="ml-4 shrink-0 text-[#2d7a4f] text-2xl leading-none select-none">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* Answer — animated expand */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null); // first open by default
  const [showAll, setShowAll] = useState(false);
  const [apiFaqs, setApiFaqs] = useState<FAQItem[]>(faqs);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch("/api/faqs?homeOnly=true&limit=5", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) return;
        const rows = Array.isArray(payload.data) ? payload.data : [];
        if (!rows.length) return;
        setApiFaqs(
          rows.slice(0, 5).map((item: any) => ({
            id: Number(item.id || item.faqsId),
            question: item.question,
            answer: item.answer || "",
          })),
        );
      } catch {
        // Static FAQs remain as fallback.
      }
    };

    loadFaqs();
  }, []);

  const visibleFaqs = showAll ? apiFaqs : apiFaqs.slice(0, INITIAL_VISIBLE);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="bg-white py-6 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <h1
        className="text-center font-bold text-[32px] leading-[38.4px] tracking-[0.6px] text-[#235A49] mb-10"
        style={{ fontFamily: "Roboto Slab" }}
      >
        Frequently Asked Questions
      </h1>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {visibleFaqs.map((item) => (
          <FAQRow
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>

      {/* See More Button */}
      {apiFaqs.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="px-10 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-[#1e5631] bg-white hover:bg-gray-50 transition-colors"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </section>
  );
}
