"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import styles from "./page.module.css";

export default function DashboardClient() {
  const router = useRouter();
  const { status, account, signOut } = useAuth();
  const signingOut = useRef(false); // a deliberate sign-out goes home, not to the sign-in page

  // Signed out → sign-in page. Signed in without a Mage name → finish that step first.
  useEffect(() => {
    if (signingOut.current) return;
    if (status === "signedOut") router.replace("/signup");
    if (status === "signedIn" && !account.username) router.replace("/signup");
  }, [status, account, router]);

  if (status !== "signedIn" || !account.username) {
    return <p className={styles.loading}>Loading your Mage…</p>;
  }

  const handleSignOut = async () => {
    signingOut.current = true;
    await signOut();
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.characterWrap}>
        <Image
          src="/images/frames/0001.png"
          alt="Your Shadawi specimen"
          width={340}
          height={340}
          className={styles.character}
          priority
        />
        <span className={styles.characterBadge}>DEFAULT SPECIMEN</span>
      </div>

      <div className={styles.info}>
        <p className={styles.greeting}>WELCOME, MAGE</p>
        <h1 className={styles.name}>{account.username}</h1>
        <p className={styles.sub}>Your profile is ready. The realms await.</p>
        <p className={styles.email}>{account.email}</p>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: "SPECIMEN", value: "0" },
          { label: "BATTLES", value: "0" },
          { label: "RANK", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <p className={styles.comingSoon}>Full dashboard coming soon.</p>

      <button type="button" className={styles.signOut} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
