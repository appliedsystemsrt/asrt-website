"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
}

export default function Products() {
  const ref = useRef(null);
  const [products, setProducts] = useState<Product[]>([]);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section id="products" className="relative py-24 md:py-32" ref={ref}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#E66800]/3 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              What We Build
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Products
          </h2>
        </motion.div>

        {/* Product cards */}
        <div className="space-y-5">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className="glass-card p-8 group cursor-pointer relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#FF7200]/0 to-[#FF7200]/0 transition-all duration-500 via-[#FF7200]/[0.02] group-hover:via-[#FF7200]/[0.04]`} />

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Product info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs text-[#FF9040]/50">PRODUCT / {String(i + 1).padStart(2, "0")}</span>
                        <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400/70 border border-emerald-500/20 rounded-md bg-emerald-500/5">
                          Development
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#FF9040] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#FF9040]/60 mb-3">{product.tagline}</p>
                      <p className="text-sm text-white/40 leading-relaxed max-w-2xl">{product.description}</p>
                    </div>

                    {/* Right: Tags and CTA */}
                    <div className="flex flex-col items-start lg:items-end gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 text-[10px] font-mono text-white/30 border border-white/5 rounded-md bg-white/[0.02]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50 group-hover:text-[#FF9040] transition-colors">
                        <span>View Product</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
