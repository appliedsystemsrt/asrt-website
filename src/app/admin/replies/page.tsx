"use client";

import { useEffect, useState } from "react";
import AdminAuth from "@/components/AdminAuth";

interface ReplyRecord {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminReplies() {
  const [replies, setReplies] = useState<ReplyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/replies")
      .then((response) => response.json())
      .then((data) => setReplies(Array.isArray(data) ? data : []))
      .catch(() => setReplies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminAuth>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Replies</h1>
          <p className="text-sm text-white/40 mt-1">
            Review every reply sent from the admin panel.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : replies.length === 0 ? (
          <div className="admin-card text-center py-16">
            <p className="text-white/40">No replies sent yet.</p>
            <p className="text-sm text-white/20 mt-2">
              Replies sent from Communications will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {replies.map((reply) => (
              <article key={reply.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-5 shadow-lg shadow-black/10">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                  <div>
                    <p className="text-xs font-mono tracking-widest uppercase text-blue-400/70 mb-2">
                      To
                    </p>
                    <h2 className="text-base font-medium text-white/85">
                      {reply.toName || "User"}
                    </h2>
                    <a href={`mailto:${reply.toEmail}`} className="text-sm text-[#FF9040] hover:text-white transition-colors">
                      {reply.toEmail}
                    </a>
                  </div>
                  <time className="text-xs text-white/30 font-mono" dateTime={reply.createdAt}>
                    {new Date(reply.createdAt).toLocaleString()}
                  </time>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-2">
                    Subject
                  </p>
                  <p className="text-white/75">{reply.subject}</p>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-lg p-4">
                  <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-2">
                    Your Reply
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                    {reply.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminAuth>
  );
}
