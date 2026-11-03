import MeritEmblem from "./MeritEmblem";
import { ProgressBar } from "./CollectionPanel";
import styles from "./page.module.css";

const earnedDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default function MeritsPanel({ merits }) {
  const earned = merits.filter((m) => m.earnedAt);
  // Earned first (newest first), then the ones closest to done
  const sorted = [
    ...earned.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)),
    ...merits.filter((m) => !m.earnedAt).sort((a, b) => b.progress / b.target - a.progress / a.target),
  ];
  const meritXp = earned.reduce((sum, m) => sum + m.xp, 0);

  return (
    <>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Merits</h2>
        <p className={styles.muted}>
          {earned.length} of {merits.length} earned · {meritXp.toLocaleString()} XP
        </p>
      </div>

      <ul className={styles.meritGrid}>
        {sorted.map((m) => (
          <li key={m.id} className={`${styles.panel} ${styles.meritCard} ${m.earnedAt ? styles.meritEarned : ""}`}>
            <MeritEmblem icon={m.icon} earned={Boolean(m.earnedAt)} className={styles.meritIcon} />
            <div className={styles.meritBody}>
              <div className={styles.nextMeritHead}>
                <p className={styles.meritName}>{m.name}</p>
                <span className={styles.meritXp}>+{m.xp} XP</span>
              </div>
              <p className={styles.meritDesc}>{m.description}</p>
              {m.earnedAt ? (
                <p className={styles.meritDone}>Earned {earnedDate(m.earnedAt)}</p>
              ) : (
                <div className={styles.meritProgress}>
                  <ProgressBar value={m.progress} max={m.target} label={`${m.name} progress`} />
                  <span className={styles.meritCount}>{m.progress} / {m.target}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
