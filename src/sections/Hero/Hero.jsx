import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";
import styles from "./Hero.module.css";

const STATS = [
  { value: "345", label: "Members" },
  { value: "998", label: "Existing Specimen" },
];

export default function Hero() {
  return (
    <section className={shared.section}>
      <div className={shared.content}>
        <div className={shared.column}>
          <p className={shared.eyebrow}>A living sci-fi fantasy universe</p>

          <h1 className={`${shared.title} ${shared.titleLight}`}>
            Join the<br />Galactic<br /><span className={shared.accent}>Battle</span>
          </h1>

          <p className={shared.subtitle}>
            Shadawi is home to eight realms, powerful mages, and a growing
            collection of extraordinary specimens.
          </p>
          <p className={shared.subtitle}>
            Create your mage profile, earn rewards, configure your specimens, and
            connect with mages around the world. Level up, earn badges, and climb
            the global owner rankings.
          </p>

          <div className={shared.actions}>
            <Button href="/universe" variant="primary">Enter</Button>
            <Button href="#specimens" variant="link">Learn more</Button>
          </div>

          <div className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.value}>{stat.value}</span>
                <span className={styles.label}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
