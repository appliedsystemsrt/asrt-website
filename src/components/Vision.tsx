"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Vision() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0B0B0D] to-[#080808]" />
      <div className="absolute inset-0 tech-grid opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E66800]/5 rounded-full blur-[150px]" />

      {/* Animated rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[200, 300, 400].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/[0.03]"
            style={{
              width: size,
              height: size,
              top: -size / 2,
              left: -size / 2,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.2, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
            Our Vision
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          A Smarter, More Efficient
          <br />
          <span className="bg-gradient-to-r from-[#FF9040] via-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
            and Responsible Future
          </span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/45 leading-relaxed max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We are driven by a vision of creating technological solutions that
          redefine industries, empower organizations and improve real-world
          experiences. Our innovation connects research, engineering, application
          and impact into a continuous cycle of meaningful progress.
        </motion.p>

        {/* Flow visualization */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {["Research", "Engineering", "Application", "Impact"].map((step, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-6">
              <div className="px-4 py-2 glass-card text-sm font-mono text-white/60">
                {step}
              </div>
              {i < 3 && (
                <span className="text-white/15 text-lg">→</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
