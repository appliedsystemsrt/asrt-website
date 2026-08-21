"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import BrandLoadingScreen from "@/components/LoadingScreen";

interface Product {
  name: string; slug: string; tagline: string; description: string;
  overview: string; problem: string; intelligence: string; modules: string;
  architecture: string; technology: string; security: string; performance: string;
  testing: string; roadmap: string; screens?: string; research?: string;
  workflow?: string; differentiation?: string; tags: string[];
}

const navItems = [
  ["overview", "Overview"], ["problem", "Problem"], ["intelligence", "Intelligence"],
  ["modules", "Modules"], ["architecture", "Architecture"], ["technology", "Technology"],
  ["security", "Security"], ["performance", "Performance"], ["screens", "Screens"],
  ["research", "Research"], ["workflow", "Workflow"], ["roadmap", "Roadmap"], ["contact", "Contact"],
] as const;

function Badge({ text, color = "orange" }: { text: string; color?: "orange" | "green" | "blue" }) {
  const colors = { orange: "text-[#FF9040]/80 border-[#FF7200]/20 bg-[#FF7200]/5", green: "text-emerald-400/80 border-emerald-500/20 bg-emerald-500/5", blue: "text-blue-400/80 border-blue-500/20 bg-blue-500/5" };
  return <span className={`inline-flex px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase border rounded-md ${colors[color]}`}>{text}</span>;
}

function FlowChart({ text }: { text: string }) {
  const steps = text.split(/\n|\.|;|→|->/).map((step) => step.trim()).filter(Boolean).slice(0, 8);
  return <div className="max-w-2xl mx-auto glass-card p-6">{steps.length ? steps.map((step, index) => <div key={`${step}-${index}`}><motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className={`rounded-xl border p-3 text-center font-mono text-[10px] tracking-widest uppercase ${index > 1 ? "border-[#FF7200]/25 bg-[#FF7200]/10 text-[#FF9040]" : "border-white/8 bg-white/[0.03] text-white/50"}`}>{step}</motion.div>{index < steps.length - 1 && <div className="flex justify-center py-1 text-[#FF9040]/50">↓</div>}</div>) : <p className="text-sm text-white/40 text-center">Workflow details are being prepared.</p>}</div>;
}

