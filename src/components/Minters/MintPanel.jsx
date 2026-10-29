import styles from "@/app/marketplace/specimen-mint/page.module.css";
import WalletButton from "@/components/WalletButton/WalletButton";

// Mint limit is a placeholder until it's read from the contract
export default function MintPanel({ remaining = 4, limit = 4 }) {
  return (
    <div className={styles.mintArea}>
      <div className={styles.walletRow}>
        <WalletButton />
      </div>

      <div className={`${styles.panel} ${styles.mintPanel}`}>
        <div className={styles.allowance}>
          <span className={styles.allowanceLabel}>You can mint</span>
          <span className={styles.allowanceCount}>
            {remaining} <small>/ {limit}</small>
          </span>
          <span className={styles.allowanceLabel}>Remaining</span>
        </div>

        <div className={styles.mintButtons}>
          <button className={`${styles.mintButton} ${styles.mintPrimary}`}>
            Mint 1 <span aria-hidden="true">›</span>
          </button>
          <button className={styles.mintButton}>
            Mint {limit} <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
