"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { unityViewer } from "@/lib/unityViewer";
import { formStageName, specimenFormTitle } from "@/lib/specimenForms";
import { AbilitiesPanel, ControlPanel, MetricsPanel, OverviewPanel } from "./SpecimenPanels";
import SpecimenLoader from "./SpecimenLoader";
import styles from "./SpecimenDisplay.module.css";

function useUnityViewer() {
  return useSyncExternalStore(unityViewer.subscribe, unityViewer.getState, unityViewer.getServerState);
}

function Icon({ size = 22, children }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const PANELS = [
  { id: "overview", label: "Overview", icon: <path d="M4 7h16M4 12h16M4 17h10" /> },
  {
    id: "control",
    label: "Control",
    icon: (
      <>
        <path d="M7 7h10a5 5 0 0 1 4.9 6l-.6 3a2.8 2.8 0 0 1-5 1.1L15 16H9l-1.3 1.1a2.8 2.8 0 0 1-5-1.1l-.6-3A5 5 0 0 1 7 7z" />
        <path d="M8 10v3M6.5 11.5h3M15.5 10.5h.01M17.5 12.5h.01" />
      </>
    ),
  },
  {
    id: "metrics",
    label: "Metrics",
    icon: (
      <>
        <path d="M7 4v4M7 15v5M17 3v3M17 14v7" />
        <rect x="5" y="8" width="4" height="7" rx="1" />
        <rect x="15" y="6" width="4" height="8" rx="1" />
      </>
    ),
  },
  { id: "abilities", label: "Abilities", icon: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" /> },
];

// A specimen's full-screen view: the 3D model, with its details in four panels that keep it visible.
// The canvas stays mounted while the page is open, because Unity keeps drawing to it across openings.
// specimen: the archive item to show, or null; formIndex and onFormChange: the selected form
export default function SpecimenDisplay({ specimen, formIndex, onFormChange, onClose }) {
  const viewer = useUnityViewer();
  const canvasHostRef = useRef(null);
  const panelRef = useRef(null);
  const [panel, setPanel] = useState(null);

  const open = Boolean(specimen);
  const form = specimen?.forms?.[formIndex];
  const view = specimen ? { ...specimen, ...form } : null;
  const title = view && (view.title ?? specimenFormTitle(specimen.name, formIndex));
  const address = view?.webDisplay ?? null;
  const formCount = specimen?.forms?.length ?? 0;
  const specimenReady = Boolean(address) && viewer.specimen.address === address && viewer.specimen.status === "loaded";
  const contentVisible = !address || specimenReady; // a form with no 3D model has nothing to wait for

  // The canvas lives as long as this page does. Leaving the page ends Unity.
  useEffect(() => {
    unityViewer.attach(canvasHostRef.current, styles.canvas);
    return () => unityViewer.shutdown();
  }, []);

  useEffect(() => {
    if (open && address) {
      unityViewer.show();
      unityViewer.preload(address);
    } else {
      unityViewer.hide();
    }
  }, [open, address]);

  useEffect(() => {
    if (!open) setPanel(null);
  }, [open]);

  // Escape goes back one step: first the panel, then the whole display
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (panel) setPanel(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, panel, onClose]);

  // On phones the panel covers the bottom of the screen, so Unity frames the specimen above it.
  // On wider screens CSS slides the canvas sideways instead (see .canvasHostShifted).
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const narrow = window.matchMedia("(max-width: 767px)").matches;
      const covered = narrow && panel && panelRef.current ? panelRef.current.offsetHeight + 8 : 0;
      unityViewer.setBottomInset(covered / window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, panel, viewer.status, contentVisible]);

  const loadStep = viewer.status !== "ready" ? "opening" : viewer.catalogLoaded ? "specimen" : "catalogue";
  let failedMessage = null;
  if (address && viewer.status === "error") failedMessage = "The 3D viewer couldn't start.";
  else if (address && viewer.specimen.address === address && viewer.specimen.status === "failed") failedMessage = `${title} couldn't be loaded.`;
  const panelOpen = Boolean(panel);

  return (
    <div className={`${styles.stage}${open ? " " + styles.stageOpen : ""}`} aria-hidden={!open}>
      <div ref={canvasHostRef} className={`${styles.canvasHost}${panelOpen ? " " + styles.canvasHostShifted : ""}`} />

      {open && (
        <>
          {/* A form with no 3D model shows its mugshot instead */}
          {!address && (
            <div className={`${styles.poster}${panelOpen ? " " + styles.posterWithPanel : ""}`}>
              {form?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.posterImg} src={form.image} alt={title} />
              )}
            </div>
          )}

          {contentVisible && (
          <div className={styles.controls}>
            <div className={styles.topBar}>
              <button type="button" className={styles.backBtn} onClick={onClose} aria-label="Back to the archive">
                <Icon size={20}><path d="M15 5l-7 7 7 7" /></Icon>
              </button>
              <div className={styles.titleBlock}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.subtitle}>
                  SID {specimen.sid}
                  {specimen.className && <> · <span className={styles.subtitleClass}>{specimen.className}</span></>}
                </p>
              </div>
              {formCount > 1 && (
                <div className={styles.formPill} role="group" aria-label="Specimen form">
                  <button type="button" className={styles.formArrow} onClick={() => onFormChange(-1)} aria-label="Previous form">
                    <Icon size={18}><path d="M15 6l-6 6 6 6" /></Icon>
                  </button>
                  <span className={styles.formInfo} aria-live="polite">
                    {formStageName(formIndex)}
                    <span className={styles.formCount}>{formIndex + 1}/{formCount}</span>
                  </span>
                  <button type="button" className={styles.formArrow} onClick={() => onFormChange(1)} aria-label="Next form">
                    <Icon size={18}><path d="M9 6l6 6-6 6" /></Icon>
                  </button>
                </div>
              )}
            </div>

            {!address && <p className={styles.status}>3D coming soon</p>}

            <nav className={`${styles.panelButtons}${panelOpen ? " " + styles.panelButtonsHidden : ""}`} aria-label="Specimen panels">
              {PANELS.map(({ id, label, icon }) => (
                <button key={id} type="button" className={styles.panelButton} onClick={() => setPanel(id)}>
                  <span className={styles.panelButtonLabel}>{label}</span>
                  <span className={styles.panelButtonIcon}><Icon>{icon}</Icon></span>
                </button>
              ))}
            </nav>

            {/* One glass shell, the same size for all four panels */}
            <section
              ref={panelRef}
              className={`${styles.panel}${panelOpen ? " " + styles.panelOpen : ""}`}
              aria-label={panelOpen ? `${title} ${panel}` : undefined}
            >
              <div className={styles.panelTabs}>
                {PANELS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.panelTab}${panel === id ? " " + styles.panelTabActive : ""}`}
                    aria-pressed={panel === id}
                    onClick={() => setPanel(id)}
                  >
                    <Icon size={20}>{icon}</Icon>
                    {label}
                  </button>
                ))}
                <button type="button" className={styles.panelClose} onClick={() => setPanel(null)} aria-label="Close panel">
                  <Icon size={20}><path d="M6 6l12 12M18 6L6 18" /></Icon>
                </button>
              </div>

              <div key={panel} className={styles.panelBody}>
                {panel === "overview" && <OverviewPanel key={specimen.sid} view={view} legend={specimen.description} />}
                {panel === "control" && <ControlPanel viewer={viewer} hasModel={Boolean(address)} />}
                {panel === "metrics" && <MetricsPanel specimen={specimen} view={view} />}
                {panel === "abilities" && <AbilitiesPanel view={view} viewer={viewer} />}
              </div>
            </section>
          </div>
          )}

          <SpecimenLoader
            active={!contentVisible}
            step={loadStep}
            progress={viewer.progress}
            failedMessage={failedMessage}
            onRetry={() => unityViewer.retry()}
            onBack={onClose}
          />
        </>
      )}
    </div>
  );
}
