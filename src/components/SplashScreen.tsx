"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const timer = setTimeout(() => setVisible(false), mq.matches ? 200 : 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808] dark:bg-[#080808]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 tech-grid opacity-30" />

          {/* Circuit lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(255,114,0,0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Vertical data lines */}
            {[20, 35, 50, 65, 80].map((x, i) => (
              <motion.line
                key={i}
                x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
              />
            ))}
            {/* Horizontal data lines */}
            {[25, 45, 55, 75].map((y, i) => (
              <motion.line
                key={`h${i}`}
                x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
                stroke="url(#lineGrad)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              />
            ))}
            {/* Node dots */}
            {[
              { cx: "20%", cy: "25%" }, { cx: "35%", cy: "45%" },
              { cx: "50%", cy: "55%" }, { cx: "65%", cy: "35%" },
              { cx: "80%", cy: "65%" }, { cx: "50%", cy: "45%" },
            ].map((pos, i) => (
              <motion.circle
                key={`node${i}`}
                cx={pos.cx} cy={pos.cy} r="2"
                fill="#FF7200"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              />
            ))}
          </svg>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <img src="/brand-logo.jpeg" alt="ASRT" className="w-20 h-20 object-contain" />
            </motion.div>

            {/* Company name */}
            <motion.div
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] text-[#FF9040]/60 mb-2 uppercase">
                System Initialize
              </div>
              <h1 className="text-sm md:text-base font-medium tracking-[0.2em] text-white/80 uppercase">
                Applied System Research
              </h1>
              <h2 className="text-xs md:text-sm tracking-[0.15em] text-white/50 mt-1 uppercase">
                & Technology
              </h2>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-px bg-white/10 rounded-full overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF7200]/0 via-[#FF7200] to-[#FF7200]/0"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
