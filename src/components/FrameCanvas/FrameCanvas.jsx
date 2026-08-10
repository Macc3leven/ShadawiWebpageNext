// src/components/FrameCanvas/FrameCanvas.jsx
// ---------------------------------------------------------------
// FRAME CANVAS COMPONENT
//
// 🧠 REACT LESSON: useRef for DOM access
// React generally hides the DOM from you. But sometimes you NEED
// a direct reference — for example, to a <canvas> element so you
// can call .getContext("2d") on it.
//
// The pattern:
//   1. const ref = useRef(null);
//   2. <canvas ref={ref} />
//   3. Inside useEffect (after mount), ref.current is the DOM node.
//
// This component is intentionally tiny: just a <canvas> with the
// hook attached. All the logic lives in useScrollFrames.
// ---------------------------------------------------------------

"use client";

import { useRef } from "react";
import useScrollFrames from "@/hooks/useScrollFrames";
import styles from "./FrameCanvas.module.css";

export default function FrameCanvas() {
  const canvasRef = useRef(null);

  // 🧠 Just call the hook with the ref. All the magic happens inside.
  useScrollFrames(canvasRef);

  return <canvas ref={canvasRef} className={styles.bgCanvas} />;
}
