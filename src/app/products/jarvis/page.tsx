"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#080808] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 tech-grid opacity-10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <motion.img
          src="/brand-logo.jpeg"
          alt="ASRT"
          className="w-20 h-20 object-contain mx-auto mb-6"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="font-mono text-[10px] text-[#FF9040]/50 tracking-[0.3em] uppercase mb-3">
          Initializing Intelligence Layer
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#FF9040] via-purple-400 to-[#FF9040] bg-clip-text text-transparent">
            JARVIS AI
          </span>
        </h1>
        <p className="text-xs text-white/30 font-mono tracking-widest uppercase mb-8">
          AI Business Analyst
        </p>
        <div className="w-64 h-0.5 bg-white/5 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF7200] to-[#FF7200] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-3">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Data Flow Visualization ──────────────────────────────────────────────────
function DataFlowViz() {
  const nodes = [
    { label: "TRANSACTIONS", x: "10%", y: "30%", icon: "📊" },
    { label: "INVENTORY", x: "10%", y: "70%", icon: "📦" },
    { label: "USER BEHAVIOR", x: "10%", y: "50%", icon: "👤" },
    { label: "JARVIS AI", x: "50%", y: "50%", icon: "🧠" },
    { label: "BUSINESS INSIGHTS", x: "85%", y: "50%", icon: "💡" },
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Connection lines */}
        <motion.line x1="22%" y1="30%" x2="45%" y2="50%" stroke="rgba(139,92,246,0.15)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
        <motion.line x1="22%" y1="70%" x2="45%" y2="50%" stroke="rgba(139,92,246,0.15)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8 }} />
        <motion.line x1="22%" y1="50%" x2="45%" y2="50%" stroke="rgba(139,92,246,0.15)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.1 }} />
        <motion.line x1="55%" y1="50%" x2="78%" y2="50%" stroke="rgba(139,92,246,0.15)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.4 }} />
      </svg>
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.x, top: node.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
        >
          <div className={`px-4 py-3 rounded-xl border ${i === 3 ? "border-[#FF7200]/30 bg-[#FF7200]/10" : "border-white/8 bg-white/[0.03]"} backdrop-blur-sm`}>
            <div className="text-center">
              <span className="text-lg mb-1 block">{node.icon}</span>
              <span className={`font-mono text-[9px] tracking-widest uppercase ${i === 3 ? "text-[#FF9040]" : "text-white/40"}`}>
                {node.label}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────
const navItems = [
  "Overview", "Problem", "Intelligence", "Modules", "Architecture",
  "Technology", "Security", "Performance", "Screens", "Research", "Roadmap", "Contact"
];

function StickyNav({ activeSection }: { activeSection: string }) {
  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-lg whitespace-nowrap transition-all ${
                activeSection === item.toLowerCase()
                  ? "bg-[#FF7200]/15 text-[#FF9040] border border-[#FF7200]/20"
                  : "text-white/30 hover:text-white/50 border border-transparent"
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id={id} ref={ref} className={`relative py-24 md:py-32 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ text, color = "violet" }: { text: string; color?: string }) {
  const colors: Record<string, string> = {
    violet: "text-[#FF9040]/70 border-[#FF7200]/20 bg-[#FF7200]/5",
    emerald: "text-emerald-400/70 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-400/70 border-amber-500/20 bg-amber-500/5",
    blue: "text-blue-400/70 border-blue-500/20 bg-blue-500/5",
    red: "text-red-400/70 border-red-500/20 bg-red-500/5",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-mono border rounded-md ${colors[color] || colors.violet}`}>
      {text}
    </span>
  );
}

// ─── Flow Step ────────────────────────────────────────────────────────────────
function FlowStep({ label, delay = 0, active = false }: { label: string; delay?: number; active?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`text-center py-3 px-4 rounded-xl border ${active ? "border-[#FF7200]/30 bg-[#FF7200]/10" : "border-white/5 bg-white/[0.02]"}`}
    >
      <span className={`font-mono text-[10px] tracking-widest uppercase ${active ? "text-[#FF9040]" : "text-white/40"}`}>
        {label}
      </span>
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1">
      <div className="w-px h-4 bg-gradient-to-b from-white/15 to-transparent" />
    </div>
  );
}

