// components/LedgerCarousel.jsx
import styles from "@/app/marketplace/specimen-mint/page.module.css";
import SpecimenCard from "./SpecimenCard";

export default function LedgerCarousel({ specimens }) {
  return (
    <section className={styles.ledgerWrap}>
      <div className={styles.ledger}>
        {specimens.map((specimen, index) => (
          <SpecimenCard
            key={specimen.id}
            specimen={specimen}
            active={index === 0}
          />
        ))}
      </div>

      <div className={styles.scrollHint}>
        <span>←</span>
        <div className={styles.scrollLine}>
          <i />
        </div>
      </div>
    </section>
  );
}