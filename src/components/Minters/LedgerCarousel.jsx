"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/marketplace/specimen-mint/page.module.css";
import SpecimenCard from "./SpecimenCard";

// Desktop shows all 10 in a row. Narrower screens scroll the track
// horizontally; arrows and dots page through it.
export default function LedgerCarousel({ specimens }) {
  const trackRef = useRef(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function measure() {
      const count = Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
      setPages(count);
      setPage(Math.min(count - 1, Math.round(track.scrollLeft / track.clientWidth)));
    }

    measure();
    track.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      track.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  function goTo(index) {
    const track = trackRef.current;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  return (
    <section className={`${styles.panel} ${styles.queue}`}>
      <header className={styles.queueHeader}>
        <div>
          <h2 className={styles.panelTitle}>Next in queue</h2>
          <p className={styles.panelSub}>The next {specimens.length} specimens available for minting.</p>
        </div>
        <span className={`${styles.queueTag} ${styles.desktopOnly}`}>› Rotating ledger</span>
        <span className={`${styles.queueTag} ${styles.mobileOnly}`}>{specimens.length} total</span>
      </header>

      <div ref={trackRef} className={styles.track}>
        {specimens.map((specimen, index) => (
          <SpecimenCard key={specimen.id} specimen={specimen} position={index + 1} />
        ))}
      </div>

      {pages > 1 && (
        <div className={styles.pager}>
          <button
            className={styles.pagerArrow}
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous specimens"
          >
            ‹
          </button>
          <div className={styles.dots}>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
          <button
            className={styles.pagerArrow}
            onClick={() => goTo(page + 1)}
            disabled={page === pages - 1}
            aria-label="Next specimens"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
