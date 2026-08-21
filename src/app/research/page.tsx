"use client";

import Navigation from "@/components/Navigation";
import Research from "@/components/Research";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ResearchPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0B0B0D] to-[#080808]" />
          <div className="absolute inset-0 tech-grid opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="font-mono text-[10px] text-blue-400/70 tracking-widest uppercase">
                  Research
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Research &{" "}
                <span className="bg-gradient-to-r from-blue-400 to-[#00D9FF] bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="text-lg text-white/40 max-w-2xl">
                Technical articles and insights from our applied research across AI, ML, robotics and advanced computing.
              </p>
            </motion.div>
          </div>
        </section>

        <Research />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
