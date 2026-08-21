"use client";

import Navigation from "@/components/Navigation";
import Products from "@/components/Products";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0B0B0D] to-[#080808]" />
          <div className="absolute inset-0 tech-grid opacity-10" />
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#E66800]/5 rounded-full blur-[150px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF7200]/20 bg-[#FF7200]/5 mb-6">
                <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
                  Products
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                What We{" "}
                <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
                  Build
                </span>
              </h1>
              <p className="text-lg text-white/40 max-w-2xl">
                Products and systems developed through applied research and engineering at Applied System Research & Technology.
              </p>
            </motion.div>
          </div>
        </section>

        <Products />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
