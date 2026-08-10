import Image from "next/image";
import styles from "./page.module.css";

export const metadata = { title: "Dashboard — Shadawi" };

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.characterWrap}>
          <Image
            src="/images/frames/0001.png"
            alt="Your Shadawi specimen"
            width={340}
            height={340}
            className={styles.character}
            priority
          />
          <span className={styles.characterBadge}>DEFAULT SPECIMEN</span>
        </div>

        <div className={styles.info}>
          <p className={styles.greeting}>WELCOME, MAGE</p>
          <h1 className={styles.name}>UNNAMED MAGE</h1>
          <p className={styles.sub}>Your profile is ready. The realms await.</p>
        </div>

        <div className={styles.statsRow}>
          {[
            { label: "SPECIMEN", value: "0" },
            { label: "BATTLES",  value: "0" },
            { label: "RANK",     value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className={styles.statCard}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <p className={styles.comingSoon}>Full dashboard coming soon.</p>
      </div>
    </main>
  );
}
