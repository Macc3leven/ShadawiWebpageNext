"use client";

import { useState } from "react";
import Link from "next/link";
import PortalCanvas from "@/components/PortalCanvas/PortalCanvas";
import styles from "./UniverseArticle.module.css";

export default function UniverseArticle({ title, pages, imageSrc }) {
  const [page, setPage] = useState(0);
  const total = pages.length;

  return (
    <div className={styles.article}>
      <PortalCanvas />

      {/* ── Image zone ── */}
      <div className={styles.imageZone}>
        <nav className={styles.breadcrumb}>
          <Link href="/universe" className={styles.crumbLink}>Universe</Link>
          <span className={styles.crumbSep}>›</span>
          <span className={styles.crumbCurrent}>{title}</span>
        </nav>

        {imageSrc && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageSrc} alt={title} className={styles.heroImage} />
        )}

        {/* Fade transition into content */}
        <div className={styles.imageGradient} aria-hidden="true" />
      </div>

      {/* ── Content zone ── */}
      <div className={styles.contentZone}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.divider} />

          <div className={styles.body}>
            {pages[page].map((para, i) => (
              <p key={i} className={styles.para}>{para}</p>
            ))}
          </div>

          {/* ── Pagination ── */}
          {total > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className={styles.pageInfo}>
                Page {page + 1} of {total}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p + 1)}
                disabled={page === total - 1}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
