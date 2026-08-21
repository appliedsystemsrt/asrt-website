"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminAuth from "@/components/AdminAuth";

interface Newsletter {
  id: string;
  type: string;
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

export default function AdminNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "ASRT Team",
    newsletterDate: new Date().toISOString().split("T")[0],
    message: "",
    coverImage: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchNewsletters = async () => {
    const res = await fetch("/api/blogs");
    const all = await res.json();
    setNewsletters(all.filter((b: Newsletter) => b.type === "newsletter"));
    setLoading(false);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.url) {
      setPhotos((prev) => [...prev, data.url]);
    }
    setUploading(false);
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = `
      <p><strong>Newsletter Date:</strong> ${form.newsletterDate}</p>
      ${photos.map((p) => `<img src="${p}" alt="Newsletter photo" />`).join("")}
      <div>${form.message}</div>
    `;

    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "newsletter",
        title: form.title,
        author: form.author,
        content,
        excerpt: form.message.slice(0, 200),
        coverImage: form.coverImage,
        pdfUrl: "",
      }),
    });
    const result = await response.json();
    if (result.notifications?.failed?.length) {
      alert(`Published, but ${result.notifications.failed.length} subscriber email(s) failed to send.`);
    } else if (result.notifications?.sent) {
      alert(`Published and emailed ${result.notifications.sent} subscriber(s).`);
    }

    setForm({
      title: "",
      author: "ASRT Team",
      newsletterDate: new Date().toISOString().split("T")[0],
      message: "",
      coverImage: "",
    });
    setPhotos([]);
    setShowForm(false);
    fetchNewsletters();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this newsletter?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchNewsletters();
  };

  return (
    <AdminAuth>
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Newsletters</h1>
          <p className="text-sm text-white/40 mt-1">
            Create and manage newsletters with dates, photos, and messages
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              title: "",
              author: "ASRT Team",
              newsletterDate: new Date().toISOString().split("T")[0],
              message: "",
              coverImage: "",
            });
            setPhotos([]);
            setShowForm(!showForm);
          }}
          className="admin-btn admin-btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Newsletter
        </button>
      </div>

      {/* Add Form */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">
                    Newsletter Date *
                  </label>
                  <input
                    type="date"
                    value={form.newsletterDate}
                    onChange={(e) =>
                      setForm({ ...form, newsletterDate: e.target.value })
                    }
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="admin-input"
                    placeholder="Newsletter title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="admin-input"
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-sm text-white/50 mb-1">
                  Photos (optional)
                </label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border border-dashed border-white/15 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    )}
                  </label>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm text-white/50 mb-1">Cover Image URL</label>
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="admin-input"
                  placeholder="/uploads/cover.jpg"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-white/50 mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="admin-input min-h-[150px]"
                  placeholder="Write your newsletter message here..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Publish Newsletter
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

      {/* Newsletter List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : newsletters.length === 0 ? (
        <p className="text-center text-white/30 py-12">No newsletters yet</p>
      ) : (
        <div className="space-y-3">
          {newsletters.map((nl) => (
            <motion.div
              key={nl.id}
              layout
              className="admin-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-base font-medium text-white/80 truncate">
                    {nl.title}
                  </p>
                  <p className="text-sm text-white/40">
                    {nl.author} •{" "}
                    {new Date(nl.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDelete(nl.id)}
                  className="admin-btn admin-btn-danger text-sm flex items-center gap-1.5"
                  title="Delete"
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
