// components/QuantitySelector.jsx
"use client";

import { useState } from "react";
import styles from "@/app/marketplace/specimen-mint/page.module.css";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  function decrease() {
    setQuantity((value) => Math.max(1, value - 1));
  }

  function increase() {
    setQuantity((value) => Math.min(10, value + 1));
  }

  return (
    <div className={styles.quantityBox}>
      <span>Quantity</span>

      <div className={styles.quantityControls}>
        <button onClick={decrease} aria-label="Decrease quantity">
          −
        </button>
        <strong>{quantity}</strong>
        <button onClick={increase} aria-label="Increase quantity">
          +
        </button>
      </div>
    </div>
  );
}