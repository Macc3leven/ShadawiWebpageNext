import styles from "@/app/marketplace/specimen-mint/page.module.css";

// Class tag colours, one per realm
const CLASS_COLORS = {
  beast: "#f2584e",
  plant: "#6fcf73",
  fairy: "#d68cf0",
  elemental: "#9fb4c8",
  undead: "#a58cf0",
  gas: "#5fb8f0",
  humanoid: "#b8b8b8",
  divine: "#e8c36a",
};

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
