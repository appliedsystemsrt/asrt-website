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
  const [uploadError, setUploadError] = useState("");
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "", bio: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    setTeams(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const uploadPhoto = async (file: File, onUrl: (url: string) => void) => {
    setImageUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        onUrl(data.url);
        setUploadError("");
      } else if (data.error) {
        setUploadError(data.error);
      }
    } catch {
      setUploadError("Image upload failed. Please try again.");
    }
    setImageUploading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file, (url) => setForm((prev) => ({ ...prev, image: url })));
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file, (url) => setEditForm((prev) => ({ ...prev, image: url })));
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

  const openEdit = (member: TeamMember) => {
    setEditError("");
    setEditForm({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image: member.image || "",
    });
    setEditing(member);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setEditError("");
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...editForm }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setEditError(data.error || "Failed to save changes");
        return;
      }
      setEditing(null);
      fetchTeams();
    } catch {
      setEditError("Connection failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setEditing(null);
    setEditForm({ name: "", role: "", bio: "", image: "" });
    setEditError("");
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
              </div>                <div>
                <label className="block text-sm text-white/50 mb-1">Photo</label>
                <p className="text-xs text-white/30 mb-2">Supported: JPG, PNG, WebP, GIF, SVG — max 10 MB</p>
                {uploadError && <p className="text-xs text-red-400 mb-2">{uploadError}</p>}
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
              onClick={() => openEdit(member)}
              className="admin-card flex items-center justify-between cursor-pointer group"
              title="Click to edit member"
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
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/25 group-hover:text-[#FF9040] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                  className="admin-btn admin-btn-danger text-sm flex items-center gap-1.5"
                  title="Delete member"
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

    {/* Edit Member Modal */}
    <AnimatePresence>
      {editing && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg bg-[#0B0B0D] border border-white/10 rounded-2xl p-6 shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white/90">Edit Team Member</h2>
              <button onClick={handleDiscard} className="text-white/40 hover:text-white/70 transition-colors">✕</button>
            </div>

            {/* Photo */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-[#FF7200]/20 border border-blue-500/20 flex items-center justify-center overflow-hidden shrink-0">
                {editForm.image ? (
                  <img
                    src={editForm.image}
                    alt={editForm.name || "Member"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-blue-400">
                    {(editForm.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label className="admin-btn admin-btn-secondary text-sm cursor-pointer flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <input type="file" accept="image/*" className="hidden" onChange={handleEditImageUpload} />
                  {imageUploading ? "Uploading..." : "Replace Photo"}
                </label>
                {editForm.image && (
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, image: "" })}
                    className="block text-xs text-white/40 hover:text-red-400 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            {uploadError && <p className="text-xs text-red-400 mb-4">{uploadError}</p>}

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1">Name *</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="admin-input"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Role / Position *</label>
                <input
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="admin-input"
                  placeholder="Job title / role"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="admin-input min-h-[80px]"
                  placeholder="Brief bio description"
                />
              </div>
            </div>

            {editError && <p className="text-xs text-red-400 mt-4">{editError}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSave}
                disabled={saving || !editForm.name.trim() || !editForm.role.trim()}
                className="admin-btn admin-btn-primary disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={handleDiscard} className="admin-btn admin-btn-secondary">
                Discard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </AdminAuth>
  );
}
