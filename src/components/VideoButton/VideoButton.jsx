"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./VideoButton.module.css";

// Pulls the video ID out of any common YouTube URL:
// youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const match = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}

// "▶ Watch the video" button that opens a YouTube video in a fullscreen modal.
// No autoplay on purpose: YouTube only counts embedded plays as views when the
// viewer presses the player's own play button. Closing the modal stops playback.
export default function VideoButton({ url, poster, label = "Watch the video", title }) {
  const [open, setOpen] = useState(false);
  const videoId = getYouTubeId(url);

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.play} aria-hidden="true" />
        {label}
      </button>

      {/* Portal to <body> so the section's stacking context can't sit on top of it */}
      {open && createPortal(
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title || label} onClick={() => setOpen(false)}>
          <div className={styles.player} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close video">✕</button>
            {videoId ? (
              <iframe
                className={styles.video}
                // youtube-nocookie = YouTube's privacy-enhanced mode (no cookies until play)
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title || "YouTube video"}
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className={styles.fallback} style={poster ? { backgroundImage: `url(${poster})` } : undefined}>
                <p>Video coming soon.</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
