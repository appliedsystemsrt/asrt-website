"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BookDemoProps {
  open: boolean;
  onClose: () => void;
}

export default function BookDemo({ open, onClose }: BookDemoProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    setSendError(false);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "demo", data: form }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setSubmitted(true);
      } else {
        setSendError(true);
        setSubmitted(false);
      }
    } catch {
      setSendError(true);
      setSubmitted(false);
    }
    setSending(false);
  };

  const reset = () => {
    setForm({ name: "", email: "", company: "", phone: "", interest: "", message: "" });
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg glass-card p-6 md:p-8 bg-white/[0.06] dark:bg-white/[0.06] border border-white/10 rounded-2xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <motion.span
                    className="text-2xl text-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    ✓
                  </motion.span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Demo Booked!</h3>
                <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
                  We&apos;ll reach out to schedule your personalized demo of our AI solutions.
                </p>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 text-sm text-[#FF9040] border border-[#FF7200]/20 rounded-xl hover:bg-[#FF7200]/10 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF7200]/20 bg-[#FF7200]/5 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-[#FF9040]/80 tracking-widest uppercase">
                      Book a Demo
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    See Our AI in Action
                  </h3>
                  <p className="text-sm text-white/40">
                    Get a personalized walkthrough of our AI, ML, robotics and software solutions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                      Area of Interest
                    </label>
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 focus:outline-none focus:border-[#FF7200]/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0B0B0D]">Select an area</option>
                      <option value="ai" className="bg-[#0B0B0D]">AI / Machine Learning</option>
                      <option value="robotics" className="bg-[#0B0B0D]">Robotics</option>
                      <option value="software" className="bg-[#0B0B0D]">Software Engineering</option>
                      <option value="jarvis" className="bg-[#0B0B0D]">JARVIS AI Business Analyst</option>
                      <option value="gpu" className="bg-[#0B0B0D]">GPU / HPC Computing</option>
                      <option value="other" className="bg-[#0B0B0D]">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors resize-none"
                      placeholder="Tell us about your use case..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!form.name.trim() || !form.email.trim() || sending}
                    className="w-full py-3 px-6 bg-[#E66800] hover:bg-[#FF7200] disabled:bg-[#E66800]/30 disabled:text-white/30 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-[#FF7200]/20 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>Book My Demo <span>→</span></>
                    )}
                  </button>

                  {sendError && (
                    <p className="text-xs text-red-400 text-center">
                      Failed to send. Please check your connection and try again.
                    </p>
                  )}

                  <p className="text-[10px] text-white/20 text-center">
                    No spam. We&apos;ll only use your info to schedule the demo.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
