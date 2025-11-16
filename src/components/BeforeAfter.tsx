"use client";
import React, { useCallback, useEffect, useRef } from "react";
import styles from "./BeforeAfter.module.css";

type Item = {
  title: string;
  ig?: string; // instagram handle without @ or with @
  before: string;
  after: string;
  contain?: boolean;
};

const items: Item[] = [
  {
    title: "BMW E60",
    ig: "_szabopatrik",
    before: "/images/beforeafter/patrixbefore1.webp",
    after: "/images/beforeafter/patrixafter1.webp",
  },
  {
    title: "BMW E34",
    ig: "zakany_barnabas",
    before: "/images/beforeafter/barnabefore1.webp",
    after: "/images/beforeafter/barnaafter1.webp",
  },
  {
    title: "BMW E34",
    ig: "zakany_barnabas",
    before: "/images/beforeafter/barnabefore2.webp",
    after: "/images/beforeafter/barnaafter2.webp",
  },
  {
    title: "BMW E36 Touring",
    ig: "szollobencee",
    before: "/images/beforeafter/szollobefore1.webp",
    after: "/images/beforeafter/szolloafter1.webp",
  },
  {
    title: "BMW E36 Touring",
    ig: "szollobencee",
    before: "/images/beforeafter/szollobefore2.webp",
    after: "/images/beforeafter/szolloafter2.webp",
  },
];

const normalizeIg = (ig?: string) => (ig || "").replace(/^@/, "");

const Comparison: React.FC<{ item: Item }> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const knobRef = useRef<HTMLDivElement | null>(null);
  const afterRef = useRef<HTMLImageElement | null>(null);
  const dragging = useRef(false);

  const setPosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    const slider = sliderRef.current;
      const after = afterRef.current;
      const knob = knobRef.current;
      if (!el || !slider || !after || !knob) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    slider.style.left = pct + "%";
      knob.style.left = pct + "%";
    after.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = e instanceof TouchEvent ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
      setPosition(x);
    };
    const onUp = () => { dragging.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as any);
      document.removeEventListener("touchend", onUp);
    };
  }, [setPosition]);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const x = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setPosition(x);
  };

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <h3 className={styles.h3}>{item.title}</h3>
        {item.ig && (
          <a
            className={styles.ig}
            href={`https://www.instagram.com/${normalizeIg(item.ig)}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            @{normalizeIg(item.ig)}
          </a>
        )}
      </div>
      <div
        className={`${styles.container} ${item.contain ? styles.contain : ""}`}
        ref={containerRef}
        onMouseDown={start}
        onTouchStart={start}
        onContextMenu={(e) => e.preventDefault()}
      >
        <img src={item.after} alt="After" className={styles.img} />
        <img ref={afterRef} src={item.before} alt="Before" className={`${styles.img} ${styles.after}`} />
        <div ref={sliderRef} className={styles.slider} />
        <div ref={knobRef} className={styles.knob} />
        <div className={styles.labels}>
          <span className={`${styles.label} ${styles.before}`}>Előtte</span>
          <span className={`${styles.label} ${styles.afterLabel}`}>Utána</span>
        </div>
      </div>
    </div>
  );
};

const BeforeAfter: React.FC = () => {
  return (
    <section id="before-after" className={styles.section}>
      <div className={styles.sectionHeaderWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>Előtte / Utána</div>
          <h2 className={styles.title}>A profi utómunka eredményei</h2>
          <p className={styles.subtitle}>Húzd a csúszkát és nézd meg a különbséget!</p>
        </div>
      </div>
      <div className={styles.grid}>
        {items.map((it, i) => (
          <Comparison item={it} key={i} />
        ))}
      </div>
    </section>
  );
};

export default BeforeAfter;
