"use client";

import styles from "@/app/shop/specimen-mint/page.module.css";

export default function MinterHero() {
  // Opens the How It Works panel (collapsible on mobile) and scrolls to it
  function showHowItWorks() {
    const panel = document.getElementById("how-it-works");
    if (!panel) return;
    panel.open = true;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>Specimen mint</p>
      <h1 className={styles.title}>
        Mint the<br /><span>next specimen</span>
      </h1>
      <p className={styles.subtitle}>
        Get the next specimen in the queue.<br />
        Your mint adds a new one to the end.
      </p>

      <button className={styles.howButton} onClick={showHowItWorks}>
        <span className={styles.playIcon} aria-hidden="true" />
        How it works
      </button>
    </div>
  );
}