function LoadingScreen({ name, onComplete }: { name: string; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => { const interval = setInterval(() => setProgress((current) => { if (current >= 100) { clearInterval(interval); setTimeout(onComplete, 250); return 100; } return Math.min(100, current + Math.random() * 18 + 8); }), 120); return () => clearInterval(interval); }, [onComplete]);
  return <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[100] bg-[#080808] flex items-center justify-center"><div className="absolute inset-0 tech-grid opacity-10" /><div className="relative z-10 text-center"><p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FF9040]/60 mb-3">Initializing Product Intelligence</p><h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF9040] via-purple-400 to-[#FF9040] bg-clip-text text-transparent">{name}</h1><p className="text-[10px] font-mono tracking-widest text-white/25 uppercase mt-3">Loading analysis layer</p><div className="w-64 h-0.5 bg-white/5 mt-8 mx-auto overflow-hidden"><motion.div className="h-full bg-[#FF7200]" animate={{ width: `${progress}%` }} /></div><p className="text-[10px] font-mono text-white/20 mt-3">{Math.round(progress)}%</p></div></motion.div>;
}

function Section({ id, children, muted = false }: { id: string; children: React.ReactNode; muted?: boolean }) { const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-80px" }); return <section id={id} ref={ref} className={`relative py-24 md:py-32 scroll-mt-24 ${muted ? "bg-[#0B0B0D]/50" : ""}`}><motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</motion.div></section>; }

function TextSection({ id, label, title, value, muted = false }: { id: string; label: string; title: string; value?: string; muted?: boolean }) { if (!value?.trim()) return null; return <Section id={id} muted={muted}><div className="max-w-3xl mx-auto text-center"><Badge text={label} /><h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">{title}</h2><p className="text-white/45 leading-relaxed whitespace-pre-wrap text-left">{value}</p></div></Section>; }

function ProductInquiryForm({ productName }: { productName: string }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", reason: "", productDetails: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.reason.trim()) return;
    setStatus("submitting");
    try {
      const response = await fetch("/api/communications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, city: "", interest: `${productName}: ${form.reason}`, message: [form.productDetails, form.message].filter(Boolean).join("\n\n"), subscribeNewsletters: false, subscribeArticles: false, subscribeBlogs: false }) });
      if (!response.ok) throw new Error("Inquiry could not be saved");
      fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contact", data: { ...form, city: "", interest: `${productName}: ${form.reason}` } }) }).catch(() => {});
      setStatus("submitted");
    } catch { setStatus("error"); }
  };
  if (status === "submitted") return <div className="glass-card p-8 text-center"><div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4"><span className="text-xl">✓</span></div><h4 className="text-lg font-bold text-white mb-2">Inquiry Received</h4><p className="text-sm text-white/40 mb-4">We&apos;ll get back to you regarding {productName} soon.</p><button onClick={() => setStatus("idle")} className="px-5 py-2 text-sm text-[#FF9040] border border-[#FF7200]/20 rounded-xl hover:bg-[#FF7200]/10 transition-colors">Submit Another Inquiry</button></div>;
  return <div className="glass-card p-6 md:p-8 space-y-5"><h4 className="text-lg font-bold text-white/90 mb-1">Interested in {productName}?</h4><p className="text-sm text-white/35 mb-4">Tell us about your requirements and we&apos;ll connect with you.</p><div className="grid sm:grid-cols-2 gap-5"><Field label="Full Name *" value={form.name} onChange={(value) => update("name", value)} placeholder="Your name" /><Field label="Company" value={form.company} onChange={(value) => update("company", value)} placeholder="Company name" /><Field label="Email *" type="email" value={form.email} onChange={(value) => update("email", value)} placeholder="you@company.com" /><Field label="Phone" type="tel" value={form.phone} onChange={(value) => update("phone", value)} placeholder="+91 XXXXX XXXXX" /></div><div><label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">Reason for Enquiry *</label><select value={form.reason} onChange={(event) => update("reason", event.target.value)} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 focus:outline-none focus:border-[#FF7200]/50"><option value="" className="bg-[#0B0B0D]">Select a reason</option><option value="demo" className="bg-[#0B0B0D]">Request a Demonstration</option><option value="collaboration" className="bg-[#0B0B0D]">Research Collaboration</option><option value="licensing" className="bg-[#0B0B0D]">Licensing / Partnership</option><option value="integration" className="bg-[#0B0B0D]">Integration Inquiry</option><option value="support" className="bg-[#0B0B0D]">Technical Support</option><option value="other" className="bg-[#0B0B0D]">Other</option></select></div><Field label="Product Details / Specific Interest" value={form.productDetails} onChange={(value) => update("productDetails", value)} placeholder={`Which ${productName} capability interests you?`} multiline rows={2} /><Field label="Message" value={form.message} onChange={(value) => update("message", value)} placeholder="Tell us more about your use case..." multiline rows={3} />{status === "error" && <p className="text-xs text-red-400">We couldn&apos;t submit your inquiry. Please try again.</p>}<p className="text-[10px] text-white/20 leading-relaxed">By submitting this form, you agree to our privacy policy.</p><button onClick={submit} disabled={status === "submitting" || !form.name.trim() || !form.email.trim() || !form.reason.trim()} className="w-full py-2.5 px-6 bg-[#E66800] hover:bg-[#FF7200] disabled:bg-[#E66800]/30 disabled:text-white/30 text-white font-medium rounded-xl transition-all text-sm">{status === "submitting" ? "Submitting..." : "Submit Inquiry"} <span>→</span></button></div>;
}

function Field({ label, value, onChange, placeholder, type = "text", multiline = false, rows = 2 }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; multiline?: boolean; rows?: number }) {
  const className = "w-full px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#FF7200]/50 transition-colors resize-none";
  return <div className={multiline ? "sm:col-span-2" : ""}><label className="block font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1.5">{label}</label>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className={className} placeholder={placeholder} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={className} placeholder={placeholder} />}</div>;
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => { fetch("/api/products").then((response) => response.json()).then((products: Product[]) => { setProduct(products.find((item) => item.slug === params.slug) || null); setLoading(false); }).catch(() => setLoading(false)); }, [params.slug]);
  useEffect(() => { if (!pageReady) return; const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { rootMargin: "-40% 0px -40% 0px" }); navItems.forEach(([id]) => { const element = document.getElementById(id); if (element) observer.observe(element); }); return () => observer.disconnect(); }, [pageReady]);

  if (loading) return <BrandLoadingScreen label="Loading product" />;
  if (!product) return <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center"><div className="text-center"><p className="font-mono text-xs text-[#FF9040] mb-4">PRODUCT UNAVAILABLE</p><h1 className="text-3xl font-bold mb-6">Product not found</h1><Link href="/products" className="text-[#FF9040]">Back to products</Link></div></main>;

  return <>
    <AnimatePresence>{!pageReady && <LoadingScreen name={product.name} onComplete={() => setPageReady(true)} />}</AnimatePresence>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"><Link href="/" className="flex items-center gap-3"><div className="w-8 h-8 border border-[#FF7200]/40 rounded-lg flex items-center justify-center"><span className="font-mono text-xs font-bold text-[#FF9040]">AS</span></div><span className="text-xs tracking-[0.15em] text-white/70 uppercase">ASRT</span></Link><Link href="/" className="text-sm text-white/50 hover:text-white">← Back to Site</Link></div></nav>
    {pageReady && <nav className="fixed top-16 left-0 right-0 z-40 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5"><div className="max-w-7xl mx-auto px-4 overflow-x-auto"><div className="flex gap-1 py-2">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase whitespace-nowrap rounded-lg transition-all ${activeSection === id ? "bg-[#FF7200]/15 text-[#FF9040] border border-[#FF7200]/20" : "text-white/30 hover:text-white/60"}`}>{label}</a>)}</div></div></nav>}

    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative min-h-screen flex items-center overflow-hidden pt-32"><div className="absolute inset-0 tech-grid opacity-15" /><div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"><div className="w-[520px] h-[520px] rounded-full border border-[#FF7200]/20" /><div className="absolute w-[360px] h-[360px] rounded-full border border-purple-400/15" /></div><div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 w-full"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3 mb-8"><Badge text="PRODUCT / AI SYSTEM" /><Badge text="Applied Intelligence" color="green" />{product.tags?.length > 0 && <Badge text={product.tags.slice(0, 4).join(" • ")} color="blue" />}</motion.div><motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"><span className="bg-gradient-to-r from-[#FF9040] via-purple-400 to-[#FF9040] bg-clip-text text-transparent">{product.name}</span></motion.h1><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl text-white/50 max-w-xl mb-2">{product.tagline}</motion.p><p className="text-lg text-white/30 max-w-lg mb-8">From research to an engineered system.</p><p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-8">{product.description}</p><div className="flex flex-wrap gap-4"><a href="#overview" className="px-6 py-3 bg-[#E66800] hover:bg-[#FF7200] text-white font-medium rounded-xl transition-all flex items-center gap-2">Explore {product.name} <span>→</span></a><a href="#architecture" className="px-6 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium rounded-xl transition-all">View System Architecture</a></div></div><motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}><div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" /></motion.div></section>
      <Section id="overview"><div className="text-center mb-12"><Badge text="System Flow" /><h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">Documented System → <span className="text-[#FF9040]">Product Intelligence</span></h2><p className="text-white/40 max-w-lg mx-auto">A complete view of how this product turns inputs into outcomes.</p></div><FlowChart text={product.workflow || product.overview} /></Section>
      <TextSection id="problem" label="The Problem" title="The challenge this system addresses" value={product.problem} muted />
      <TextSection id="intelligence" label="Intelligence Layer" title="From data to intelligent decisions" value={product.intelligence} />
      <TextSection id="modules" label="Core Modules" title="What the product is built from" value={product.modules} muted />
      <Section id="architecture"><div className="text-center mb-12"><Badge text="System Architecture" /><h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">How the system is structured</h2><p className="text-white/40 max-w-lg mx-auto">Architecture and information flow from the approved product document.</p></div><FlowChart text={product.architecture} /></Section>
      <TextSection id="technology" label="Technology Stack" title="Built with purpose" value={product.technology} muted />
      <TextSection id="security" label="Security" title="Security by design" value={product.security} />
      <TextSection id="performance" label="Reported Evaluation" title="Performance characteristics" value={product.performance} muted />
      <TextSection id="screens" label="Product Screens" title="The interfaces behind the system" value={product.screens} />
      <TextSection id="research" label="Applied AI Research" title="Built as applied research" value={product.research} muted />
      <Section id="workflow" muted><div className="text-center mb-12"><Badge text="Product Workflow" /><h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">How it works end to end</h2></div><FlowChart text={product.workflow || product.architecture} /></Section>
      <TextSection id="roadmap" label="Future Research Directions" title="What comes next" value={product.roadmap} muted />
      <TextSection id="differentiation" label="Differentiation" title="Why this product matters" value={product.differentiation} />
      <Section id="contact" muted><div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"><div><Badge text="Get in Touch" /><h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Interested in intelligent systems?</h2><p className="text-white/45 leading-relaxed mb-8">Let&apos;s explore what applied AI can build next. Tell us how {product.name} fits your requirements.</p><div className="space-y-4 text-sm"><div><p className="font-mono text-[10px] tracking-widest uppercase text-white/25 mb-1">Company</p><p className="text-white/55">Applied System Research &amp; Technology (OPC) Pvt Ltd</p></div><div><p className="font-mono text-[10px] tracking-widest uppercase text-white/25 mb-1">Email</p><p className="text-white/55">anandhi@appliedaiml.com</p></div><div><p className="font-mono text-[10px] tracking-widest uppercase text-white/25 mb-1">Phone</p><p className="text-white/55">+91 9742994849</p></div></div></div><ProductInquiryForm productName={product.name} /></div></Section>
    </main>
    <Footer />
  </>;
}
