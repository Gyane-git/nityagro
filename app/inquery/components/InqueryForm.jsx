"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function InquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inquiry Submitted:", form);
    alert("Inquiry sent successfully!");
  };

  return (
    <div className="-mt-10 sm:-mt-10 md:-mt-5 lg:mt-0 min-h-screen flex items-center justify-center px-4 py-16">
      {/* Page Wrapper */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-1">
        {/* Card */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-xl border border-green-100 p-5 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700">Send Inquiry</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">We’ll get back to you as soon as possible</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-green-50 text-gray-800 rounded-lg border border-green-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none transition" required />

            {/* Email */}
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-green-50 text-gray-800 rounded-lg border border-green-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none transition" required />

            {/* Phone */}
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-green-50 text-gray-800 rounded-lg border border-green-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none transition" required />

            {/* Subject */}
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-green-50 text-gray-800 rounded-lg border border-green-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none transition" required />

            {/* Message */}
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows="5" className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-green-50 text-gray-800 rounded-lg border border-green-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none resize-none transition" required />

            {/* Button */}
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition py-3 sm:py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/30">
              <Send className="w-5 h-5" />
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}