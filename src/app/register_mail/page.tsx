"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type View = "choose" | "manual" | "google" | "success" | "registered";

export default function RegisterMailPage() {
  const [view, setView] = useState<View>("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminInfo, setAdminInfo] = useState<{ name: string; email: string } | null>(null);

  // Manual form
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Google form
  const [googleForm, setGoogleForm] = useState({
    name: "",
    email: "",
  });

  // Check if admin already registered
  useEffect(() => {
    fetch("/api/register")
      .then((r) => r.json())
      .then((d) => {
        if (d.registered) {
          setAdminInfo(d.admin);
          setView("registered");
        }
      })
      .catch(() => {});
  }, []);

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (manualForm.password !== manualForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (manualForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: manualForm.name,
          email: manualForm.email,
          password: manualForm.password,
          authMethod: "manual",
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAdminInfo(data.admin);
        setView("success");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!googleForm.name || !googleForm.email) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: googleForm.name,
          email: googleForm.email,
          password: "",
          authMethod: "google",
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAdminInfo(data.admin);
        setView("success");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Already registered view
  if (view === "registered") {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 border border-blue-500/30 rounded-2xl flex items-center justify-center bg-white/[0.03]">
              <span className="font-mono text-xl font-bold text-blue-400">AS</span>
            </div>
            <h1 className="text-2xl font-bold text-white/90 mb-2">Already Registered</h1>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-semibold text-white/80 mb-2">Admin Account Exists</h2>
            <p className="text-sm text-white/40 mb-4">
              An admin account is already registered.
            </p>
            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-6">
              <p className="text-xs text-white/30 mb-1">Registered Admin</p>
              <p className="text-sm text-white/70 font-medium">{adminInfo?.name}</p>
              <p className="text-sm text-blue-400/70">{adminInfo?.email}</p>
            </div>
            <a
              href="/admin"
              className="inline-block px-6 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
            >
              Go to Admin Panel
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success view
  if (view === "success") {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 border border-blue-500/30 rounded-2xl flex items-center justify-center bg-white/[0.03]">
              <span className="font-mono text-xl font-bold text-blue-400">AS</span>
            </div>
          </div>
          <div className="glass-card p-8 text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✓
              </motion.span>
            </motion.div>

            <h2 className="text-2xl font-bold text-white/90 mb-2">Welcome, {adminInfo?.name}!</h2>
            <p className="text-sm text-emerald-400 font-mono tracking-wider mb-4">ACCESS GRANTED</p>
            <p className="text-sm text-white/40 mb-2">
              Admin account registered successfully.
            </p>
            <p className="text-sm text-white/40 mb-6">
              A welcome email has been sent to <span className="text-blue-400">{adminInfo?.email}</span>
            </p>

            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-white/30 mb-3 font-mono tracking-wider uppercase">What happens now</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <p className="text-xs text-white/50">Contact form submissions will be emailed to you</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <p className="text-xs text-white/50">Demo requests will be emailed to you</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <p className="text-xs text-white/50">Users receive confirmation emails automatically</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <a
                href="/admin"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
              >
                Go to Admin Panel
              </a>
              <a
                href="/"
                className="px-6 py-2 text-sm text-white/50 border border-white/10 hover:border-white/20 rounded-lg transition-all"
              >
                View Website
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main registration view
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
          <h1 className="text-2xl font-bold text-white/90 mb-2">Admin Registration</h1>
          <p className="text-sm text-white/40 font-mono">
            TESTING ENVIRONMENT
          </p>
          <p className="text-xs text-white/25 mt-2">
            Register as admin to receive website notifications via email
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Choose method */}
          {view === "choose" && (
            <motion.div
              key="choose"
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button
                onClick={() => setView("google")}
                className="w-full glass-card p-5 flex items-center gap-4 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white/80 group-hover:text-white/90">Sign up with Google</p>
                  <p className="text-xs text-white/30">Use your Google account for quick registration</p>
                </div>
                <span className="ml-auto text-white/20 group-hover:text-white/40 transition-colors">→</span>
              </button>

              <button
                onClick={() => setView("manual")}
                className="w-full glass-card p-5 flex items-center gap-4 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white/80 group-hover:text-white/90">Register manually</p>
                  <p className="text-xs text-white/30">Create account with email and password</p>
                </div>
                <span className="ml-auto text-white/20 group-hover:text-white/40 transition-colors">→</span>
              </button>
            </motion.div>
          )}

          {/* Google registration */}
          {view === "google" && (
            <motion.div
              key="google"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass-card p-6">
                <button
                  onClick={() => { setView("choose"); setError(""); }}
                  className="text-xs text-white/30 hover:text-white/50 mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h3 className="text-lg font-semibold text-white/80 mb-1">Google Registration</h3>
                <p className="text-xs text-white/30 mb-5">
                  Enter your Google account details below. In production, this would use Google OAuth.
                </p>

                <form onSubmit={handleGoogleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={googleForm.name}
                      onChange={(e) => setGoogleForm({ ...googleForm, name: e.target.value })}
                      className="admin-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Google Email</label>
                    <input
                      type="email"
                      value={googleForm.email}
                      onChange={(e) => setGoogleForm({ ...googleForm, email: e.target.value })}
                      className="admin-input"
                      placeholder="you@gmail.com"
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
                    className="w-full admin-btn admin-btn-primary py-3 disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Register as Admin"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Manual registration */}
          {view === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass-card p-6">
                <button
                  onClick={() => { setView("choose"); setError(""); }}
                  className="text-xs text-white/30 hover:text-white/50 mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h3 className="text-lg font-semibold text-white/80 mb-1">Manual Registration</h3>
                <p className="text-xs text-white/30 mb-5">
                  Create an admin account with email and password.
                </p>

                <form onSubmit={handleManualRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={manualForm.name}
                      onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                      className="admin-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Email</label>
                    <input
                      type="email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                      className="admin-input"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Password</label>
                    <input
                      type="password"
                      value={manualForm.password}
                      onChange={(e) => setManualForm({ ...manualForm, password: e.target.value })}
                      className="admin-input"
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={manualForm.confirmPassword}
                      onChange={(e) => setManualForm({ ...manualForm, confirmPassword: e.target.value })}
                      className="admin-input"
                      placeholder="Repeat password"
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
                    className="w-full admin-btn admin-btn-primary py-3 disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Register as Admin"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-white/15 mt-6">
          Applied Systems Research & Technology — Testing Environment
        </p>
      </motion.div>
    </div>
  );
}
