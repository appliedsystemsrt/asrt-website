"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const confetti = [
  ["8%", "12%", "#FFB703", "0.2s"], ["18%", "78%", "#5B7CFF", "0.8s"],
  ["32%", "8%", "#FF9040", "1.1s"], ["45%", "90%", "#E9C46A", "0.5s"],
  ["62%", "5%", "#5B7CFF", "1.4s"], ["78%", "84%", "#FFB703", "0.9s"],
  ["91%", "20%", "#FF9040", "1.7s"], ["86%", "60%", "#E9C46A", "0.35s"],
];

export default function Recognition() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32 bg-[#0B0B0D]/70">
      <div className="absolute inset-0 tech-grid opacity-10" />
      {confetti.map(([left, top, color, delay], index) => (
        <motion.span
          key={index}
          className="absolute w-1.5 h-3 rounded-sm pointer-events-none"
          style={{ left, top, backgroundColor: color }}
          initial={{ opacity: 0, y: -16, rotate: 0 }}
          animate={inView ? { opacity: [0, 0.8, 0], y: [0, 30, 65], rotate: [0, 90, 180] } : {}}
          transition={{ duration: 3.2, delay: Number.parseFloat(delay), repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-flex px-3 py-1.5 rounded-md border border-[#E9C46A]/30 bg-[#E9C46A]/5 text-[10px] font-mono tracking-[0.25em] uppercase text-[#E9C46A]">
            National Recognition
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-5 mb-4">
            Recognised for building in <span className="text-[#E9C46A]">AI & Machine Learning</span>
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto leading-relaxed">
            Applied Systems Research and Technology is officially recognised as a startup by the Government of India&apos;s Department for Promotion of Industry and Internal Trade.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative max-w-5xl mx-auto p-2 md:p-3 rounded-2xl bg-gradient-to-br from-[#E9C46A]/70 via-[#8B6F2F] to-[#E9C46A]/50 shadow-[0_0_80px_rgba(233,196,106,0.12)]"
        >
          <div className="relative rounded-xl border border-[#F7E7AE]/50 bg-[#11100D] p-5 md:p-8">
            <div className="absolute inset-3 border border-[#E9C46A]/25 rounded-lg pointer-events-none" />
            <div className="relative grid lg:grid-cols-[1fr_1.45fr] gap-8 items-center">
              <div className="text-center lg:text-left px-2 md:px-6">
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#E9C46A]/70 mb-4">Certificate of Recognition</p>
                <h3 className="text-2xl md:text-3xl font-serif text-[#F7E7AE] mb-4">Startup India Recognition</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6">
                  Issued by the Department for Promotion of Industry and Internal Trade, Ministry of Commerce &amp; Industry, Government of India.
                </p>
                <div className="grid grid-cols-2 gap-3 text-left mb-6">
                  <div className="rounded-lg border border-[#E9C46A]/15 bg-white/[0.03] p-3"><p className="text-[9px] font-mono uppercase tracking-wider text-white/30">Issued</p><p className="text-sm text-[#F7E7AE] mt-1">29 Apr 2025</p></div>
                  <div className="rounded-lg border border-[#E9C46A]/15 bg-white/[0.03] p-3"><p className="text-[9px] font-mono uppercase tracking-wider text-white/30">Valid Until</p><p className="text-sm text-[#F7E7AE] mt-1">02 Apr 2027</p></div>
                </div>
                <p className="text-[10px] font-mono text-white/30 tracking-wider">CERTIFICATE NO. <span className="text-[#E9C46A]">DIPP201616</span></p>
                <a href="/Startup%20company%20validity%20%20certificate%20from%20central_govt.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex mt-7 items-center gap-2 rounded-xl bg-[#E9C46A] px-5 py-2.5 text-sm font-medium text-[#17130A] hover:bg-[#F7E7AE] transition-colors">View Certificate <span>↗</span></a>
              </div>
              <a href="/Startup%20company%20validity%20%20certificate%20from%20central_govt.pdf" target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden rounded-lg border border-[#E9C46A]/30 bg-[#F7F4EA] aspect-[1.414/1] group">
                <img src="/certificate.png" alt="Government of India startup recognition certificate" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-3 border border-[#B38B4D]/40 pointer-events-none" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
