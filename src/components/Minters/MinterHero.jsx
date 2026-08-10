// components/MinterHero.jsx
"use client";

import { useState } from "react";
import styles from "@/app/marketplace/specimen-mint/page.module.css";
import HowItWorksModal from "./HowItWorksModal";

export default function MinterHero() {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>SPECIMEN MINTER</p>
      <h1>Mint the next specimen</h1>
      <p className={styles.subtitle}>
        Transparent. Community-driven. No surprises.
      </p>

      <button className={styles.howButton} onClick={() => setOpen(true)}>
        ⓘ How it works
      </button>

      {open && <HowItWorksModal onClose={() => setOpen(false)} />}
    </section>
  );
}