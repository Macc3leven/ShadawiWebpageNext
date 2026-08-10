// src/hooks/useScrollFrames.js
// ---------------------------------------------------------------
// CUSTOM HOOK: useScrollFrames
//
// 🧠 REACT LESSON: What's a custom hook?
// A "hook" is any function whose name starts with `use` and which
// uses other hooks (useState, useEffect, useRef) internally.
// Custom hooks are how you EXTRACT REUSABLE LOGIC out of components.
//
// Your old frameScroller.js mixed two concerns:
//   1. Loading + drawing frames based on scroll position (LOGIC)
//   2. The <canvas> element itself (UI)
//
// This hook holds the logic. The FrameCanvas component holds the UI.
// Now any component can drop in a scroll-synced canvas just by calling
// this hook — clean separation of concerns.
//
// 🧠 REACT LESSON: useEffect — the React way to do "side effects"
// A "side effect" is anything that touches the outside world:
// adding event listeners, fetching data, drawing to canvas, timers.
//
// useEffect(() => { ... setup ... ; return () => { ... cleanup ... } }, [deps])
//
//   - Setup runs after the component mounts.
//   - The returned cleanup function runs when the component unmounts
//     OR before the effect re-runs (if a dep changed).
//   - The deps array controls when it re-runs. [] = only on mount.
//
// Cleanup is CRITICAL. Your old code added a scroll listener but
// never removed it. In React, components mount and unmount all the
// time — if you don't clean up, you'll have stacked listeners and
// memory leaks. This hook handles cleanup properly.
//
// 🧠 PERFORMANCE LESSON: requestAnimationFrame
// Your old scroll handler ran on every scroll event (60+/sec) and
// did heavy work each time. That can stutter. The fix: when scroll
// fires, just remember "I need to update" and let the browser tell
// us when it's ready to paint via requestAnimationFrame. Result: at
// most one update per frame, perfectly smooth.
// ---------------------------------------------------------------

import { useEffect, useRef } from "react";

// Default config — callers can override any of these.
const DEFAULTS = {
  framePath: "/images/frames/",
  frameName: (index) => `${index.toString().padStart(4, "0")}.png`,
  totalFrames: 96,
  preloadBatch: 32,
  smartBuffer: 8,
  fixedWidth: 1920,
  fixedHeight: 1080,
};

export default function useScrollFrames(canvasRef, options = {}) {
  const config = { ...DEFAULTS, ...options };

  // 🧠 useRef gives us a "box" that persists across renders WITHOUT
  // triggering re-renders when we change its .current value. Perfect
  // for things React doesn't need to know about: image caches,
  // animation frame IDs, "is something currently in flight?" flags.
  const loadedImagesRef = useRef({});
  const loadingQueueRef = useRef(new Set());
  const currentFrameRef = useRef(1);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // safety check — canvas might not be ready yet

    const ctx = canvas.getContext("2d");
    canvas.width = config.fixedWidth;
    canvas.height = config.fixedHeight;

    // Placeholder while frames load
    ctx.fillStyle = "#999";
    ctx.font = "24px sans-serif";
    ctx.fillText("Loading frames...", 20, 40);

    // ----- internal helpers -----

    function drawFrame(index) {
      const img = loadedImagesRef.current[index];
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentFrameRef.current = index;
    }

    function preloadBatch(start, end) {
      for (let i = start; i <= end && i <= config.totalFrames; i++) {
        if (loadedImagesRef.current[i] || loadingQueueRef.current.has(i)) {
          continue;
        }
        const img = new Image();
        img.src = `${config.framePath}${config.frameName(i)}`;
        loadingQueueRef.current.add(i);

        img.onload = () => {
          loadedImagesRef.current[i] = img;
          loadingQueueRef.current.delete(i);
          if (i === 1) drawFrame(1); // show first frame ASAP
        };
        img.onerror = () => {
          console.warn(`⚠️ Failed to load ${img.src}`);
          loadingQueueRef.current.delete(i);
        };
      }
    }

    function scrollToFrameIndex() {
      const scrollTop = document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      return Math.max(1, Math.ceil(progress * config.totalFrames));
    }

    function smartPreload(index) {
      const rangeStart = Math.max(1, index - config.smartBuffer);
      const rangeEnd = Math.min(config.totalFrames, index + config.smartBuffer);
      preloadBatch(rangeStart, rangeEnd);
    }

    // 🧠 The rAF-throttled scroll handler. We don't do the work
    // inside the scroll listener — we just schedule it for the next
    // animation frame. If scroll fires 10 times before the next
    // frame, we only do the work once.
    function handleScroll() {
      if (rafIdRef.current !== null) return; // already scheduled
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const newIndex = scrollToFrameIndex();
        if (newIndex !== currentFrameRef.current) {
          drawFrame(newIndex);
          smartPreload(newIndex);
        }
      });
    }

    function resizeCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const keepRatio = config.fixedWidth / config.fixedHeight;

      let newWidth, newHeight;
      if (w > h) {
        newWidth = h * keepRatio;
        newHeight = h;
        if (newWidth < w) {
          newHeight = w / keepRatio;
          newWidth = w;
        }
      } else {
        newHeight = h;
        newWidth = h * keepRatio;
      }
      canvas.style.height = newHeight + "px";
      canvas.style.width = newWidth + "px";
      drawFrame(currentFrameRef.current);
    }

    // ----- setup -----
    preloadBatch(1, config.preloadBatch);
    resizeCanvas();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    // ----- CLEANUP (runs when component unmounts) -----
    // 🧠 This is the part your old code was missing. Without this,
    // navigating away and coming back would stack listeners forever.
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
    // 🧠 The dependency array. We're disabling the lint rule here
    // because `config` is recreated every render but we intentionally
    // only want this effect to run once on mount. In a fancier version
    // you'd memoize config with useMemo, but this is fine for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
