import styles from "./SupportButton.module.css";

// Single source of truth for the Ko-fi donation link
export const KOFI_URL = "https://ko-fi.com/shadawi_project#";

// "Fuel Development" support CTA — opens Ko-fi in a new tab.
// variant: "outline" (default, sits beside a primary button) | "link" (small text link)
export default function SupportButton({ label = "Fuel Development", variant = "outline", className = "" }) {
  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variant === "link" ? styles.link : styles.outline} ${className}`.trim()}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C12 6 7 8 7 13.5A5 5 0 0 0 17 13.5C17 10.5 15 9 15 6.5C13.5 8 13 9.5 13 11C11.5 9.5 12 5 12 2Z" />
      </svg>
      {label}
      <span className={styles.external} aria-hidden="true">↗</span>
    </a>
  );
}
