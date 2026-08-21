"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuth from "@/components/AdminAuth";

interface Stats {
  teams: number;
  products: number;
  blogs: number;
  communications: number;
  unread: number;
}

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState("");
  const [stats, setStats] = useState<Stats>({
    teams: 0,
    products: 0,
    blogs: 0,
    communications: 0,
    unread: 0,
  });
  const [recentComms, setRecentComms] = useState<any[]>([]);
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Check email configuration
    fetch("/api/email-setup")
      .then((r) => r.json())
      .then((d) => setEmailConfigured(d.configured))
      .catch(() => setEmailConfigured(false));

    // Get admin name
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.adminName) setAdminName(d.adminName);
      })
      .catch(() => {});

    // Update time
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/teams").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/blogs").then((r) => r.json()),
      fetch("/api/communications").then((r) => r.json()),
    ]).then(([teams, products, blogs, comms]) => {
      setStats({
        teams: teams.length,
        products: products.length,
        blogs: blogs.length,
        communications: comms.length,
        unread: comms.filter((c: any) => !c.read).length,
      });
      setRecentComms(comms.slice(0, 5));
    });
  }, []);

  const cards = [
    {
      label: "Team Members",
      value: stats.teams,
      href: "/admin/teams",
      color: "from-blue-500/10 to-blue-600/5",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    {
      label: "Products",
      value: stats.products,
      href: "/admin/products",
      color: "from-[#FF7200]/10 to-indigo-600/5",
      border: "border-[#FF7200]/20",
      text: "text-[#FF9040]",
    },
    {
      label: "Blogs & Articles",
      value: stats.blogs,
      href: "/admin/blogs",
      color: "from-[#FF7200]/10 to-[#E66800]/5",
      border: "border-[#FF7200]/20",
      text: "text-[#FF9040]",
    },
    {
      label: "Communications",
      value: stats.communications,
      href: "/admin/communications",
      color: "from-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-500/20",
      text: "text-[#00D9FF]",
      badge: stats.unread > 0 ? `${stats.unread} new` : undefined,
    },
  ];

  return (
    <AdminAuth>
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white/90 mb-1">
            Welcome, {adminName} 👋
          </h1>
          <p className="text-base text-white/40">
            Manage your website content, team, products, and communications.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono text-white/50">{currentTime}</p>
        </div>
      </div>

      {/* Email Not Configured Warning */}
      {emailConfigured === false && (
        <div className="bg-[#FF7200]/5 border border-[#FF7200]/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF7200]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FF7200]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Email Service Not Configured</p>
              <p className="text-xs text-white/40">Contact form and demo notifications won&apos;t be sent until you set up email.</p>
            </div>
          </div>
          <Link
            href="/admin/email-setup"
            className="px-4 py-2 bg-[#FF7200] hover:bg-[#E66800] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Setup Email
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div
              className={`glass-card p-6 cursor-pointer group bg-gradient-to-br ${card.color} border ${card.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50">{card.label}</span>
                {card.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-500/20 text-blue-300 rounded-full">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className={`text-3xl font-bold ${card.text}`}>
                {card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Communications */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/80">
            Recent Communications
          </h2>
          <Link
            href="/admin/communications"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        {recentComms.length === 0 ? (
          <p className="text-sm text-white/30 py-8 text-center">
            No communications yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentComms.map((comm: any) => (
              <Link
                key={comm.id}
                href={`/admin/communications?id=${comm.id}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  comm.read
                    ? "bg-white/[0.02] border-white/5"
                    : "bg-blue-500/5 border-blue-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      comm.read ? "bg-white/10" : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-white/80">{comm.name}</p>
                    <p className="text-xs text-white/30">{comm.email}</p>
                  </div>
                </div>
                <span className="text-xs text-white/30">
                  {new Date(comm.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminAuth>
  );
}
