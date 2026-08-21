"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
const pillars = [
  { num: "01", title: "Research", desc: "Deep investigation into complex problems" },
  { num: "02", title: "Engineering", desc: "Precision-built intelligent systems" },
  { num: "03", title: "Application", desc: "Real-world deployment and integration" },
  { num: "04", title: "Impact", desc: "Measurable societal and industrial outcomes" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/3 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Large quote */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
                About the Company
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Applied Research.
              <br />
              <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
                Engineered for Impact.
              </span>
            </motion.h2>

            <motion.div
              className="space-y-5 text-white/50 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p>
                <span className="text-white/70 font-medium">Founded in 2017</span>, Applied System Research &
                Technology (OPC) Pvt Ltd, headquartered in Bangalore, Karnataka, works across
                Artificial Intelligence, Machine Learning, software engineering and robotics.
              </p>
              <p>
                We believe <span className="text-[#FF9040]/80">technology should serve humanity</span>.
                Our work is positioned around solving real-world challenges while improving
                productivity, efficiency and competitiveness.
              </p>
              <p>
                We develop customized and scalable technology solutions that respond to the
                evolving needs of industries and society — combining multidisciplinary expertise,
                research and development, strategic collaboration and customer-centric engineering.
              </p>
              <p>
                Our commitment is reflected in our active participation in initiatives such as
                <span className="text-white/70"> Swachh Bharat Abhiyan</span> and
                <span className="text-white/70"> Make in India</span>, where we align our
                technological advancements with broader national goals.
              </p>
            </motion.div>
          </div>

          {/* Right: Numbered cards with connecting line */}
          <div className="relative pt-8">
            {/* Vertical connecting line */}
            <motion.div
              className="absolute left-5 top-8 bottom-8 w-px"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            >
              <div className="w-full h-full bg-gradient-to-b from-[#FF7200]/30 via-[#FF7200]/20 to-transparent" />
            </motion.div>

            <div className="space-y-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-6 pl-14 relative group"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                >
                  {/* Number node */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border flex items-center justify-center z-10 group-hover:border-[#FF7200]/40 transition-colors bg-[#0B0B0D] border-white/10`}>
                    <span className="font-mono text-xs text-[#FF9040]/70">{pillar.num}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-white/90 mb-1">{pillar.title}</h3>
                  <p className="text-sm text-white/40">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
