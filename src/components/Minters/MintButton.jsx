// components/MintButton.jsx
import styles from "@/app/marketplace/specimen-mint/page.module.css";

export default function MintButton({ price }) {
  return (
    <button className={styles.mintButton}>
      <span>MINT NOW</span>
      <span>{price}</span>
    </button>
  );
}