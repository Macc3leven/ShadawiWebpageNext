import styles from "@/app/shop/specimen-mint/page.module.css";
import { CLASS_COLORS } from "@/lib/specimenClasses";

export default function SpecimenCard({ specimen, position }) {
  const color = CLASS_COLORS[specimen.className.toLowerCase()] || "#b8b8b8";

  return (
    <article className={styles.card} style={{ "--class-color": color }}>
      <p className={styles.position}>{String(position).padStart(2, "0")}</p>

      <div className={styles.imageBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={specimen.image} alt={`Specimen SID #${specimen.sid}`} />
      </div>

      <p className={styles.sid}>SID #{specimen.sid}</p>
      <span className={styles.classPill}>{specimen.className}</span>
    </article>
  );
}
