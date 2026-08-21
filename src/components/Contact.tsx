"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const interestOptions = [
  "AI / ML",
  "Robotics",
  "Software",
  "Research & Development",
  "GPU / HPC",
  "AI Infrastructure",
  "Other",
];

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  city: string;
  subscribeNewsletters: boolean;
  subscribeArticles: boolean;
  subscribeBlogs: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
    city: "",
    subscribeNewsletters: false,
    subscribeArticles: false,
    subscribeBlogs: false,
  });

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) errs.message = "Please enter a message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("submitting");

    try {
      // Save to database
      const res = await fetch("/api/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // Send email notifications (fire and forget)
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "contact", data: form }),
        });
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
      city: "",
      subscribeNewsletters: false,
      subscribeArticles: false,
      subscribeBlogs: false,
    });
    setErrors({});
    setFormState("idle");
  };

  return (
    <section id="contact" className="relative py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0B0B0D] to-[#080808]" />
      <div className="absolute inset-0 tech-grid opacity-10" />

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="contactLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {[15, 35, 65, 85].map((x, i) => (
            <line key={i} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="url(#contactLine)" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Contact info */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
                Get in Touch
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Let&apos;s Build
              <br />
              <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
                What&apos;s Next.
              </span>
            </motion.h2>

            <motion.p
              className="text-white/45 leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Have a difficult problem, a technology idea or a research challenge?
              Start a conversation with our team.
            </motion.p>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">
                  Company
                </div>
                <p className="text-white/60 text-sm">Applied Systems Research & Technology</p>
                <p className="text-white/40 text-sm">OPC Private Limited</p>
              </div>

              <div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">
                  Office
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  VH 016, PRUKSA SILVANA<br />
                  Nimbekaipura Road<br />
                  Bommenahalli (Budigere Cross)<br />
                  Bangalore Urban, Karnataka 560049<br />
                  India
                </p>
                {/* Google Map */}
                <div className="mt-4 glass-card overflow-hidden rounded-xl p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d77.7!3d12.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzI0LjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                    width="100%"
                    height="200"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ASRT Office Location"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">
                    Phone
                  </div>
                  <a
                    href="tel:+919742994849"
                    className="text-white/60 text-sm hover:text-[#FF9040] transition-colors"
                  >
                    +91 9742994849
                  </a>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">
                    Email
                  </div>
                  <a
                    href="mailto:anandhi@appliedaiml.com"
                    className="text-white/60 text-sm hover:text-[#FF9040] transition-colors"
                  >
                    anandhi@appliedaiml.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {formState === "success" ? (
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Received</h3>
                <p className="text-sm text-white/40 mb-6 max-w-sm">
                  Thank you for contacting Applied Systems Research & Technology.
                  Your message has been submitted successfully.
                  {form.subscribeNewsletters || form.subscribeArticles || form.subscribeBlogs
                    ? " You will receive updates based on your subscription preferences."
                    : ""}
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 text-sm text-[#FF9040] border border-[#FF7200]/20 rounded-xl hover:bg-[#FF7200]/10 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors ${
                        errors.name ? "border-red-500/50" : "border-white/8"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors ${
                        errors.email ? "border-red-500/50" : "border-white/8"
                      }`}
                      placeholder="you@company.com"
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                      placeholder="Your city"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                      Area of Interest
                    </label>
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 focus:outline-none focus:border-[#FF7200]/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0B0B0D]">Select an area</option>
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B0B0D]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors resize-none ${
                      errors.message ? "border-red-500/50" : "border-white/8"
                    }`}
                    placeholder="Tell us about your project or research challenge..."
                  />
                  {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>

                {/* Newsletter Subscription Checkboxes */}
                <div className="border-t border-white/5 pt-5">
                  <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">
                    Stay in the Loop
                  </p>
                  <p className="text-xs text-white/30 mb-3">
                    Select what you&apos;d like to receive updates about:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.subscribeNewsletters}
                        onChange={(e) =>
                          setForm({ ...form, subscribeNewsletters: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF7200] focus:ring-[#FF7200]/30 focus:ring-offset-0"
                      />
                      <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        Newsletters
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.subscribeArticles}
                        onChange={(e) =>
                          setForm({ ...form, subscribeArticles: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF7200] focus:ring-[#FF7200]/30 focus:ring-offset-0"
                      />
                      <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        Articles & Research Papers
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.subscribeBlogs}
                        onChange={(e) =>
                          setForm({ ...form, subscribeBlogs: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF7200] focus:ring-[#FF7200]/30 focus:ring-offset-0"
                      />
                      <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        Blog Updates
                      </span>
                    </label>
                  </div>
                </div>

                <p className="text-[10px] text-white/20 leading-relaxed">
                  By submitting this form, you agree to our privacy policy. We will
                  use your information only to respond to your inquiry and, if
                  selected, to send you updates.
                </p>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full py-3 px-6 bg-[#E66800] hover:bg-[#FF7200] disabled:bg-[#E66800]/50 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-[#FF7200]/20 flex items-center justify-center gap-2"
                >
                  {formState === "submitting" ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Submitting...</span>
                    </>
                  ) : formState === "error" ? (
                    <span>Try Again</span>
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                {formState === "error" && (
                  <p className="text-xs text-red-400 text-center">
                    We couldn&apos;t send your message. Please check your connection and try again.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
