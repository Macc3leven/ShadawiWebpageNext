"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/marketplace/specimen-mint/page.module.css";
import WalletButton from "@/components/WalletButton/WalletButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Specimen Minter", href: "/marketplace/specimen-mint" },
  { label: "Gem Minter", href: "/marketplace/gem-mint" },
  { label: "Opensea", href: "https://opensea.io", external: true },
];

export default function MinterHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>♦</span>
          <span>SHADAWI</span>
        </div>

        <div className={styles.headerActions}>
          <WalletButton />
          <button className={styles.avatar} aria-label="User profile" />
          <button
            className={styles.menu}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.navModal} role="dialog" aria-modal="true">
          <Link
            href="/"
            className={styles.navModalHome}
            onClick={() => setMenuOpen(false)}
            aria-label="Home"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </Link>

          <button
            className={styles.navModalClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <nav className={styles.navModalNav}>
            {NAV_LINKS.map(({ label, href, external }) => (
              <Link
                key={href}
                href={href}
                className={`${styles.navModalLink} ${pathname === href ? styles.navModalActive : ""}`}
                onClick={() => setMenuOpen(false)}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
