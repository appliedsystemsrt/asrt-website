"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";


interface TechNode {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  applications: string[];
  related: string[];
  category: string;
}

const technologies: TechNode[] = [
  {
    id: "ai",
    label: "Artificial Intelligence",
    shortLabel: "AI",
    description: "Building intelligent systems that can reason, learn, and make decisions across complex domains.",
    applications: ["Natural Language Processing", "Decision Systems", "Predictive Analytics", "Autonomous Systems"],
    related: ["ML", "Computer Vision", "Generative AI"],
    category: "Core",
  },
  {
    id: "ml",
    label: "Machine Learning",
    shortLabel: "ML",
    description: "Developing models that learn from data to identify patterns and make intelligent decisions.",
    applications: ["Deep Learning", "Reinforcement Learning", "Time Series", "Recommendation"],
    related: ["AI", "Data Analytics", "Advanced Computing"],
    category: "Core",
  },
  {
    id: "cv",
    label: "Computer Vision",
    shortLabel: "CV",
    description: "Enabling machines to interpret and understand visual information from the real world.",
    applications: ["Object Detection", "Image Classification", "Video Analytics", "Medical Imaging"],
    related: ["AI", "ML", "Robotics"],
    category: "Applied",
  },
  {
    id: "genai",
    label: "Generative AI",
    shortLabel: "GenAI",
    description: "Creating AI systems that generate new content, from text to images to code.",
    applications: ["Large Language Models", "Image Generation", "Code Generation", "Synthetic Data"],
    related: ["AI", "ML", "Software"],
    category: "Applied",
  },
  {
    id: "robotics",
    label: "Robotics",
    shortLabel: "Robotics",
    description: "Designing intelligent machines that interact with and navigate the physical world.",
    applications: ["Automation", "Control Systems", "Sensor Fusion", "Path Planning"],
    related: ["AI", "Software", "Edge Computing"],
    category: "Applied",
  },
  {
    id: "software",
    label: "Software Engineering",
    shortLabel: "Software",
    description: "Building robust, scalable software systems with modern engineering practices.",
    applications: ["Full Stack", "Cloud Native", "APIs", "Distributed Systems"],
    related: ["Cloud", "Data", "Robotics"],
    category: "Infrastructure",
  },
  {
    id: "cloud",
    label: "Cloud & Data",
    shortLabel: "Cloud",
    description: "Leveraging cloud infrastructure and data systems for enterprise-scale operations.",
    applications: ["Cloud Architecture", "Data Pipelines", "ETL", "Real-time Analytics"],
    related: ["Software", "Advanced Computing", "ML"],
    category: "Infrastructure",
  },
  {
    id: "hpc",
    label: "Advanced Computing",
    shortLabel: "HPC",
    description: "High-performance GPU computing and cluster architectures for demanding workloads.",
    applications: ["GPU Computing", "HPC Clusters", "InfiniBand", "Workload Orchestration"],
    related: ["ML", "AI", "Cloud"],
    category: "Infrastructure",
  },
];

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<string | null>(null);


  const selectedNode = technologies.find((t) => t.id === selected);

  return (
    <section id="technology" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E66800]/3 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              Technology Ecosystem
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            The Technology Behind
            <br />
            <span className="bg-gradient-to-r from-[#FF9040] to-[#00D9FF] bg-clip-text text-transparent">
              the Systems
            </span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            An interconnected ecosystem of technologies powering our applied research
            and engineering solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Network visualization */}
          <div className="lg:col-span-3">
            <motion.div
              className="glass-card p-8 relative min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Center node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-20 h-20 rounded-full bg-[#FF7200]/10 border border-[#FF7200]/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-[8px] text-[#FF9040]/50 tracking-wider">APPLIED</div>
                    <div className="font-mono text-[10px] text-[#FF9040] font-medium">INTELLIGENCE</div>
                  </div>
                </div>
              </div>

              {/* Tech nodes in circle */}
              <div className="relative w-full aspect-square max-w-[360px] mx-auto">
                {technologies.map((tech, i) => {
                  const angle = (i * 2 * Math.PI) / technologies.length - Math.PI / 2;
                  const radius = 42;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  const isActive = selected === tech.id;

                  return (
                    <motion.button
                      key={tech.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelected(isActive ? null : tech.id)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: "backOut" }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {/* Connection line to center */}
                      <svg
                        className="absolute pointer-events-none"
                        style={{
                          left: "50%",
                          top: "50%",
                          width: "200px",
                          height: "200px",
                          transform: "translate(-50%, -50%)",
                        }}
                        viewBox="0 0 200 200"
                      >
                        <line
                          x1="100" y1="100"
                          x2={100 + (50 - x) * 3.6}
                          y2={100 + (50 - y) * 3.6}
                          stroke={isActive ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)"}
                          strokeWidth="1"
                          className="transition-all duration-300"
                        />
                      </svg>

                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-[#FF7200]/20 border border-[#FF7200]/50 shadow-lg shadow-[#FF7200]/20"
                            : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="text-center">
                          <span className={`font-mono text-[10px] font-medium block ${isActive ? "text-[#FF9040]" : "text-white/60"}`}>
                            {tech.shortLabel}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 min-h-[400px]">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  className="glass-card p-6 h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono text-[#FF9040]/70 border border-[#FF7200]/20 rounded-md bg-[#FF7200]/5">
                      {selectedNode.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{selectedNode.label}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6">{selectedNode.description}</p>

                  <div className="mb-6">
                    <h4 className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">
                      Applications
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNode.applications.map((app, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 text-xs text-white/50 border border-white/5 rounded-lg bg-white/[0.02]"
                        >
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">
                      Related Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.related.map((rel, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[10px] font-mono text-[#FF9040]/60 border border-[#FF7200]/10 rounded-md"
                        >
                          {rel}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="glass-card p-8 h-full flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center mb-4">
                    <span className="font-mono text-lg text-white/20">?</span>
                  </div>
                  <p className="text-sm max-w-[200px] text-white/30">
                    Select a technology node to explore its capabilities and applications
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
