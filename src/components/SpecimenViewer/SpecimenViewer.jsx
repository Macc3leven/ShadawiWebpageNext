"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { unityViewer } from "@/lib/unityViewer";
import styles from "./SpecimenViewer.module.css";

// The display maps in the Unity project's Environments Addressables group. The content server
// doesn't list these yet, so a new map has to be added here too.
const MAPS = [
  { address: "", label: "Base stage" },
  { address: "Environment/Display/SkullCorridor", label: "Skull Corridor" },
  { address: "Environment/Display/CloudRealm", label: "Cloud Realm" },
  { address: "Environment/Display/SciFiRoom", label: "Sci-Fi Room" },
];

export function useUnityViewer() {
  return useSyncExternalStore(unityViewer.subscribe, unityViewer.getState, unityViewer.getServerState);
}

// "domigra_abilitySlot2_sword-dance" -> "Sword Dance", "humanoid_death01" -> "Death 01"
function actionLabel(id) {
  const last = String(id).split("_").filter(Boolean).pop() ?? String(id);
  return last
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/(\D)(\d+)$/, "$1 $2");
}

// Full-screen 3D view of a specimen. The canvas stays mounted while the page is open, because
// Unity keeps drawing to it across openings; only the controls come and go with `open`.
// title/subtitle: what's being shown; address: its Unity address; formControl and details: page-owned UI
export default function SpecimenViewer({ open, title, subtitle, address, formControl, details, onClose }) {
  const viewer = useUnityViewer();
  const canvasHostRef = useRef(null);
  const actionsRef = useRef(null);
  const panelRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // The canvas lives as long as this page does. Leaving the page ends Unity.
  useEffect(() => {
    unityViewer.attach(canvasHostRef.current, styles.canvas);
    return () => unityViewer.shutdown();
  }, []);

  useEffect(() => {
    if (open) {
      unityViewer.show();
      unityViewer.preload(address);
    } else {
      unityViewer.hide();
    }
  }, [open, address]);

  // Tell Unity how much of the screen the controls cover, so it frames the specimen above them.
  // On wider screens the panel sits beside the specimen, so only the action bar counts.
  useEffect(() => {
    if (!open) return;
    let timer = 0;
    const measure = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const narrow = window.matchMedia("(max-width: 767px)").matches;
        const covering = [actionsRef.current, narrow ? panelRef.current : null].filter(Boolean);
        if (!covering.length) return;
        const top = Math.min(...covering.map((element) => element.getBoundingClientRect().top));
        unityViewer.setBottomInset((window.innerHeight - top) / window.innerHeight);
      }, 200);
    };
    measure();
    const observer = new ResizeObserver(measure);
    [actionsRef.current, panelRef.current].filter(Boolean).forEach((element) => observer.observe(element));
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, panelOpen, viewer.specimen.status]);

  const specimenReady = viewer.specimen.address === address && viewer.specimen.status === "loaded";
  const failed = viewer.status === "error" || (viewer.specimen.address === address && viewer.specimen.status === "failed");
  const percent = Math.round(viewer.progress * 100);

  return (
    <div className={`${styles.stage}${open ? " " + styles.stageOpen : ""}`} aria-hidden={!open}>
      <div ref={canvasHostRef} className={styles.canvasHost} />

      {open && (
        <div className={styles.controls}>
          <div className={styles.topBar}>
            <button type="button" className={styles.backBtn} onClick={onClose}>
              <span aria-hidden="true">←</span> Back
            </button>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>{title}</h2>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {formControl && <div className={styles.formSlot}>{formControl}</div>}
          </div>

          {!specimenReady && (
            <div className={styles.veil} role="status">
              {failed ? (
                <>
                  <p className={styles.veilText}>
                    {viewer.status === "error" ? "The 3D viewer couldn't start." : `${title} couldn't be loaded.`}
                  </p>
                  <button type="button" className={styles.retryBtn} onClick={() => unityViewer.retry()}>Try again</button>
                </>
              ) : (
                <>
                  <p className={styles.veilText}>
                    {viewer.status === "ready" ? `Loading ${title}…` : "Starting the 3D viewer…"}
                  </p>
                  {viewer.status !== "ready" && (
                    <div className={styles.progress} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                      <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {specimenReady && (
            <div ref={actionsRef} className={`${styles.actionBar}${panelOpen ? " " + styles.actionBarRaised : ""}`}>
              <label className={styles.mapPicker}>
                <span className={styles.srOnly}>Map</span>
                <select
                  className={styles.mapSelect}
                  value={viewer.map.address}
                  disabled={viewer.map.status === "loading"}
                  onChange={(e) => unityViewer.setMap(e.target.value)}
                >
                  {MAPS.map((map) => (
                    <option key={map.address} value={map.address}>{map.label}</option>
                  ))}
                </select>
              </label>
              <div className={styles.actions} role="group" aria-label="Actions">
                {viewer.actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className={`${styles.actionBtn}${viewer.playingId === action.id ? " " + styles.actionActive : ""}`}
                    aria-pressed={viewer.playingId === action.id}
                    disabled={!action.allowed}
                    title={action.allowed ? action.id : `${action.id} (blocked in display mode)`}
                    onClick={() => unityViewer.playAction(action.id)}
                  >
                    <span>{actionLabel(action.id)}</span>
                    <span className={styles.actionType}>{action.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* A column beside the view on wider screens, a sheet that slides up on phones */}
          <aside ref={panelRef} className={`${styles.panel}${panelOpen ? " " + styles.panelOpen : ""}`} aria-label="Specimen details">
            <button
              type="button"
              className={styles.sheetHandle}
              aria-expanded={panelOpen}
              onClick={() => setPanelOpen((isOpen) => !isOpen)}
            >
              <span className={styles.sheetGrip} aria-hidden="true" />
              Details
            </button>
            <div className={styles.panelBody}>{details}</div>
          </aside>
        </div>
      )}
    </div>
  );
}
