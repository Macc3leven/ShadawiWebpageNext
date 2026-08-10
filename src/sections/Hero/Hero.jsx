import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";
import styles from "./Hero.module.css";

const SCROLL_LETTERS   = ["S", "C", "R", "O", "L", "L"];
const SCROLL_LETTERS_2 = ["D", "O", "W", "N"];

export default function Hero() {
  return (
    <section className={shared.section}>
      <div className={`${shared.content} ${styles.heroContent}`}>
        <h1 className={shared.title}>
          JOIN THE<br />GALACTIC<br />BATTLE
        </h1>

        <p className={shared.subtitle}>
          Shadawi is a living sci-fi fantasy universe of mages, specimens, and battles 
          across dimensions. The balance between 
          mage society and specimen kingdoms are beginning to fracture. 
          You enter this world as a mage, follow the 
          stories, and prepare for what comes next.
        </p>

        <Button href="/universe">ENTER</Button>

        <small className={styles.heroNote}>
          Receive transmissions, configure specimen, playable updates, and early
          access notices.
        </small>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.label}>MEMBERS</span>
            <span className={styles.value}>345</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>EXISTING SPECIMEN</span>
            <span className={styles.value}>998</span>
          </div>
        </div>

        <h1 className={styles.scrollText}>
          {SCROLL_LETTERS.map((letter, i) => (
            <span key={`top-${i}`}>{letter}</span>
          ))}
          <br />
          {SCROLL_LETTERS_2.map((letter, i) => (
            <span key={`bot-${i}`}>{letter}</span>
          ))}
        </h1>
      </div>
    </section>
  );
}
