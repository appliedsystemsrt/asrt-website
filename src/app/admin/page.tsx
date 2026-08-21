"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/admin/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <LoadingScreen label="Checking session" />;
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="absolute inset-0 tech-grid opacity-10" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 border border-blue-500/30 rounded-2xl flex items-center justify-center bg-white/[0.03]">
            <span className="font-mono text-xl font-bold text-blue-400">AS</span>
          </div>
          <h1 className="text-2xl font-bold text-white/90 mb-2">Admin Panel</h1>
          <p className="text-sm text-white/40 font-mono">
            APPLIED SYSTEMS RESEARCH AND TECHNOLOGY
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.p
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full admin-btn admin-btn-primary py-3 text-base disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  );
}
