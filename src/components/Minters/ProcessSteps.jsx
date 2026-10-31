import styles from "@/app/shop/specimen-mint/page.module.css";

const STEPS = [
  {
    title: "Mint the next specimen",
    description: "You receive the first one in the queue.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M16 4L29 11L16 18L3 11Z" />
        <path d="M3 16L16 23L29 16" />
        <path d="M3 21L16 28L29 21" />
      </svg>
    ),
  },
  {
    title: "A new specimen is added",
    description: "Your mint generates a new specimen at the end.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="16" cy="16" r="13" />
        <path d="M16 10V22M10 16H22" />
      </svg>
    ),
  },
  {
    title: "The queue keeps moving",
    description: "Always 10 specimens visible.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 12A11 11 0 0 0 6.5 10" />
        <path d="M6 4V10H12" />
        <path d="M6 20A11 11 0 0 0 25.5 22" />
        <path d="M26 28V22H20" />
      </svg>
    ),
  },
];

// <details> gives the mobile accordion for free; on desktop the
// summary is non-interactive so the panel always stays open.
export default function ProcessSteps() {
  return (
    <details id="how-it-works" className={`${styles.panel} ${styles.process}`} open>
      <summary className={styles.processSummary}>
        <h2 className={styles.panelTitle}>
          <span className={styles.desktopOnly}>Simple process</span>
          <span className={styles.mobileOnly}>How it works</span>
        </h2>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>

      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepIcon}>{step.icon}</span>
            <span className={styles.stepNumber}>{i + 1}</span>
            <span className={styles.stepText}>
              <strong>{step.title}</strong>
              {step.description}
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}
