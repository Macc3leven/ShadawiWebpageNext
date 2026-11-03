import { classColor } from "@/lib/specimenClasses";
import styles from "./page.module.css";

// A Kin's artwork, or a class-coloured placeholder until the specimen has one
export default function KinImage({ kin, className = "" }) {
  const style = { "--class-color": classColor(kin.className) };
  if (kin.image) {
    // eslint-disable-next-line @next/next/no-img-element -- artwork can come from any asset host
    return <img src={kin.image} alt="" className={`${styles.kinImg} ${className}`} style={style} loading="lazy" />;
  }
  return (
    <div className={`${styles.kinImg} ${styles.kinPlaceholder} ${className}`} style={style} aria-hidden="true">
      <span>{kin.name.slice(0, 1)}</span>
    </div>
  );
}
