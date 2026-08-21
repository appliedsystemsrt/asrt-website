"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const steps = [
  { num: "01", title: "Discover", desc: "Understand the challenge, context and constraints." },
  { num: "02", title: "Research", desc: "Study the problem, data and existing approaches." },
  { num: "03", title: "Design", desc: "Architect the system and define the solution." },
  { num: "04", title: "Build", desc: "Develop, iterate and validate the implementation." },
  { num: "05", title: "Deploy", desc: "Integrate into the real-world environment." },
  { num: "06", title: "Improve", desc: "Measure, optimize and evolve continuously." },
];

export default function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section className="relative py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              How We Work
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Research to
            <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent"> Impact</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF7200]/20 via-[#FF7200]/20 to-[#FF7200]/20"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                {/* Node */}
                <div className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center mb-4 group-hover:border-[#FF7200]/40 transition-colors bg-[#0B0B0D] border-white/10`}>
                  <span className="font-mono text-xs text-[#FF9040]/70">{step.num}</span>
                </div>

                <h3 className="text-sm font-semibold text-white/80 mb-1">{step.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed max-w-[140px]">{step.desc}</p>

                {/* Mobile arrow */}
                {i < steps.length - 1 && i % 2 === 0 && (
                  <div className="lg:hidden absolute -bottom-2 right-0 text-white/10 text-lg">↓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
