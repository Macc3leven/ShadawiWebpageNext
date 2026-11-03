"use client";

// One passwordless flow for new and returning Mages:
// email → 6-digit code → (first time only) pick a portrait and Mage name → dashboard.
// "Continue with Google" skips straight past the code step.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/userApi";
import { useAuth } from "@/providers/AuthProvider";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import styles from "./page.module.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const RESEND_SECONDS = 60;
const EMPTY_CODE = ["", "", "", "", "", ""];

export default function SignInPage() {
  const router = useRouter();
  const auth = useAuth();

  const [step, setStep] = useState("email"); // "email" | "code" | "username"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(EMPTY_CODE);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);
  const googleButtonRef = useRef(null);

  // Already signed in? Finish the name step or go to the dashboard.
  useEffect(() => {
    if (auth.status !== "signedIn") return;
    if (auth.account.username) router.replace("/dashboard");
    else setStep("username");
  }, [auth.status, auth.account, router]);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const run = async (fn) => {
    setLoading(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
      if (err.details?.retryAfter) setResendIn(err.details.retryAfter);
    } finally {
      setLoading(false);
    }
  };

  // Shared ending for email-code and Google sign-in
  const completeSignIn = useCallback((data) => {
    auth.signedIn(data.account);
    if (data.needsUsername) setStep("username");
    else router.push("/dashboard");
  }, [auth, router]);

  // ── Email ──
  const sendCode = (e) => {
    e?.preventDefault();
    run(async () => {
      await userApi.startEmail(email);
      setOtp(EMPTY_CODE);
      setStep("code");
      setResendIn(RESEND_SECONDS);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    });
  };

  // ── Code ──
  const verifyCode = (digits) => run(async () => {
    try {
      completeSignIn(await userApi.verifyEmail(email, digits.join("")));
    } catch (err) {
      setOtp(EMPTY_CODE);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      throw err;
    }
  });

  function handleOtpChange(i, value) {
    let digits = value.replace(/\D/g, "");
    const next = [...otp];
    if (!digits) {
      next[i] = "";
      setOtp(next);
      return;
    }
    // Typing over a filled box replaces it
    if (otp[i] && digits.length === 2 && digits.includes(otp[i])) digits = digits.replace(otp[i], "");
    // Autofill (phones fill "one-time-code" into the first box) or fast typing can bring several
    // digits at once — spread them across the boxes
    for (let k = 0; k < digits.length && i + k < 6; k++) next[i + k] = digits[k];
    setOtp(next);
    otpRefs.current[Math.min(i + digits.length, 5)]?.focus();
    if (next.every(Boolean)) verifyCode(next); // auto-submit once all 6 are in
  }

  function handleOtpKey(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function handleOtpPaste(e) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    e.preventDefault();
    if (digits.length === 6) {
      const next = digits.split("");
      setOtp(next);
      otpRefs.current[5]?.focus();
      verifyCode(next);
    }
  }

  // ── Username ──
  const saveUsername = (e) => {
    e.preventDefault();
    run(async () => {
      const data = await userApi.setUsername(username, avatar);
      auth.signedIn(data.account);
      router.push("/dashboard");
    });
  };

  // ── Google (Google Identity Services: popup / One Tap, never leaves the page) ──
  const initGoogle = useCallback(() => {
    if (!window.google || !googleButtonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: ({ credential }) => run(async () => completeSignIn(await userApi.google(credential))),
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "filled_black",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 320,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeSignIn]);

  // Re-render the button when coming back to the email step
  useEffect(() => {
    if (step === "email" && GOOGLE_CLIENT_ID && window.google) initGoogle();
  }, [step, initGoogle]);

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />
      {GOOGLE_CLIENT_ID && (
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initGoogle} />
      )}

      <div className={styles.card}>
        <Link href="/" className={styles.logo}>SHADAWI</Link>

        <div className={styles.progress}>
          {["email", "code", "username"].map((s, i) => (
            <span key={s} className={`${styles.dot} ${["email", "code", "username"].indexOf(step) >= i ? styles.dotActive : ""}`} />
          ))}
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        {/* ── Step 1: email ── */}
        {step === "email" && (
          <>
            <div className={styles.heading}>
              <h1 className={styles.title}>Enter the realms</h1>
              <p className={styles.hint}>Sign in or create your Mage. No password needed.</p>
            </div>

            <form onSubmit={sendCode} className={styles.form}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                autoComplete="email"
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

            {GOOGLE_CLIENT_ID && (
              <>
                <div className={styles.divider}><span>or</span></div>
                <div ref={googleButtonRef} className={styles.googleButton} />
              </>
            )}
          </>
        )}

        {/* ── Step 2: code ── */}
        {step === "code" && (
          <form onSubmit={(e) => { e.preventDefault(); verifyCode(otp); }} className={styles.form}>
            <p className={styles.hint}>
              We sent a 6-digit code to<br />
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
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1}`}
                  maxLength={6} /* lets autofill drop the whole code in; handleOtpChange spreads it */
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  disabled={loading}
                />
              ))}
            </div>
            <button className={styles.cta} type="submit" disabled={loading || !otp.every(Boolean)}>
              {loading ? "Verifying…" : "Verify code"}
            </button>
            <button type="button" className={styles.ghost} onClick={() => sendCode()} disabled={loading || resendIn > 0}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
            <button type="button" className={styles.ghost} onClick={() => { setStep("email"); setError(""); }}>
              ← Use a different email
            </button>
          </form>
        )}

        {/* ── Step 3: Mage name (first sign-in only) ── */}
        {step === "username" && (
          <form onSubmit={saveUsername} className={styles.form}>
            <div className={styles.heading}>
              <h1 className={styles.title}>Create your Mage</h1>
              <p className={styles.hint}>Choose a portrait and a name. This is how other Mages will see you.</p>
            </div>
            <AvatarPicker value={avatar} onChange={setAvatar} disabled={loading} />
            <label className={styles.label} htmlFor="username">Mage name</label>
            <input
              id="username"
              className={styles.input}
              type="text"
              autoComplete="username"
              placeholder="e.g. Storm_Walker"
              title="3–20 letters, numbers or underscores"
              required
              minLength={3}
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <button className={styles.cta} type="submit" disabled={loading}>
              {loading ? "Saving…" : "Enter Shadawi →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
