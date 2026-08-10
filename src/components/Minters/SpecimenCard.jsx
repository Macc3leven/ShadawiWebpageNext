// components/SpecimenCard.jsx
import styles from "@/app/marketplace/specimen-mint/page.module.css";

export default function SpecimenCard({ specimen, active }) {
  return (
    <article className={`${styles.card} ${active ? styles.activeCard : ""}`}>
      <p className={styles.position}>{specimen.position}</p>

      <div className={styles.imageBox}>
        <img src={specimen.image} alt={specimen.name} />
      </div>

      <div className={styles.cardBody}>
        <h3>{specimen.name}</h3>
        <span className={styles.classPill}>
          {specimen.icon} {specimen.className}
        </span>
      </div>
    </article>
  );
}