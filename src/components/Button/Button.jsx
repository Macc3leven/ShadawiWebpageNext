// src/components/Button/Button.jsx
// ---------------------------------------------------------------
// REUSABLE BUTTON COMPONENT
//
// 🧠 REACT LESSON: Components & Props
// In your old code, you wrote <button class="button1">RESERVE</button>
// multiple times. In React, you make ONE component and reuse it.
//
// Props are how data flows INTO a component. They're like function
// arguments. This Button accepts:
//   - children: whatever you put between <Button>...</Button>
//   - onClick:  a function to run when clicked
//   - type:     "button" | "submit" | "reset"  (defaults to "button")
//   - href:     if provided, renders an <a> instead (for navigation)
//   - ...rest:  any other props get spread onto the element
//
// 🧠 The `...rest` spread is a "props pass-through" pattern.
// It means callers can pass things like `disabled`, `aria-label`,
// `data-testid` etc. without us having to declare every single one.
// ---------------------------------------------------------------

import Link from "next/link";
import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  type = "button",
  href,
  className = "",
  ...rest
}) {
  // 🧠 We combine our scoped class with any extra className the
  // caller passed in. The space between them matters!
  const combinedClass = `${styles.button1} ${className}`.trim();

  // 🧠 If href is provided, render a Next.js <Link> instead of <button>.
  // <Link> does client-side navigation — no full page reload, much faster.
  // In your old code you used `onclick="window.location.href='/gallery'"`,
  // which causes a full reload. Don't do that anymore — use <Link>.
  if (href) {
    return (
      <Link href={href} className={combinedClass} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClass}
      {...rest}
    >
      {children}
    </button>
  );
}
