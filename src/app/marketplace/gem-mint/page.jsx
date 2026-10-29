import Link from "next/link";
import styles from "./page.module.css";

export const metadata = { title: "Gem Minter — Shadawi" };

export default function GemMintPage() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Gem Minter</p>
        <h1 className={styles.title}>
          Coming shortly<br /><span>after mint</span>
        </h1>
        <div className={styles.actions}>
          <Link href="/marketplace/specimen-mint" className={styles.primary}>
            Specimen Minter <span aria-hidden="true">→</span>
          </Link>
          <Link href="/marketplace" className={styles.link}>Marketplace</Link>
        </div>
      </section>
    </main>
  );
}
