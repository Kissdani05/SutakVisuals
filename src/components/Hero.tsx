"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const Hero: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.pageYOffset;
      const bg = bgRef.current;
      if (bg) bg.style.transform = `translateY(${scrolled * 0.5}px)`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroBg} ref={bgRef} />
      <div className={styles.gridOverlay} />
      <div className={styles.content}>
        <h1>
         AZ AUTÓZÁS<br />MŰVÉSZETE
        </h1>
        <p className={styles.subtitle}>Ahol a sebesség művészetté válik</p>
        <div className={styles.ctaGroup}>
          <a href="#gallery" className={styles.ctaButton}>Fedezd fel a munkáim!</a>
          <a href="#contact" className={`${styles.ctaButton} ${styles.ctaOutline}`}>Foglalj időpontot</a>
        </div>
      </div>
      <div className={styles.scrollIndicator}><span>Görgess</span></div>
      <div className={styles.fadeBottom} />
    </section>
  );
};

export default Hero;
