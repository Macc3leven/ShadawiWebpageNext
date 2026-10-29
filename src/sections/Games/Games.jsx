import Link from "next/link";
import shared from "@/sections/sections.module.css";
import styles from "./Games.module.css";

// Thumbnails are placeholders — swap for real Striker / Minter art when ready.
const LINKS = [
  {
    title: "Shadawi Striker",
    description: "Battle with your specimens.",
    href: "/games",
    image: "/images/specimen-temp/domigra.png",
  },
  {
    title: "Specimen Minter",
    description: "Build your collection.",
    href: "/marketplace/specimen-mint",
    image: "/images/specimen-temp/mightybird.png",
  },
];

export default function Games() {
  return (
    <section className={shared.section}>
      <div className={`${shared.content} ${shared.alignRight}`}>
        <div className={shared.column}>
          <h2 className={shared.title}>Play, battle, and build your place</h2>
          <p className={shared.subtitle}>
            Take your specimens into battle, build your collection and make your
            name known among the mages of Shadawi.
          </p>

          <ul className={styles.list}>
            {LINKS.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className={styles.row}>
                  <span
                    className={styles.thumb}
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  />
                  <span className={styles.text}>
                    <span className={styles.rowTitle}>{item.title}</span>
                    <span className={styles.rowDesc}>{item.description}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
