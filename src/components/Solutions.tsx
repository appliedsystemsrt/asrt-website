"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const solutions = [
  {
    num: "01",
    title: "AI & Machine Learning",
    desc: "Intelligent systems designed around real business and societal problems.",
    tags: ["Deep Learning", "NLP", "Computer Vision", "Generative AI"],
  },
  {
    num: "02",
    title: "Robotics",
    desc: "Intelligent machines and automation for industrial and research applications.",
    tags: ["Automation", "Control Systems", "Embedded AI", "Sensor Fusion"],
  },
  {
    num: "03",
    title: "Software Engineering",
    desc: "Scalable software systems built with modern architecture and practices.",
    tags: ["Full Stack", "Cloud Native", "APIs", "Microservices"],
  },
  {
    num: "04",
    title: "Data & Cloud",
    desc: "Data-driven systems and cloud technologies for enterprise-scale operations.",
    tags: ["Analytics", "Data Pipelines", "Cloud Infrastructure", "ETL"],
  },
  {
    num: "05",
    title: "Research & Development",
    desc: "Applied experimentation, prototyping and technology advancement.",
    tags: ["Prototyping", "Feasibility Studies", "Innovation", "R&D"],
  },
  {
    num: "06",
    title: "Advanced Computing",
    desc: "GPU/HPC and high-performance infrastructure for demanding workloads.",
    tags: ["GPU Computing", "HPC", "Cluster Architecture", "Orchestration"],
  },
];

export default function Solutions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="solutions" className="relative py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              What We Solve
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            From Difficult Problems
            <br />
            <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
              to Applied Systems
            </span>
          </h2>
          <p className="text-white/40 max-w-2xl text-lg">
            We design, develop and deploy customized AI, ML, software and robotics solutions
            that adapt to real-world requirements across industries.
          </p>
        </motion.div>

        {/* Solutions grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((sol, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 group cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            >
              {/* Number */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#FF9040]/50">{sol.num}</span>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center group-hover:border-[#FF7200]/40 group-hover:bg-[#FF7200]/10 transition-all border-white/10`}>
                  <span className={`text-xs group-hover:text-[#FF9040] transition-colors text-white/30`}>→</span>
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white/90 mb-2">{sol.title}</h3>
              <p className="text-sm text-white/40 mb-4 leading-relaxed">{sol.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {sol.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-2 py-0.5 text-[10px] font-mono text-white/30 border border-white/5 rounded-md bg-white/[0.02]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
