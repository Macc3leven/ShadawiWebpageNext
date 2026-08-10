"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [step, setStep] = useState(1);        // 1 | 2 | 3
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  function switchMode(next) {
    setMode(next);
    setStep(1);
    setError("");
  }

  // ── OTP input helpers ──────────────────────────────────────
  function handleOtpChange(i, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  }

  // ── Step 1 — send OTP ──────────────────────────────────────
  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2 — verify OTP ───────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp.join("") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3 — create account ───────────────────────────────
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Login ─────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* subtle star-field bg */}
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>SHADAWI</Link>

        {/* Mode tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
        </div>

        {/* Step progress (signup only) */}
        {mode === "signup" && (
          <div className={styles.progress}>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`${styles.dot} ${step >= n ? styles.dotActive : ""}`}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && <p className={styles.error}>{error}</p>}

        {/* ── SIGNUP STEP 1: email ── */}
        {mode === "signup" && step === 1 && (
          <form onSubmit={handleSendOtp} className={styles.form}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button className={styles.cta} type="submit" disabled={loading}>
              {loading ? "Sending…" : "Continue →"}
            </button>
          </form>
        )}

        {/* ── SIGNUP STEP 2: OTP ── */}
        {mode === "signup" && step === 2 && (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <p className={styles.hint}>
              A 6-digit code was sent to<br />
              <strong>{email}</strong>
            </p>
            <div className={styles.otpRow} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className={styles.otpBox}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  disabled={loading}
                />
              ))}
            </div>
            <button className={styles.cta} type="submit" disabled={loading}>
              {loading ? "Verifying…" : "Verify Code"}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => { setStep(1); setOtp(["","","","","",""]); }}
            >
              ← Change email
            </button>
          </form>
        )}

        {/* ── SIGNUP STEP 3: profile ── */}
        {mode === "signup" && step === 3 && (
          <form onSubmit={handleCreateAccount} className={styles.form}>
            <label className={styles.label}>Email</label>
            <input
              className={`${styles.input} ${styles.inputLocked}`}
              type="email"
              value={email}
              disabled
            />

            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <label className={styles.label}>Confirm password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Repeat password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Choose a username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <div className={styles.walletSection}>
              <p className={styles.walletLabel}>Verify a wallet <span>(optional)</span></p>
              <button type="button" className={styles.walletBtn}>
                Connect Wallet
              </button>
            </div>

            <button className={styles.cta} type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create Account"}
            </button>
          </form>
        )}

        {/* ── LOGIN ── */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button className={styles.cta} type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <a href="#" className={styles.ghost}>Forgot password?</a>
          </form>
        )}
      </div>
    </div>
  );
}
