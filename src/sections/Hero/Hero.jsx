import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";
import styles from "./Hero.module.css";

const STATS = [
  { value: "345", label: "Members" },
  { value: "998", label: "Existing Specimen" },
  { value: "∞", label: "Endless Possibilities", symbol: true },
];

export default function Hero() {
  return (
    <section className={shared.section}>
      <div className={shared.content}>
        <div className={shared.column}>
          <p className={shared.eyebrow}>A living sci-fi fantasy universe</p>

          <h1 className={`${shared.title} ${shared.titleLight}`}>
            Join the
            <br />
            Galactic
            <br />
            <span className={shared.accent}>Battle</span>
          </h1>

          <p className={shared.subtitle}>
            One Mage account connects you across all Shadawi titles. 
          </p>
          <p className={shared.subtitle}>
            Create your Mage profile and connect with mages around the world.
            Manage your specimens, earn rewards and badges, and climb the global
            owner rankings as you level up.
          </p>

          <div className={shared.actions}>
            <Button href="/signup" variant="primary">
              Create your Mage
            </Button>
            <Button href="#specimens" variant="link">
              Learn more
            </Button>
          </div>

          <div className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={`${styles.value} ${stat.symbol ? styles.symbol : ""}`}>{stat.value}</span>
                <span className={styles.label}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
