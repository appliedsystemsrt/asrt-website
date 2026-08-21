"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";

interface Blog {
  id: string;
  type: "blog" | "article" | "newsletter";
  title: string;
  author: string;
  content: string;
  excerpt: string;
  coverImage: string;
  pdfUrl: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<Blog | null>(null);
  const [filter, setFilter] = useState<"all" | "blog" | "article" | "newsletter">("all");
  const searchParams = useSearchParams();
  const requestedPostId = searchParams.get("post");

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data);
        if (requestedPostId) {
          setActivePost(data.find((post: Blog) => post.id === requestedPostId) || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [requestedPostId]);

  const filtered =
    filter === "all" ? blogs : blogs.filter((b) => b.type === filter);
  const showTimeline = filtered.length > 2;

  const typeColors: Record<string, string> = {
    blog: "from-blue-500 to-blue-600",
    article: "from-[#FF7200] to-[#E66800]",
    newsletter: "from-cyan-500 to-cyan-600",
  };

  const typeBg: Record<string, string> = {
    blog: "bg-blue-500/10 text-blue-400",
    article: "bg-[#FF7200]/10 text-[#FF9040]",
    newsletter: "bg-cyan-500/10 text-[#00D9FF]",
  };

  return (
    <>
      <ScrollProgress />
      <Navigation />

      <main className="min-h-screen bg-[#080808]">
        {/* Hero */}
        <section className="relative pt-40 pb-16 overflow-hidden">
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
                  Insights
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Blog,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-[#FF9040] bg-clip-text text-transparent">
                  Articles
                </span>{" "}
                & Newsletters
              </h1>
              <p className="text-lg text-white/40 max-w-2xl">
                Explore our latest insights, research updates, and news from the
                world of applied AI and technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "blog", "article", "newsletter"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === tab
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-white/40 hover:text-white/60 border border-transparent hover:bg-white/5"
                }`}
              >
                {tab === "all" ? "All Posts" : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <LoadingScreen label="Loading insights" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg">No posts yet</p>
              <p className="text-white/20 text-sm mt-2">
                Check back soon or visit the admin panel to create content.
              </p>
            </div>
          ) : showTimeline ? (
            /* Timeline View */
            <div className="relative">
              {/* Center line */}
              <div className="timeline-line hidden md:block" />

              <div className="space-y-12 md:space-y-16">
                {filtered.map((blog, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6 }}
                      className={`relative md:flex items-center ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Dot */}
                      <div
                        className="timeline-dot hidden md:block"
                        style={{ top: "50%" }}
                      />

                      {/* Card */}
                      <div
                        className={`md:w-5/12 ${
                          isLeft ? "md:pr-16" : "md:pl-16"
                        }`}
                      >
                        <button
                          onClick={() => setActivePost(blog)}
                          className="glass-card p-6 w-full text-left cursor-pointer group"
                        >
                          {blog.coverImage && (
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                          )}
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                typeBg[blog.type]
                              }`}
                            >
                              {blog.type}
                            </span>
                            <span className="reading-time-badge">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {blog.readTime} min read
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-white/90 group-hover:text-blue-400 transition-colors mb-2">
                            {blog.title}
                          </h2>
                          <p className="text-sm text-white/40 line-clamp-2">
                            {blog.excerpt || "Click to read more..."}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                            <span>{blog.author}</span>
                            <span>•</span>
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Empty space for the other side */}
                      <div className="hidden md:block md:w-5/12" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Grid View for ≤2 posts */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => setActivePost(blog)}
                  className="glass-card p-6 text-left cursor-pointer group"
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        typeBg[blog.type]
                      }`}
                    >
                      {blog.type}
                    </span>
                    <span className="reading-time-badge">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {blog.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white/90 group-hover:text-blue-400 transition-colors mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-white/40">{blog.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Full Post Modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setActivePost(null)}
            />
            <motion.div
              className="relative w-full max-w-3xl bg-[#0B0B0D]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close button */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>

              {/* Cover */}
              {activePost.coverImage && (
                <img
                  src={activePost.coverImage}
                  alt={activePost.title}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-8 md:p-12">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      typeBg[activePost.type]
                    }`}
                  >
                    {activePost.type}
                  </span>
                  <span className="reading-time-badge">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {activePost.readTime} min read
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white/95 mb-4">
                  {activePost.title}
                </h1>

                <div className="flex items-center gap-3 mb-8 text-sm text-white/40">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-[#FF7200]/20 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-400">
                      {activePost.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <span>{activePost.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(activePost.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="prose prose-invert max-w-none text-white/80 leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white/90 [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white/85 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white/80 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_blockquote]:border-l-3 [&_blockquote]:border-blue-500/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/50 [&_blockquote]:my-4 [&_img]:rounded-lg [&_img]:my-6 [&_img]:w-full"
                  dangerouslySetInnerHTML={{ __html: activePost.content }}
                />

                {/* PDF link */}
                {activePost.pdfUrl && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <a
                      href={activePost.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      Download PDF/Document
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
