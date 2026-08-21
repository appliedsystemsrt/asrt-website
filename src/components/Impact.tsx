"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const metrics = [
  { value: "2017", label: "Founded", sublabel: "Bangalore, India" },
  { value: "AI + ML", label: "Core Focus", sublabel: "Applied Intelligence" },
  { value: "R&D", label: "Engineering", sublabel: "Research-Driven" },
];

export default function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              className="glass-card p-8 text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            >
              <div className="font-mono text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent mb-2">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-white/70 mb-1">{metric.label}</div>
              <div className="text-xs text-white/30">{metric.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
