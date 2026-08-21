"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const insights = [
  {
    category: "Artificial Intelligence",
    title: "Applied AI Systems: From Research to Real-World Deployment",
    summary: "Exploring the bridge between AI research breakthroughs and practical, production-ready intelligent systems.",
    readTime: "5 min",
  },
  {
    category: "Machine Learning",
    title: "Scalable ML Pipelines for Enterprise Applications",
    summary: "Building robust machine learning infrastructure that scales from prototype to enterprise-grade deployment.",
    readTime: "7 min",
  },
  {
    category: "Robotics",
    title: "Autonomous Systems: Navigation and Decision-Making",
    summary: "Advances in robotic perception, path planning and autonomous decision-making in unstructured environments.",
    readTime: "6 min",
  },
  {
    category: "GPU Computing",
    title: "High-Performance Computing for AI Workloads",
    summary: "Leveraging GPU clusters and HPC architectures to accelerate AI training and inference at scale.",
    readTime: "4 min",
  },
  {
    category: "Software Engineering",
    title: "Architecting Resilient AI-Integrated Software Systems",
    summary: "Design patterns and architectural approaches for building software that integrates AI components reliably.",
    readTime: "8 min",
  },
  {
    category: "AI Infrastructure",
    title: "Building AI Infrastructure: From GPUs to Orchestration",
    summary: "The technical foundations required to support modern AI development, training and deployment workflows.",
    readTime: "5 min",
  },
];

export default function Research() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="research" className="relative py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              What We Investigate
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Research & Insights
          </h2>
          <p className="text-white/40 max-w-xl text-lg">
            Technical articles and insights from our applied research across AI, ML,
            robotics and advanced computing.
          </p>
        </motion.div>

        {/* Insights grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights.map((insight, i) => (
            <motion.article
              key={i}
              className="glass-card p-6 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            >
              {/* Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 text-[10px] font-mono text-[#FF9040]/60 border border-[#FF7200]/10 rounded-md">
                  {insight.category.toUpperCase()}
                </span>
                <span className={`text-[10px] font-mono text-white/20`}>{insight.readTime} read</span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white/80 mb-3 group-hover:text-[#FF9040] transition-colors leading-snug">
                {insight.title}
              </h3>

              {/* Summary */}
              <p className="text-sm text-white/35 leading-relaxed mb-4">{insight.summary}</p>

              {/* Read link */}
              <div className="flex items-center gap-2 text-sm text-white/30 group-hover:text-[#FF9040]/70 transition-colors">
                <span>Read Article</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
