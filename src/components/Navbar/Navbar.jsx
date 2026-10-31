"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

// Swap for real auth context when auth is wired up
const isLoggedIn = false;

const NAV_LINKS = [
  { label: "Universe", href: "/universe" },
  { label: "Specimen", href: "/specimen" },
  { label: "Games", href: "/games/shadawi-striker" }, // only one game for now — skip the hub
  { label: "Shop", href: "/shop" },
  { label: isLoggedIn ? "Dashboard" : "Sign Up", href: isLoggedIn ? "/dashboard" : "/signup" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>SHADAWI</Link>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${href === "/signup" || href === "/dashboard" ? styles.cta : ""} ${pathname === href ? styles.active : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Mobile: big pill on the homepage, slim logo + corner button everywhere else ── */}
      {pathname === "/" ? (
        <button
          className={styles.pill}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      ) : (
        <div className={styles.mobileBar}>
          <Link href="/" className={styles.logo}>SHADAWI</Link>
          <button
            className={styles.cornerBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      )}

      {/* ── Fullscreen mobile modal ── */}
      {menuOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <Link href="/" className={styles.homeBtn} onClick={() => setMenuOpen(false)} aria-label="Home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </Link>

          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <nav className={styles.modalNav}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`${styles.modalLink} ${pathname === href ? styles.modalActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
