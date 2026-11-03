import Image from "next/image";
import { AVATARS } from "@/lib/avatars";
import styles from "./AvatarPicker.module.css";

// Two portrait choices as a radio group, so it works with the keyboard and native form validation
export default function AvatarPicker({ value, onChange, disabled, name = "avatar", size = 104 }) {
  return (
    <div className={styles.picker} role="radiogroup" aria-label="Mage portrait">
      {AVATARS.map((a) => (
        <label key={a.id} className={`${styles.option} ${value === a.id ? styles.selected : ""}`}>
          <input
            type="radio"
            name={name}
            value={a.id}
            checked={value === a.id}
            onChange={() => onChange(a.id)}
            disabled={disabled}
            required
            className={styles.radio}
          />
          <Image src={a.src} alt="" width={size} height={size} className={styles.image} />
          <span className={styles.label}>{a.label}</span>
        </label>
      ))}
    </div>
  );
}
