"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminAuth from "@/components/AdminAuth";

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  overview: string;
  problem: string;
  intelligence: string;
  modules: string;
  architecture: string;
  technology: string;
  security: string;
  performance: string;
  testing: string;
  roadmap: string;
  tags: string[];
  image: string;
  createdAt: string;
}

const EMPTY_FORM = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  overview: "",
  problem: "",
  intelligence: "",
  modules: "",
  architecture: "",
  technology: "",
  security: "",
  performance: "",
  testing: "",
  roadmap: "",
  screens: "",
  research: "",
  workflow: "",
  differentiation: "",
  tags: "",
  image: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [analyzing, setAnalyzing] = useState(false);

  const generateProductFromText = async (documentText: string) => {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate-product",
        documentText: documentText.slice(0, 12000),
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Product generation failed");
    }

    const generated = result.data;
    setForm((prev) => ({
      ...prev,
      name: generated.name || prev.name,
      slug: generated.slug || prev.slug,
      tagline: generated.tagline || "",
      description: generated.description || "",
      overview: generated.overview || "",
      problem: generated.problem || "",
      intelligence: generated.intelligence || "",
      modules: generated.modules || "",
      architecture: generated.architecture || "",
      technology: generated.technology || "",
      security: generated.security || "",
      performance: generated.performance || "",
      testing: generated.testing || "",
      roadmap: generated.roadmap || "",
      screens: generated.screens || "",
      research: generated.research || "",
      workflow: generated.workflow || "",
      differentiation: generated.differentiation || "",
      tags: Array.isArray(generated.tags) ? generated.tags.join(", ") : generated.tags || "",
    }));
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.text) {
        setAnalyzing(false);
        alert(uploadData.error || "No readable text was found in this document.");
        return;
      }

      const productName = file.name.replace(/\.(pdf|doc|docx)$/i, "").replace(/[-_]/g, " ");
      setForm((prev) => ({
        ...prev,
        name: prev.name || productName,
        slug: prev.slug || productName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
      await generateProductFromText(uploadData.text);
      setAnalyzing(false);
      setShowForm(true);
    } catch (error) {
      setAnalyzing(false);
      alert(error instanceof Error ? error.message : "Product generation failed");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <AdminAuth>
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Products</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage product pages displayed on the website
          </p>
        </div>
        <div className="flex gap-3">
          <label className="admin-btn admin-btn-secondary flex items-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {analyzing ? "Generating with AI..." : "Upload PDF/DOC"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handlePdfUpload}
              disabled={analyzing}
            />
          </label>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setShowForm(!showForm);
            }}
            className="admin-btn admin-btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="admin-card space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. JARVIS AI"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. jarvis"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Tagline *</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="admin-input"
                  placeholder="Short product tagline"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input min-h-[80px]"
                  placeholder="Product description"
                  required
                />
              </div>

              {/* Section Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    ["overview", "Overview"],
                    ["problem", "Problem Statement"],
                    ["intelligence", "Intelligence Layer"],
                    ["modules", "Modules"],
                    ["architecture", "Architecture"],
                    ["technology", "Technology Stack"],
                    ["security", "Security"],
                    ["performance", "Performance"],
                    ["testing", "Testing"],
                    ["roadmap", "Roadmap"],
                    ["screens", "Product Screens"],
                    ["research", "Applied AI Research"],
                    ["workflow", "Product Workflow"],
                    ["differentiation", "Differentiation"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm text-white/50 mb-1">{label}</label>
                    <textarea
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="admin-input min-h-[100px]"
                      placeholder={`${label} content...`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Tags (comma separated)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="admin-input"
                    placeholder="AI, ML, Robotics"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Cover Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="admin-input"
                    placeholder="/uploads/cover.jpg or https://..."
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/60 mb-2">Preview</h3>
                <p className="text-white/90 font-semibold">{form.name || "Product Name"}</p>
                <p className="text-white/50 text-sm">{form.tagline || "Product Tagline"}</p>
                {form.overview && (
                  <p className="text-white/30 text-sm mt-2 line-clamp-3">{form.overview}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-white/30 py-12">No products yet</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              className="admin-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7200]/20 to-[#FF7200]/20 border border-[#FF7200]/20 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-[#FF9040]">
                    {product.name.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base font-medium text-white/80">{product.name}</p>
                  <p className="text-sm text-white/40">{product.tagline}</p>
                  <div className="flex gap-2 mt-1">
                    {product.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="admin-btn admin-btn-secondary text-sm"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="admin-btn admin-btn-danger text-sm flex items-center gap-1.5"
                  title="Delete product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </AdminAuth>
  );
}
