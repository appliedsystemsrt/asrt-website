"use client";

import { motion } from "framer-motion";

export default function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.img
          src="/brand-logo.png"
          alt="ASRT"
          className="w-24 h-24 object-contain"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#FF9040]/60">
          {label}
        </span>
      </motion.div>
    </div>
  );
}
