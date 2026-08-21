"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminAuth from "@/components/AdminAuth";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  createdAt: string;
}

export default function AdminTeams() {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", bio: "", image: "" });
  const [imageUploading, setImageUploading] = useState(false);

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    setTeams(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      }
    } catch {
      alert("Image upload failed");
    }
    setImageUploading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", role: "", bio: "", image: "" });
    setShowForm(false);
    fetchTeams();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
    fetchTeams();
  };

  return (
    <AdminAuth>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Team Members</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage your team member profiles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="admin-btn admin-btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Member
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
            <form onSubmit={handleAdd} className="admin-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-input"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Role *</label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="admin-input"
                    placeholder="Job title / role"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="admin-input min-h-[80px]"
                  placeholder="Brief bio description"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Photo</label>
                <div className="flex items-center gap-4">
                  <label className="admin-btn admin-btn-secondary text-sm cursor-pointer flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {imageUploading ? "Uploading..." : "Upload Photo"}
                  </label>
                  {form.image && (
                    <div className="relative">
                      <img src={form.image} alt="Preview" className="h-14 w-14 rounded-full object-cover border border-white/10" />
                      <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Member
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

      {/* Team List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : teams.length === 0 ? (
        <p className="text-center text-white/30 py-12">No team members yet</p>
      ) : (
        <div className="space-y-3">
          {teams.map((member) => (
            <motion.div
              key={member.id}
              layout
              className="admin-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-[#FF7200]/20 border border-blue-500/20 flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-blue-400">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base font-medium text-white/80">{member.name}</p>
                  <p className="text-sm text-white/40">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-white/30 mt-1 max-w-md truncate">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                className="admin-btn admin-btn-danger text-sm flex items-center gap-1.5"
                title="Delete member"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </AdminAuth>
  );
}
