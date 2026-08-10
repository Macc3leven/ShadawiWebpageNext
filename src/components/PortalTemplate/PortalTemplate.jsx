import Link from "next/link";
import PortalCanvas from "@/components/PortalCanvas/PortalCanvas";
import styles from "./PortalTemplate.module.css";

export default function PortalTemplate({ title, subtitle, accentLabel, cards }) {
  return (
    <div className={styles.portal}>
      <PortalCanvas />

      <div className={styles.layout}>
        {/* ── Hero ── */}
        <div className={styles.hero}>
          <div className={styles.titleAccent}>
            <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor">
              <path d="M6 0L12 6L6 12L0 6Z" />
            </svg>
            <span className={styles.accentLine} />
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          {accentLabel && (
            <span className={styles.accentLabel}>
              <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M9 1L17 9L9 17L1 9Z" />
                <path d="M9 5L13 9L9 13L5 9Z" opacity="0.5" />
              </svg>
              {accentLabel}
            </span>
          )}
        </div>

        {/* ── Cards ── */}
        <div className={styles.cardsArea}>
          {cards.map((card, i) => (
            <Link
              key={card.id}
              href={card.href}
              className={styles.cardLink}
            >
              <div
                className={styles.cardOuter}
                style={{
                  "--accent": card.accentColor,
                  animationDelay: `${i * 1.75}s`,
                }}
              >
                <div className={styles.card}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <div className={styles.divider} />
                    <p className={styles.cardDesc}>{card.description}</p>
                  </div>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