// ─── Product Inquiry Form ─────────────────────────────────────────────────────
function ProductInquiryForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", reason: "", productDetails: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.reason.trim()) return;
    setStatus("submitting");
    try {
      const communication = await fetch("/api/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          city: "",
          interest: `JARVIS AI: ${form.reason}`,
          message: [form.productDetails, form.message].filter(Boolean).join("\n\n"),
          subscribeNewsletters: false,
          subscribeArticles: false,
          subscribeBlogs: false,
        }),
      });
      if (!communication.ok) throw new Error("Unable to save inquiry");
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data: { ...form, city: "", interest: `JARVIS AI: ${form.reason}` } }),
      }).catch(() => {});
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  if (status === "submitted") {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">✓</span>
        </div>
        <h4 className="text-lg font-bold text-white mb-2">Inquiry Received</h4>
        <p className="text-sm text-white/40 mb-4">We&apos;ll get back to you regarding JARVIS AI soon.</p>
        <button onClick={() => setStatus("idle")} className="px-5 py-2 text-sm text-[#FF9040] border border-[#FF7200]/20 rounded-xl hover:bg-[#FF7200]/10 transition-colors">
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 space-y-5">
      <h4 className="text-lg font-bold text-white/90 mb-1">Interested in JARVIS AI?</h4>
      <p className="text-sm text-white/35 mb-4">Tell us about your requirements and we&apos;ll connect with you.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Full Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors" placeholder="Your name" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors" placeholder="Company name" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors" placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Reason for Enquiry *</label>
        <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 focus:outline-none focus:border-[#FF7200]/50 transition-colors appearance-none cursor-pointer">
          <option value="" className="bg-[#0B0B0D]">Select a reason</option>
          <option value="demo" className="bg-[#0B0B0D]">Request a Demonstration</option>
          <option value="collaboration" className="bg-[#0B0B0D]">Research Collaboration</option>
          <option value="licensing" className="bg-[#0B0B0D]">Licensing / Partnership</option>
          <option value="integration" className="bg-[#0B0B0D]">Integration Inquiry</option>
          <option value="support" className="bg-[#0B0B0D]">Technical Support</option>
          <option value="other" className="bg-[#0B0B0D]">Other</option>
        </select>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Product Details / Specific Interest</label>
        <textarea value={form.productDetails} onChange={(e) => setForm({ ...form, productDetails: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors resize-none" placeholder="Which JARVIS module or capability interests you?" />
      </div>

      <div>
        <label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Message</label>
        <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors resize-none" placeholder="Tell us more about your use case..." />
      </div>

      <p className="text-[10px] text-white/20 leading-relaxed">By submitting this form, you agree to our privacy policy.</p>
      {status === "error" && <p className="text-xs text-red-400">We couldn&apos;t submit your inquiry. Please try again.</p>}

      <button onClick={handleSubmit} disabled={status === "submitting" || !form.name.trim() || !form.email.trim() || !form.reason.trim()} className="w-full py-2.5 px-6 bg-[#E66800] hover:bg-[#FF7200] disabled:bg-[#E66800]/30 disabled:text-white/30 text-white font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2">
        {status === "submitting" ? "Submitting..." : "Submit Inquiry"} <span>→</span>
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JarvisPage() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  return (
    <main className="min-h-screen bg-[#080808]">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-[#FF7200]/40 rounded-lg flex items-center justify-center group-hover:border-[#FF9040]/60 transition-colors">
              <span className="font-mono text-xs font-bold text-[#FF9040]">AS</span>
            </div>
            <span className="text-xs font-medium tracking-[0.15em] text-white/70 uppercase hidden sm:block">ASRT</span>
          </Link>
          <Link href="/" className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">← Back to Site</Link>
        </div>
      </nav>

      {!loading && <StickyNav activeSection={activeSection} />}

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-32">
        <div className="absolute inset-0 tech-grid opacity-15" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E66800]/5 rounded-full blur-[150px]" />

        {/* Animated rings */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            {[150, 250, 350, 450].map((r, i) => (
              <motion.circle key={i} cx="50%" cy="50%" r={r} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="0.5" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2, delay: i * 0.3 }} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              return (
                <motion.line key={`r${i}`} x1="50%" y1="50%" x2={`${50 + 40 * Math.cos(angle)}%`} y2={`${50 + 40 * Math.sin(angle)}%`} stroke="rgba(139,92,246,0.08)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} />
              );
            })}
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <motion.div className="flex flex-wrap items-center gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Badge text="PRODUCT / 01" />
            <Badge text="AI Business Analyst" color="emerald" />
            <Badge text="Intelligent Commerce • Business Intelligence • Generative AI" color="blue" />
          </motion.div>

          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <span className="bg-gradient-to-r from-[#FF9040] via-purple-400 to-[#FF9040] bg-clip-text text-transparent">JARVIS AI</span>
          </motion.h1>

          <motion.p className="text-xl md:text-2xl text-white/50 max-w-xl mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            AI Business Analyst
          </motion.p>

          <motion.p className="text-lg text-white/30 max-w-lg mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
            From business data to intelligent decisions.
          </motion.p>

          <motion.p className="text-sm text-white/35 max-w-2xl leading-relaxed mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}>
            JARVIS brings transactional, inventory and behavioral data together with generative AI to produce structured business intelligence, strategic reports, recommendations and risk insights.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            <a href="#overview" className="px-6 py-3 bg-[#E66800] hover:bg-[#FF7200] text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-[#FF7200]/20 flex items-center gap-2">Explore JARVIS <span>→</span></a>
            <a href="#architecture" className="px-6 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5">View System Architecture</a>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" animate={{ scaleY: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </section>

      {/* ═══════ DATA FLOW ═══════ */}
      <Section id="overview">
        <div className="text-center mb-12">
          <Badge text="System Flow" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
            Business Data → <span className="text-[#FF9040]">AI Analysis</span> → Intelligence
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">How JARVIS transforms raw commerce data into actionable business intelligence.</p>
        </div>
        <DataFlowViz />
      </Section>

      {/* ═══════ THE PROBLEM ═══════ */}
      <Section id="problem" className="bg-[#0B0B0D]/50">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <Badge text="The Problem" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Modern commerce generates data everywhere. <span className="text-[#FF9040]">JARVIS turns it into decisions.</span>
            </h2>
            <div className="space-y-4 text-white/45 leading-relaxed">
              <p>Traditional e-commerce systems can manage products, orders and inventory, but business intelligence often remains passive.</p>
              <p>Important data can be distributed across transactions, products, inventory, user activity, searches, cart activity and returns.</p>
              <p>JARVIS introduces an AI-driven analytical layer that brings these sources into context and turns them into structured insights.</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white/80 mb-6">Data Sources JARVIS Monitors</h3>
            <div className="space-y-3">
              {["Transactions & Purchases", "Product Catalog & Performance", "Inventory & Restocking", "User Activity & Navigation", "Search & Cart Behavior", "Return Requests & Patterns"].map((item, i) => (
                <motion.div key={i} className="glass-card p-4 flex items-center gap-3" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <div className="w-8 h-8 rounded-lg bg-[#FF7200]/10 border border-[#FF7200]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[10px] text-[#FF9040]/70">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ DESCRIPTIVE → PRESCRIPTIVE ═══════ */}
      <Section id="intelligence">
        <div className="text-center mb-16">
          <Badge text="Intelligence Layer" color="emerald" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">From Descriptive to Prescriptive</h2>
          <p className="text-white/40 max-w-lg mx-auto">JARVIS moves beyond traditional reporting into AI-driven decision support.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-mono text-white/40 tracking-widest uppercase mb-4">Traditional</h3>
            <div className="space-y-1">
              {["DATA", "TABLES", "CHARTS", "MANUAL INTERPRETATION", "DECISION"].map((step, i) => (
                <div key={i}>
                  <FlowStep label={step} delay={i * 0.1} />
                  {i < 4 && <FlowArrow />}
                </div>
              ))}
            </div>
          </div>
          {/* JARVIS */}
          <div className="glass-card p-6 border-[#FF7200]/15">
            <h3 className="text-sm font-mono text-[#FF9040]/70 tracking-widest uppercase mb-4">JARVIS AI</h3>
            <div className="space-y-1">
              {["DATA", "CONTEXT", "AI ANALYSIS", "INSIGHT", "RECOMMENDATION", "DECISION"].map((step, i) => (
                <div key={i}>
                  <FlowStep label={step} delay={i * 0.1} active={i >= 2} />
                  {i < 5 && <FlowArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Traditional", items: ["Descriptive", "Manual/static reporting", "Reactive security", "Manual inventory tracking"] },
            { label: "JARVIS AI", items: ["Prescriptive", "AI-generated reports", "Proactive behavior-driven analysis", "AI-driven optimization"] },
          ].map((col, ci) => (
            <div key={ci} className="col-span-1 sm:col-span-2 glass-card p-5">
              <h4 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-3">{col.label}</h4>
              <div className="space-y-2">
                {col.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                    <span className={`w-1.5 h-1.5 rounded-full ${ci === 1 ? "bg-[#FF7200]/50" : "bg-white/20"}`} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ WHAT JARVIS ANALYZES ═══════ */}
      <Section id="modules" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-16">
          <Badge text="Data Sources" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">What JARVIS Analyzes</h2>
          <p className="text-white/40 max-w-lg mx-auto">Five interconnected data sources feeding the intelligence layer.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "ORDERS", desc: "Transactional and purchase information", icon: "🛒" },
              { label: "PRODUCTS", desc: "Product catalog and performance data", icon: "📦" },
              { label: "INVENTORY", desc: "Stock and restocking information", icon: "📊" },
              { label: "USER ACTIVITY", desc: "Clicks, searches, views, navigation", icon: "👤" },
              { label: "RETURNS", desc: "Return requests and patterns", icon: "🔄" },
            ].map((src, i) => (
              <motion.div key={i} className="glass-card p-4 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <span className="text-2xl mb-2 block">{src.icon}</span>
                <span className="font-mono text-[9px] text-white/50 tracking-widest uppercase block mb-1">{src.label}</span>
                <span className="text-[10px] text-white/30 block">{src.desc}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mb-4"><FlowArrow /></div>

          <div className="flex justify-center mb-4">
            <div className="px-6 py-3 rounded-xl border border-[#FF7200]/30 bg-[#FF7200]/10">
              <span className="font-mono text-[10px] text-[#FF9040] tracking-widest uppercase">JARVIS AI — Intelligence Layer</span>
            </div>
          </div>

          <div className="flex justify-center mb-4"><FlowArrow /></div>

          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">Business Insights</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOUR CORE MODULES ═══════ */}
      <Section id="modules-4">
        <div className="text-center mb-16">
          <Badge text="Core Modules" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Four Core Modules</h2>
          <p className="text-white/40 max-w-lg mx-auto">A complete intelligent commerce platform built from the ground up.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              num: "01", title: "Consumer Marketplace", desc: "The customer-facing e-commerce layer.",
              items: ["Product listing & search", "Category filtering", "Persistent shopping cart", "Availability/pricing updates", "Personalized interactions", "Order placement & tracking"],
            },
            {
              num: "02", title: "JARVIS AI Business Analyst", desc: "The core intelligence layer.",
              items: ["Collects data from orders & products", "Constructs context-rich prompts", "Communicates with Google Gemini", "Processes AI responses", "Generates structured reports", "Produces business insights"],
            },
            {
              num: "03", title: "Behavioral Monitoring & Intervention", desc: "The security/analytics engine.",
              items: ["Tracks user interactions", "Records activity logs", "Evaluates behavioral patterns", "Detects anomalies", "Flags high-risk activity", "Configurable account restrictions"],
            },
            {
              num: "04", title: "Admin Command Center", desc: "The operational intelligence dashboard.",
              items: ["Sales monitoring", "Inventory management", "User management", "AI-generated reports", "Return handling & appeals", "Data visualization"],
            },
          ].map((mod, i) => (
            <motion.div key={i} className="glass-card p-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-[#FF9040]/50">{mod.num}</span>
                <h3 className="text-lg font-semibold text-white/90">{mod.title}</h3>
              </div>
              <p className="text-sm text-white/40 mb-4">{mod.desc}</p>
              <div className="space-y-2">
                {mod.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-white/45">
                    <span className="w-1 h-1 rounded-full bg-[#FF7200]/40" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════ ASK JARVIS ═══════ */}
      <Section id="ask" className="bg-[#0B0B0D]/50">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge text="AI Pipeline" color="emerald" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Ask JARVIS</h2>
            <div className="space-y-4 text-white/45 leading-relaxed">
              <p>JARVIS extracts relevant business data, builds contextual prompts, sends them to Google Gemini, then processes the response into a structured business report.</p>
              <p>This pipeline transforms raw commerce data into strategic intelligence in real time.</p>
            </div>
          </div>
          <div className="space-y-1">
            {["DATABASE", "RELEVANT BUSINESS DATA", "CONTEXT-RICH PROMPT", "GOOGLE GEMINI", "RESPONSE PROCESSING", "STRUCTURED BUSINESS REPORT"].map((step, i) => (
              <div key={i}>
                <FlowStep label={step} delay={i * 0.15} active={i >= 2} />
                {i < 5 && <FlowArrow />}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ SILICON CONSULTANT ═══════ */}
      <Section id="silicon">
        <div className="max-w-3xl mx-auto text-center">
          <Badge text="Strategic Intelligence" color="amber" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Silicon Consultant</h2>
          <p className="text-white/45 leading-relaxed mb-8">
            An AI-driven business intelligence layer designed to evaluate business performance and transform operational data into strategic reports and recommendations.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Executive Summary", desc: "Current business performance overview" },
              { title: "Risk & Return Analysis", desc: "Behavioral and return-related analysis" },
              { title: "Recommendations", desc: "Inventory, promotional and operational recommendations" },
            ].map((item, i) => (
              <motion.div key={i} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <h4 className="text-sm font-semibold text-white/80 mb-2">{item.title}</h4>
                <p className="text-xs text-white/35">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ STRATEGIC REPORTING ═══════ */}
      <Section id="reporting" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="AI Reports" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Strategic Reporting</h2>
          <p className="text-white/40 max-w-lg mx-auto">AI-generated business reports synthesized across orders, products, activity logs and return records.</p>
        </div>

        <div className="max-w-2xl mx-auto glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FF7200]/10 border border-[#FF7200]/20 flex items-center justify-center">
              <span className="text-sm">📄</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/80">Generated Business Report</h4>
              <p className="text-[10px] text-white/30 font-mono">AI-POWERED ANALYSIS</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Executive Summary", content: "Overall business performance across all channels with trend analysis and key metrics." },
              { label: "Product Performance", content: "High-performing and under-performing products identified through sales velocity and engagement metrics." },
              { label: "Risk & Return Analysis", content: "Behavioral patterns correlated with return activity to identify anomalies and risk signals." },
              { label: "Recommendations", content: "Actionable inventory, promotional and operational recommendations based on AI analysis." },
            ].map((section, i) => (
              <motion.div key={i} className="bg-white/[0.02] rounded-lg p-4 border border-white/5" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <h5 className="text-xs font-mono text-[#FF9040]/70 tracking-widest uppercase mb-1">{section.label}</h5>
                <p className="text-sm text-white/40">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ REAL REASONING EXAMPLE ═══════ */}
      <Section id="reasoning">
        <div className="text-center mb-12">
          <Badge text="Documented Example" color="emerald" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Real JARVIS Reasoning</h2>
          <p className="text-white/40 max-w-lg mx-auto">A documented evaluation example of JARVIS analysis in action.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">👁</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">Observation</h4>
                  <p className="text-sm text-white/40">Repeated laptop filtering without completed purchases detected in user activity logs.</p>
                </div>
              </div>
              <div className="flex justify-center"><FlowArrow /></div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#FF7200]/10 border border-[#FF7200]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🧠</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">JARVIS Analysis</h4>
                  <p className="text-sm text-white/40">Combined behavior + purchase data — laptop category interest without conversion.</p>
                </div>
              </div>
              <div className="flex justify-center"><FlowArrow /></div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">⚡</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">Possible Signal</h4>
                  <p className="text-sm text-white/40">Pricing discrepancy or weak competitive positioning in the laptop segment.</p>
                </div>
              </div>
              <div className="flex justify-center"><FlowArrow /></div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">Recommendation</h4>
                  <p className="text-sm text-white/40">Investigate pricing strategy and competitive positioning for laptop products.</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-white/20 mt-6 italic">Documented evaluation example — not a universal prediction.</p>
          </div>
        </div>
      </Section>

      {/* ═══════ INVENTORY INTELLIGENCE ═══════ */}
      <Section id="inventory" className="bg-[#0B0B0D]/50">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge text="Inventory Intelligence" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Beyond Stock Levels</h2>
            <div className="space-y-4 text-white/45 leading-relaxed">
              <p>JARVIS analyzes sales velocity, restocking patterns and product performance to generate intelligent recommendations.</p>
              <p>The system can recommend replenishment schedules, promotional strategies and stock optimization plans.</p>
            </div>
          </div>
          <div>
            <div className="glass-card p-6 space-y-3">
              {["SALES VELOCITY", "RESTOCK PATTERN", "PRODUCT PERFORMANCE"].map((input, i) => (
                <div key={i}>
                  <FlowStep label={input} delay={i * 0.1} />
                  {i < 2 && <FlowArrow />}
                </div>
              ))}
              <div className="flex justify-center py-2">
                <div className="px-4 py-2 rounded-xl border border-[#FF7200]/30 bg-[#FF7200]/10">
                  <span className="font-mono text-[10px] text-[#FF9040] tracking-widest uppercase">JARVIS Analysis</span>
                </div>
              </div>
              <FlowArrow />
              <FlowStep label="REPLENISHMENT / PROMOTION RECOMMENDATION" active delay={0.4} />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ BEHAVIORAL RISK ═══════ */}
      <Section id="behavioral">
        <div className="max-w-3xl mx-auto text-center">
          <Badge text="Behavioral Risk Intelligence" color="red" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Security That Understands Behavior</h2>
          <p className="text-white/45 leading-relaxed mb-8">
            The system records product views, searches, cart activity and order activity, then analyzes behavior for anomalies using AI-assisted behavioral risk analysis.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Product Views", "Searches", "Cart Activity", "Order Activity"].map((item, i) => (
              <motion.div key={i} className="glass-card p-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <span className="text-xs text-white/50">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 mt-6 italic">AI-assisted behavioral risk analysis — not perfect fraud detection.</p>
        </div>
      </Section>

      {/* ═══════ RETURN ANALYSIS ═══════ */}
      <Section id="returns" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Return Analysis" color="amber" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">AI-Powered Return Assessment</h2>
        </div>
        <div className="max-w-xl mx-auto glass-card p-6 space-y-1">
          {["RETURN REQUEST", "PRODUCT", "RETURN REASON", "USER RETURN HISTORY", "CONTEXT", "AI ANALYSIS", "RISK ASSESSMENT", "RECOMMENDATION"].map((step, i) => (
            <div key={i}>
              <FlowStep label={step} delay={i * 0.08} active={i >= 4} />
              {i < 7 && <FlowArrow />}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ AUTONOMOUS INTERVENTION ═══════ */}
      <Section id="intervention">
        <div className="max-w-3xl mx-auto text-center">
          <Badge text="Autonomous Intervention" color="red" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">From Detection to Intervention</h2>
          <p className="text-white/45 leading-relaxed">
            The system can restrict accounts when configured return/risk thresholds are exceeded and records the intervention for administrative visibility. Uses configured autonomous intervention combining behavioral logic, thresholds and AI analysis.
          </p>
          <p className="text-[10px] text-white/20 mt-4 italic">Configured autonomous intervention — not independent perfect decisions.</p>
        </div>
      </Section>

      {/* ═══════ CUSTOMER + ADMIN EXPERIENCE ═══════ */}
      <Section id="experiences" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Two Experiences, One Intelligence" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Customer + Administrator</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-center">
          {/* Customer */}
          <div className="glass-card p-6">
            <h4 className="text-xs font-mono text-blue-400/70 tracking-widest uppercase mb-4">Customer</h4>
            <div className="space-y-2">
              {["Discover", "Search", "Ask", "Purchase", "Track"].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />{s}
                </div>
              ))}
            </div>
          </div>
          {/* Center */}
          <div className="text-center">
            <div className="px-6 py-4 rounded-xl border border-[#FF7200]/30 bg-[#FF7200]/10 inline-block">
              <span className="font-mono text-sm text-[#FF9040] tracking-widest uppercase">JARVIS AI</span>
            </div>
          </div>
          {/* Admin */}
          <div className="glass-card p-6">
            <h4 className="text-xs font-mono text-emerald-400/70 tracking-widest uppercase mb-4">Administrator</h4>
            <div className="space-y-2">
              {["Monitor", "Analyze", "Understand", "Act", "Improve"].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ SYSTEM ARCHITECTURE ═══════ */}
      <Section id="architecture">
        <div className="text-center mb-12">
          <Badge text="System Architecture" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Three-Layer Architecture</h2>
          <p className="text-white/40 max-w-lg mx-auto">N-tier architecture with AI orchestration between database context and Gemini.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {/* Presentation Layer */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 text-[10px] font-mono text-blue-400/70 border border-blue-500/20 rounded-md bg-blue-500/5">LAYER 01</span>
              <h4 className="text-sm font-semibold text-white/80">Presentation Layer</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["HTML5", "JavaScript", "CSS3", "Frosted Glassmorphism", "ApexCharts", "Fetch API"].map((t, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-mono text-white/40 border border-white/5 rounded-lg bg-white/[0.02]">{t}</span>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center"><FlowArrow /></div>

          {/* Application Layer */}
          <motion.div className="glass-card p-6 border-[#FF7200]/15" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 text-[10px] font-mono text-[#FF9040]/70 border border-[#FF7200]/20 rounded-md bg-[#FF7200]/5">LAYER 02</span>
              <h4 className="text-sm font-semibold text-white/80">Application & Intelligence Layer</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Flask", "Business Logic", "Authentication", "AI Orchestration", "Behavioral Tracking", "Inventory", "Reporting"].map((t, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-mono text-[#FF9040]/50 border border-[#FF7200]/10 rounded-lg bg-[#FF7200]/[0.03]">{t}</span>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center"><FlowArrow /></div>

          {/* Data Layer */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400/70 border border-emerald-500/20 rounded-md bg-emerald-500/5">LAYER 03</span>
              <h4 className="text-sm font-semibold text-white/80">Data Persistence Layer</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["SQLite", "SQLAlchemy", "Users", "Products", "Orders", "Activity Logs", "AI Interventions"].map((t, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-mono text-emerald-400/50 border border-emerald-500/10 rounded-lg bg-emerald-500/[0.03]">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Data flow */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="glass-card p-4 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-white/30">
            {["UI", "FLASK / AI ORCHESTRATION", "DATABASE", "CONTEXT", "GEMINI", "STRUCTURED INSIGHT", "UI"].map((step, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-white/50">{step}</span>
                {i < arr.length - 1 && <span className="text-[#FF9040]/40">→</span>}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ TECHNOLOGY STACK ═══════ */}
      <Section id="technology" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Technology Stack" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Built With</h2>
          <p className="text-white/40 max-w-lg mx-auto">Technologies documented in the JARVIS AI project.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { category: "Backend", items: ["Python 3.11", "Flask"] },
            { category: "Database", items: ["SQLite", "SQLAlchemy"] },
            { category: "AI", items: ["Google Gemini 2.0 Flash"] },
            { category: "Frontend", items: ["HTML5", "JavaScript", "Vanilla CSS"] },
            { category: "Visualization", items: ["ApexCharts"] },
            { category: "Authentication", items: ["Flask-Bcrypt", "Flask-Login", "Authlib", "OAuth 2.0"] },
            { category: "Communication", items: ["Flask-Mail"] },
            { category: "Payments", items: ["Razorpay Python SDK"] },
          ].map((stack, i) => (
            <motion.div key={i} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <h4 className="text-xs font-mono text-[#FF9040]/70 tracking-widest uppercase mb-3">{stack.category}</h4>
              <div className="flex flex-wrap gap-1.5">
                {stack.items.map((item, j) => (
                  <span key={j} className="px-2 py-0.5 text-[11px] text-white/50 border border-white/5 rounded-md bg-white/[0.02]">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════ SECURITY ═══════ */}
      <Section id="security">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge text="Security" color="red" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Security by Design</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Bcrypt password hashing",
              "Role-based access control",
              "OAuth 2.0 authentication",
              "Session management",
              "Activity tracking",
              "Behavioral analysis",
              "Intervention mechanisms",
            ].map((item, i) => (
              <motion.div key={i} className="glass-card p-4 flex items-center gap-3" initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <div className="w-2 h-2 rounded-full bg-emerald-500/50 flex-shrink-0" />
                <span className="text-sm text-white/55">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 mt-6 text-center italic">Security is a core non-functional requirement — never claimed 100% secure.</p>
        </div>
      </Section>

      {/* ═══════ PERFORMANCE ═══════ */}
      <Section id="performance" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Reported Evaluation" color="amber" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Reported Project Evaluation</h2>
          <p className="text-white/40 max-w-lg mx-auto">Benchmark results documented in the project report.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "AI Orchestration", value: "<150ms", detail: "Backend data extraction + prompt construction" },
            { label: "Database", value: "<50ms", detail: "Query response with 10,000+ records" },
            { label: "Frontend", value: "~60 FPS", detail: "94/100 Lighthouse score" },
            { label: "Authentication", value: "~300ms", detail: "Bcrypt hashing, 1.2s OAuth 2.0" },
          ].map((stat, i) => (
            <motion.div key={i} className="glass-card p-5 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase block mb-2">{stat.label}</span>
              <span className="text-2xl font-bold text-white/80 block mb-1">{stat.value}</span>
              <span className="text-[10px] text-white/30 block">{stat.detail}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-6 text-center italic">Reported project evaluation results — not production guarantees.</p>
      </Section>

      {/* ═══════ TESTING ═══════ */}
      <Section id="testing">
        <div className="text-center mb-12">
          <Badge text="Validated Through Testing" color="emerald" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Testing Results</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            "AUTHENTICATION", "PRODUCT MANAGEMENT", "AI REPORTING",
            "BEHAVIOR MONITORING", "DATABASE INTEGRATION", "ANALYTICS",
          ].map((test, i) => (
            <motion.div key={i} className="glass-card p-4 flex items-center justify-between" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <span className="text-xs font-mono text-white/50">{test}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400/70 border border-emerald-500/20 rounded-md bg-emerald-500/5">PASSED</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════ PRODUCT SCREENS (Placeholder) ═══════ */}
      <Section id="screens" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Product Screens" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Real Product Interface</h2>
          <p className="text-white/40 max-w-lg mx-auto">Screenshots from the implemented JARVIS system.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {["User Login", "Marketplace", "AI Chat", "Product Cart", "Executive Overview", "Inventory Mgmt", "AI Reports", "Return Analysis"].map((screen, i) => (
            <motion.div key={i} className="glass-card p-4 text-center aspect-[4/3] flex items-center justify-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📱</span>
                </div>
                <span className="text-[10px] text-white/35 font-mono">{screen}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-6 text-center italic">Real product screenshots — replace with actual images when available.</p>
      </Section>

      {/* ═══════ PRODUCT WORKFLOW ═══════ */}
      <Section id="workflow">
        <div className="text-center mb-12">
          <Badge text="Product Workflow" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">How JARVIS Works</h2>
        </div>
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h4 className="text-xs font-mono text-[#FF9040]/70 tracking-widest uppercase mb-4">Main Flow</h4>
            <div className="space-y-1">
              {["CUSTOMER / ADMIN ACTIVITY", "DATA COLLECTION", "DATABASE", "AI ORCHESTRATION", "GOOGLE GEMINI", "INSIGHT GENERATION", "BUSINESS REPORT / ACTION"].map((step, i, arr) => (
                <div key={i}>
                  <FlowStep label={step} delay={i * 0.08} active={i >= 2} />
                  {i < arr.length - 1 && <FlowArrow />}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h4 className="text-xs font-mono text-amber-400/70 tracking-widest uppercase mb-4">Behavioral Flow</h4>
            <div className="space-y-1">
              {["USER ACTION", "ACTIVITY LOG", "RISK ANALYSIS", "AI EVALUATION", "FLAG / INTERVENTION", "ADMIN REVIEW"].map((step, i, arr) => (
                <div key={i}>
                  <FlowStep label={step} delay={i * 0.08} active={i >= 2} />
                  {i < arr.length - 1 && <FlowArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ DIFFERENTIATION ═══════ */}
      <Section id="differentiation" className="bg-[#0B0B0D]/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge text="Why JARVIS" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Not Just Another Tool</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Not just a dashboard", desc: "JARVIS interprets data instead of only displaying metrics." },
              { title: "Not just a chatbot", desc: "Its AI is integrated into business analysis and operational workflows." },
              { title: "Not just an e-commerce store", desc: "The platform combines customer-facing commerce with an intelligence layer." },
              { title: "Not just automation", desc: "The system supports strategic decisions using transactional and behavioral context." },
            ].map((item, i) => (
              <motion.div key={i} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <h4 className="text-sm font-semibold text-white/80 mb-2">{item.title}</h4>
                <p className="text-sm text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ APPLIED AI RESEARCH ═══════ */}
      <Section id="research">
        <div className="max-w-3xl mx-auto text-center">
          <Badge text="Applied AI Research" color="emerald" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Built as Applied AI Research</h2>
          <p className="text-white/45 leading-relaxed">
            JARVIS AI was developed as an applied AI and engineering project exploring how generative AI can move beyond conversational interfaces and become an active business intelligence and decision-support layer.
          </p>
        </div>
      </Section>

      {/* ═══════ FUTURE RESEARCH ═══════ */}
      <Section id="roadmap" className="bg-[#0B0B0D]/50">
        <div className="text-center mb-12">
          <Badge text="Future Research Directions" color="amber" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Future Research</h2>
          <p className="text-white/40 max-w-lg mx-auto">Potential enhancements identified in the project report.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {[
            { title: "Predictive Analytics", desc: "Forecast sales, demand and inventory." },
            { title: "RAG", desc: "Retrieve internal/external information before generation." },
            { title: "Multilingual AI", desc: "Support multiple languages." },
            { title: "Advanced Recommendations", desc: "Deep-learning-based personalization." },
            { title: "Sentiment Analysis", desc: "Analyze customer reviews and feedback." },
            { title: "Fraud Prediction", desc: "Predict sophisticated fraudulent behavior." },
            { title: "Blockchain", desc: "Explore transaction transparency and integrity." },
            { title: "Enterprise Database", desc: "Migration to PostgreSQL/MySQL." },
            { title: "Cloud-Native Deployment", desc: "Docker/Kubernetes deployment." },
          ].map((item, i) => (
            <motion.div key={i} className="glass-card p-4 opacity-60 hover:opacity-80 transition-opacity" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 0.6, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                <h4 className="text-xs font-semibold text-white/70">{item.title}</h4>
              </div>
              <p className="text-[11px] text-white/30">{item.desc}</p>
              <span className="text-[9px] font-mono text-amber-400/40 mt-2 block">FUTURE DIRECTION</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════ ATTRIBUTION ═══════ */}
      <Section id="attribution">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-6 md:p-8 inline-block">
            <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-3">Research & Development</div>
            <h3 className="text-lg font-bold text-white/80 mb-1">T.S. Vishnu Prasanth</h3>
            <p className="text-sm text-white/40 mb-2">JARVIS AI — AI Business Analyst</p>
            <p className="text-xs text-white/25">MCA Program • Jeppiaar Engineering College / Anna University • July 2026</p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-white/35">
                Developed by <span className="text-white/55">Applied System Research & Technology (OPC) Pvt Ltd</span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ CONTACT / CTA ═══════ */}
      <Section id="contact" className="bg-[#0B0B0D]/50">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <Badge text="Get in Touch" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Interested in intelligent business systems?
            </h2>
            <p className="text-white/45 leading-relaxed mb-8">
              Let&apos;s explore what applied AI can build next. Whether you&apos;re interested in collaboration, research partnership or learning more about JARVIS AI.
            </p>
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-1">Company</div>
                <p className="text-white/50 text-sm">Applied System Research & Technology (OPC) Pvt Ltd</p>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-1">Email</div>
                <a href="mailto:anandhi@appliedaiml.com" className="text-white/60 text-sm hover:text-[#FF9040] transition-colors">anandhi@appliedaiml.com</a>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-1">Phone</div>
                <a href="tel:+919742994849" className="text-white/60 text-sm hover:text-[#FF9040] transition-colors">+91 9742994849</a>
              </div>
            </div>
          </div>
          <div>
            <ProductInquiryForm />
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#080808] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#FF7200]/30 rounded-md flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-[#FF9040]/60">AS</span>
            </div>
            <span className="text-xs text-white/25 tracking-wider">Applied System Research & Technology</span>
          </div>
          <span className="text-[11px] text-white/15">© {new Date().getFullYear()} ASRT. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
