"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SpecimenDisplay.module.css";

// Share of the bar each step fills. Unity only reports its download, which is nearly instant once
// cached, so the bar eases toward the end of the current step while the real step finishes.
const STEPS = {
  opening: { label: "Opening Unity", from: 0, to: 45 },
  catalogue: { label: "Fetching catalogue", from: 45, to: 60 },
  specimen: { label: "Loading specimen", from: 60, to: 99 },
};

const TICK_MS = 120;
const EASING = 0.04; // share of the remaining distance covered each tick

// Covers the whole screen, including Unity's splash, until the specimen is ready.
// active: still loading; step: a key of STEPS; progress: Unity's download progress, 0 to 1;
// failedMessage: replaces the bar when something went wrong
export default function SpecimenLoader({ active, step, progress, failedMessage, onRetry, onBack }) {
  const [percent, setPercent] = useState(0);
  const fullLoad = useRef(false);
  const failed = Boolean(failedMessage);

  // Each load starts the bar again. Changing form only loads a specimen, so it gets the whole bar.
  useEffect(() => {
    if (!active || failed) return;
    fullLoad.current = step !== "specimen";
    setPercent(0);
    // Only when a load begins, not each time it moves to the next step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, failed]);

  useEffect(() => {
    if (!active || failed) return;
    const timer = setInterval(() => {
      setPercent((current) => {
        const from = step === "specimen" && !fullLoad.current ? 0 : STEPS[step].from;
        const to = STEPS[step].to;
        // The download counts for the first part of opening Unity
        const floor = step === "opening" ? to * 0.5 * progress : from;
        const base = Math.max(current, floor);
        return base + (to - base) * EASING;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [active, failed, step, progress]);

  const shown = active ? Math.round(percent) : 100;

  return (
    <div className={`${styles.loader}${active ? "" : " " + styles.loaderDone}`}>
      <button type="button" className={`${styles.backBtn} ${styles.loaderBack}`} onClick={onBack} aria-label="Back to the archive">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <div className={styles.loaderBody}>
        {failed ? (
          <div role="alert">
            <p className={styles.loaderFailed}>{failedMessage}</p>
            <button type="button" className={styles.retryBtn} onClick={onRetry}>Try again</button>
          </div>
        ) : (
          <>
            <div
              className={styles.loaderTrack}
              role="progressbar"
              aria-label="Loading the 3D view"
              aria-valuenow={shown}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={styles.loaderFill} style={{ width: `${shown}%` }} />
            </div>
            <div className={styles.loaderText}>
              <span role="status">{STEPS[step].label}…</span>
              <span className={styles.loaderPercent}>{shown}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
