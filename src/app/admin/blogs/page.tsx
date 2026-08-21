"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import AdminAuth from "@/components/AdminAuth";

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

function TipTapToolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const btn = (active = false) =>
    `p-1.5 rounded transition-colors ${active ? "bg-[#FF7200]/20 text-[#FF7200]" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`;
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Bold"><span className="text-xs font-bold px-1">B</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italic"><span className="text-xs italic px-1">I</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Underline"><span className="text-xs underline px-1">U</span></button>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="H2"><span className="text-xs font-bold px-1">H2</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="H3"><span className="text-xs font-bold px-1">H3</span></button>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Bullet List"><span className="text-xs px-1">• List</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Numbered List"><span className="text-xs px-1">1. List</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Quote"><span className="text-xs px-1">&quot; Quote</span></button>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn()} title="Undo"><span className="text-xs px-1">↩</span></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn()} title="Redo"><span className="text-xs px-1">↪</span></button>
    </div>
  );
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "blog" as "blog" | "article" | "newsletter",
    title: "",
    author: "",
    excerpt: "",
    coverImage: "",
    pdfUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; excerpt: string; content: string } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExt.configure({ openOnClick: false }),
      ImageExt,
      Placeholder.configure({ placeholder: "Start writing or use AI to generate content..." }),
    ],
    content: "",
  });

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    setBlogs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  // Cover image upload from device
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setForm((prev) => ({ ...prev, coverImage: data.url }));
    }
    setCoverUploading(false);
  };

  // Document upload for AI generation
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setForm((prev) => ({ ...prev, pdfUrl: data.url }));
      if (data.text) {
        setAiPrompt(data.text.slice(0, 12000));
      } else {
        setAiPrompt("");
        alert("No readable text was found in this document. Try a text-based PDF, DOCX, or TXT file.");
      }
    }
    setUploading(false);
  };

  // Generate blog with AI
  const handleAiGenerate = async () => {
    if (!aiPrompt && !form.pdfUrl) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-blog",
          documentText: aiPrompt || "Please generate a blog post about AI and technology.",
          title: form.title,
          type: form.type,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResult(data.data);
        setShowAiPreview(true);
      } else {
        alert(data.error || "AI generation failed");
      }
    } catch {
      alert("Connection failed");
    } finally {
      setAiGenerating(false);
    }
  };

  // Accept AI content
  const handleAcceptAi = () => {
    if (aiResult) {
      setForm((prev) => ({
        ...prev,
        title: aiResult.title || prev.title,
        excerpt: aiResult.excerpt || prev.excerpt,
      }));
      editor?.commands.setContent(aiResult.content || "");
      setShowAiPreview(false);
      setAiResult(null);
    }
  };

  // Publish
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML() || "";
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, content }),
    });
    const result = await response.json();
    if (result.notifications?.failed?.length) {
      alert(`Published, but ${result.notifications.failed.length} subscriber email(s) failed to send.`);
    } else if (result.notifications?.sent) {
      alert(`Published and emailed ${result.notifications.sent} subscriber(s).`);
    }
    setForm({ type: "blog", title: "", author: "", excerpt: "", coverImage: "", pdfUrl: "" });
    editor?.commands.setContent("");
    setShowForm(false);
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog/article?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const typeColors: Record<string, string> = {
    blog: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    article: "bg-[#FF7200]/10 text-[#FF9040] border-[#FF7200]/20",
    newsletter: "bg-cyan-500/10 text-[#00D9FF] border-cyan-500/20",
  };

  return (
    <AdminAuth>
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Blogs & Articles</h1>
          <p className="text-sm text-white/40 mt-1">Create and manage blog posts, articles, and newsletters</p>
        </div>
        <button onClick={() => { setForm({ type: "blog", title: "", author: "", excerpt: "", coverImage: "", pdfUrl: "" }); editor?.commands.setContent(""); setShowForm(!showForm); }} className="admin-btn admin-btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Post
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <form onSubmit={handleAdd} className="admin-card space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="admin-input">
                    <option value="blog">Blog</option>
                    <option value="article">Article</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" placeholder="Blog post title" required />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Author *</label>
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="admin-input" placeholder="Author name" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="admin-input min-h-[60px]" placeholder="Brief summary..." />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm text-white/50 mb-1">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="admin-btn admin-btn-secondary text-sm cursor-pointer flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    {coverUploading ? "Uploading..." : "Upload Cover Photo"}
                  </label>
                  {form.coverImage && (
                    <div className="relative">
                      <img src={form.coverImage} alt="Cover" className="h-16 w-24 object-cover rounded-lg border border-white/10" />
                      <button type="button" onClick={() => setForm({ ...form, coverImage: "" })} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Generation Section */}
              <div className="border border-[#FF7200]/20 rounded-xl p-4 bg-[#FF7200]/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#FF7200]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                  <span className="text-sm font-medium text-[#FF7200]">AI Content Generator</span>
                </div>
                <p className="text-xs text-white/30 mb-3">Upload a document and let AI generate a blog/article for you. You can edit before publishing.</p>

                <div className="flex items-center gap-3 mb-3">
                  <label className="admin-btn admin-btn-secondary text-sm cursor-pointer">
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleDocUpload} />
                    {uploading ? "Uploading..." : "Upload Document for AI"}
                  </label>
                  {form.pdfUrl && <span className="text-xs text-green-400">✓ Document uploaded</span>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={handleAiGenerate} disabled={aiGenerating || (!aiPrompt && !form.pdfUrl)} className="admin-btn admin-btn-primary text-sm disabled:opacity-50">
                    {aiGenerating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      "Generate with AI"
                    )}
                  </button>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm text-white/50 mb-1">Content *</label>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <TipTapToolbar editor={editor} />
                  <EditorContent editor={editor} className="tiptap-editor" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="admin-btn admin-btn-primary">Publish</button>
                <button type="button" onClick={() => setShowForm(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Preview Modal */}
      <AnimatePresence>
        {showAiPreview && aiResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-[#0B0B0D] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white/90">AI Generated Content</h2>
                <button onClick={() => { setShowAiPreview(false); setAiResult(null); }} className="text-white/40 hover:text-white/70">✕</button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-white/40 font-mono">TITLE</label>
                  <p className="text-white/80 mt-1">{aiResult.title}</p>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono">EXCERPT</label>
                  <p className="text-white/60 text-sm mt-1">{aiResult.excerpt}</p>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono">CONTENT PREVIEW</label>
                  <div className="text-white/60 text-sm mt-1 bg-white/[0.03] p-4 rounded-lg border border-white/5 max-h-60 overflow-y-auto" dangerouslySetInnerHTML={{ __html: aiResult.content }} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAcceptAi} className="admin-btn admin-btn-primary">Accept & Edit</button>
                <button onClick={() => { setShowAiPreview(false); setAiResult(null); }} className="admin-btn admin-btn-secondary">Discard</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-[#FF7200]/30 border-t-[#FF7200] rounded-full animate-spin" /></div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-white/30 py-12">No posts yet</p>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <motion.div key={blog.id} layout className="admin-card flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                ) : (
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded border ${typeColors[blog.type] || typeColors.blog}`}>{blog.type}</span>
                )}
                <div className="min-w-0">
                  <p className="text-base font-medium text-white/80 truncate">{blog.title}</p>
                  <p className="text-sm text-white/40">{blog.author} • {blog.readTime} min read • {new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/blog#${blog.id}`} target="_blank" className="admin-btn admin-btn-secondary text-sm">View</a>
                <button onClick={() => handleDelete(blog.id)} className="admin-btn admin-btn-danger text-sm">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </AdminAuth>
  );
}
