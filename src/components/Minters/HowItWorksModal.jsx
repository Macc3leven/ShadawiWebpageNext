// components/HowItWorksModal.jsx
import styles from "@/app/marketplace/specimen-mint/page.module.css";

export default function HowItWorksModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>How it works</h2>

        <div className={styles.steps}>
          <p><strong>1.</strong> The first specimen in the ledger is the one you mint.</p>
          <p><strong>2.</strong> After minting, the ledger rotates forward.</p>
          <p><strong>3.</strong> A new specimen enters the back of the queue.</p>
          <p><strong>4.</strong> The ledger remains visible and verifiable on-chain.</p>
        </div>
      </div>
    </div>
  );
}