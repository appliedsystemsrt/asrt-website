"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import AdminAuth from "@/components/AdminAuth";

interface Communication {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  interest: string;
  message: string;
  subscribeNewsletters: boolean;
  subscribeArticles: boolean;
  subscribeBlogs: boolean;
  createdAt: string;
  read: boolean;
}

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [comms, setComms] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Communication | null>(null);

  const fetchComms = async () => {
    const res = await fetch("/api/communications");
    const data = await res.json();
    setComms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComms();
  }, []);

  useEffect(() => {
    if (selectedId && comms.length > 0) {
      const comm = comms.find((c) => c.id === selectedId);
      if (comm) {
        setSelected(comm);
        if (!comm.read) {
          fetch("/api/communications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "markRead", id: comm.id }),
          }).then(() => {
            setSelected((prev) => (prev && prev.id === comm.id ? { ...prev, read: true } : prev));
            fetchComms();
          });
        }
      }
    }
  }, [selectedId, comms]);

  const toggleSubscription = async (commId: string, field: "subscribeNewsletters" | "subscribeArticles" | "subscribeBlogs", currentValue: boolean) => {
    // Update locally first for instant feedback
    setSelected((prev) => prev && prev.id === commId ? { ...prev, [field]: !currentValue } : prev);
    setComms((prev) => prev.map((c) => c.id === commId ? { ...c, [field]: !currentValue } : c));

    try {
      await fetch("/api/communications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: commId,
          subscribeNewsletters: selected?.id === commId ? !currentValue : selected?.subscribeNewsletters ?? false,
          subscribeArticles: selected?.id === commId ? !currentValue : selected?.subscribeArticles ?? false,
          subscribeBlogs: selected?.id === commId ? !currentValue : selected?.subscribeBlogs ?? false,
        }),
      });
    } catch {
      // Revert on error
      setSelected((prev) => prev && prev.id === commId ? { ...prev, [field]: currentValue } : prev);
      setComms((prev) => prev.map((c) => c.id === commId ? { ...c, [field]: currentValue } : c));
    }
  };

  const unreadCount = comms.filter((c) => !c.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Communications</h1>
          <p className="text-sm text-white/40 mt-1">
            Contact form submissions and enquiries
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : comms.length === 0 ? (
            <p className="text-center text-white/30 py-12">No communications yet</p>
          ) : (
            comms.map((comm) => (
              <button
                key={comm.id}
                onClick={() => setSelected(comm)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === comm.id
                    ? "bg-blue-500/10 border-blue-500/20"
                    : comm.read
                    ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    : "bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      comm.read ? "bg-white/10" : "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      {comm.name}
                    </p>
                    <p className="text-xs text-white/30 truncate">
                      {comm.interest || comm.message.slice(0, 50)}
                    </p>
                    <p className="text-[10px] text-white/20 mt-0.5">
                      {new Date(comm.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white/90">{selected.name}</h2>
                  <p className="text-sm text-white/40 mt-1">
                    Submitted {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="admin-btn admin-btn-secondary text-sm"
                >
                  Close
                </button>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Email" value={selected.email} />
                <DetailItem label="Phone" value={selected.phone || "Not provided"} />
                <DetailItem label="Company" value={selected.company || "Not provided"} />
                <DetailItem label="City" value={selected.city || "Not provided"} />
                <DetailItem label="Interest" value={selected.interest || "Not specified"} />
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-2">Message</h3>
                <p className="text-white/80 bg-white/[0.03] p-4 rounded-lg border border-white/5 leading-relaxed">
                  {selected.message || "No message provided"}
                </p>
              </div>

              {/* Subscription Preferences — Toggleable */}
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-2">
                  Subscription Preferences
                </h3>
                <p className="text-xs text-white/30 mb-3">Toggle to subscribe/unsubscribe this contact from notifications</p>
                <div className="flex gap-3 flex-wrap">
                  <SubToggle
                    label="Newsletters"
                    active={selected.subscribeNewsletters}
                    onToggle={() => toggleSubscription(selected.id, "subscribeNewsletters", selected.subscribeNewsletters)}
                  />
                  <SubToggle
                    label="Articles"
                    active={selected.subscribeArticles}
                    onToggle={() => toggleSubscription(selected.id, "subscribeArticles", selected.subscribeArticles)}
                  />
                  <SubToggle
                    label="Blogs"
                    active={selected.subscribeBlogs}
                    onToggle={() => toggleSubscription(selected.id, "subscribeBlogs", selected.subscribeBlogs)}
                  />
                </div>
              </div>

              {/* Reply Form */}
              <ReplyForm
                id={selected.id}
                email={selected.email}
                name={selected.name}
                onReplySent={() => {
                  setSelected((current) => (current ? { ...current, read: true } : current));
                  setComms((current) => current.map((comm) => comm.id === selected.id ? { ...comm, read: true } : comm));
                }}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="admin-btn admin-btn-secondary text-sm"
                  >
                    Call
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="admin-card flex items-center justify-center min-h-[300px]">
              <p className="text-white/20 text-sm">
                Select a communication to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  );
}

function SubToggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all border ${
        active
          ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
          : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-white/50"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-green-400" : "bg-white/20"
        }`}
      />
      {label}
      <span className="text-[10px] ml-1 opacity-60">{active ? "ON" : "OFF"}</span>
    </button>
  );
}

function ReplyForm({ id, email, name, onReplySent }: { id: string; email: string; name: string; onReplySent: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailWarning, setEmailWarning] = useState("");
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: email, toName: name, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        await fetch("/api/communications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "markRead", id }),
        });
        onReplySent();
        setSent(true);
        setEmailWarning(data.emailSent === false ? (data.message || "") : "");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error || "Failed to send");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-2">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-green-400">✓ Reply saved for {email}</p>
          {emailWarning && (
            <p className="text-xs text-yellow-400/80 mt-1">{emailWarning}</p>
          )}
          <button onClick={() => { setSent(false); setEmailWarning(""); }} className="text-xs text-white/40 mt-2 hover:text-white/60">Send another</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-3">
      <h3 className="text-sm font-medium text-white/50">Reply to {name}</h3>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="admin-input text-sm"
        placeholder="Subject"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="admin-input text-sm min-h-[100px]"
        placeholder="Type your reply..."
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="admin-btn admin-btn-primary text-sm"
      >
        {sending ? "Sending..." : "Send Reply"}
      </button>
    </form>
  );
}

export default function AdminCommunications() {
  return (
    <AdminAuth>
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      }
    >
      <CommunicationsContent />
    </Suspense>
    </AdminAuth>
  );
}
