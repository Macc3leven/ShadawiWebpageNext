// src/sections/Connect/Connect.jsx
// ---------------------------------------------------------------
// CONNECT SECTION (footer)
//
// 🧠 REACT LESSON: Data-driven rendering
// In your old code, you wrote 4 nearly-identical <a> tags for the
// social icons. In React, we put the data in an array and .map()
// over it. Adding a 5th social link becomes a one-line change.
//
// 🧠 NEXT.JS LESSON: <Image> component
// Next.js ships an optimized <Image> component that handles
// lazy-loading, srcsets, and modern formats automatically. For SVGs
// we don't need optimization, so a plain <img> is fine.
// ---------------------------------------------------------------

import shared from "@/sections/sections.module.css";
import styles from "./Connect.module.css";

const SOCIAL_LINKS = [
  { href: "https://x.com/WorldOfShadawi", icon: "/images/x-logo.svg", alt: "X" },
  { href: "https://www.instagram.com/worldofshadawi/", icon: "/images/instagram-logo.svg", alt: "Instagram" },
  { href: "https://www.tiktok.com/@worldofshadawi", icon: "/images/tiktok-logo.svg", alt: "TikTok" },
  { href: "https://www.youtube.com/@WorldOfShadawi", icon: "/images/youtube-logo.svg", alt: "YouTube" },
];

export default function Connect() {
  return (
    <section className={styles.footer}>
      <div className={styles.fourthContent}>
        <h2 className={`${shared.title} ${styles.footerTitle}`}>
          CONNECT<br />ACROSS THE<br />REALMS
        </h2>
        <p className={shared.subtitle}>
          FOLLOW US ON OUR SOCIAL MEDIA — EMAIL AUTHENTICATION
          <br />
          REQUIRED FOR DISCORD.
        </p>

        <div className={styles.socialIcons}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={link.icon} alt={link.alt} />
            </a>
          ))}
        </div>

        <div className={styles.termsContainer}>
          <a href="#">TERMS OF SERVICE</a>
          <span className={styles.divider}>|</span>
          <a href="#">PRIVACY POLICY</a>
        </div>
      </div>
    </section>
  );
}
