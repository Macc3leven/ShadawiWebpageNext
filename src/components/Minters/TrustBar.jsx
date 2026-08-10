// components/TrustBar.jsx
import styles from "@/app/marketplace/specimen-mint/page.module.css";

export default function TrustBar() {
  return (
    <aside className={styles.trustBar}>
      <div className={styles.shield}>◇</div>

      <p>The ledger is public and verifiable on-chain.</p>

      <a href="#" className={styles.explorerLink}>
        View on explorer ↗
      </a>
    </aside>
  );
}