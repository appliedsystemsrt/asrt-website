"use client";

import { motion } from "framer-motion";

const capabilities = [
  "Artificial Intelligence",
  "Machine Learning",
  "Robotics",
  "Software Engineering",
  "Research & Development",
  "Advanced Computing",
  "Computer Vision",
  "Data Analytics",
];

export default function CapabilityStrip() {
  return (
    <section className="relative py-8 border-y border-white/5 bg-[#0B0B0D]/50 overflow-hidden">
      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10" />

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {[...capabilities, ...capabilities].map((cap, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4"
          >
            <span className="w-1 h-1 rounded-full bg-[#FF7200]/50" />
            <span className="text-sm font-mono tracking-wider text-white/30 uppercase">
              {cap}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
