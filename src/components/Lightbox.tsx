"use client";
import React from "react";
import { useLightbox } from "./LightboxContext";
import styles from "./Lightbox.module.css";

const Lightbox: React.FC = () => {
  const { isOpen, items, index, close, next, prev } = useLightbox();
  if (!isOpen) return null;
  const item = items[index];

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <button className={styles.close} aria-label="Close" onClick={close}>
        ×
      </button>

      <div className={styles.help}>
        <div><strong>Navigáció:</strong></div>
        <div>← → Következő/Előző kép</div>
        <div>ESC Bezárás</div>
        <div>Kattints bárhova a bezáráshoz</div>
      </div>

      <div className={styles.counter}>
        {index + 1} / {items.length}
      </div>

      <img className={styles.image} src={item.image} alt={item.title} onClick={(e) => e.stopPropagation()} />

      <div className={styles.caption}>
        <strong>{item.title}</strong>
        <br />
        {item.desc}
        <br />
        {item.tag}
      </div>

      <div className={styles.nav}>
        <button className={styles.prev} onClick={prev} aria-label="Előző">&#10094;</button>
        <button className={styles.next} onClick={next} aria-label="Következő">&#10095;</button>
      </div>
    </div>
  );
};

export default Lightbox;
