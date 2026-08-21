"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function EmailSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [configuredEmail, setConfiguredEmail] = useState("");
  const [showAppPassword, setShowAppPassword] = useState(false);

  useEffect(() => {
    // Check if already configured
    fetch("/api/email-setup")
      .then((r) => r.json())
      .then((d) => {
        if (d.configured) {
          setConfigured(true);
          setConfiguredEmail(d.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/email-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, appPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to configure email");
        return;
      }

      setSuccess(true);
      setConfigured(true);
      setConfiguredEmail(email);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (configured && !success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white/90 mb-2">
              Email Already Configured
            </h1>
            <p className="text-sm text-white/50">
              Your email is configured with:
            </p>
            <p className="text-sm text-[#FF7200] font-mono mt-1">
              {configuredEmail}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/dashboard"
              className="block w-full py-3 px-4 bg-[#FF7200] hover:bg-[#E66800] text-white font-medium rounded-xl transition-all text-center"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setConfigured(false);
                setSuccess(false);
              }}
              className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all text-center border border-white/10"
            >
              Reconfigure Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white/90 mb-2">
              Email Configured Successfully!
            </h1>
            <p className="text-sm text-white/50">
              Your email service is now active
            </p>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-400">
              ✓ Connection verified
              <br />
              ✓ Credentials saved to database
              <br />✓ Environment variables updated
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="block w-full py-3 px-4 bg-[#FF7200] hover:bg-[#E66800] text-white font-medium rounded-xl transition-all text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full glass-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FF7200]/10 border border-[#FF7200]/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#FF7200]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white/90 mb-2">
            Configure Email Service
          </h1>
          <p className="text-sm text-white/50">
            Set up Gmail SMTP to send notifications
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-white/70 mb-2">
            How to get an App Password:
          </h3>
          <ol className="text-xs text-white/40 space-y-1.5 list-decimal list-inside">
            <li>
              Go to{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF7200] hover:underline"
              >
                Google Account Security
              </a>
            </li>
            <li>Enable 2-Step Verification if not already enabled</li>
            <li>Go to &quot;App passwords&quot; (search in account settings)</li>
            <li>Select &quot;Mail&quot; and your device</li>
            <li>Copy the 16-character password</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Gmail Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@gmail.com"
              required
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#FF7200]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              App Password
            </label>
            <div className="relative">
              <input
                type={showAppPassword ? "text" : "password"}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                required
                autoComplete="new-password"
                className="w-full px-4 pr-12 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#FF7200]/50 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowAppPassword((visible) => !visible)}
                aria-label={showAppPassword ? "Hide app password" : "Show app password"}
                title={showAppPassword ? "Hide app password" : "Show app password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showAppPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              16-character password from Google (spaces are OK)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !appPassword}
            className="w-full py-3 px-4 bg-[#FF7200] hover:bg-[#E66800] disabled:bg-[#FF7200]/30 disabled:text-white/30 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                Authenticate & Save
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/admin/dashboard"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
