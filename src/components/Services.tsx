"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Services.module.css";

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) el.classList.add(styles.active); });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px"});
    obs.observe(el);
    return ()=> obs.disconnect();
  }, []);

  return (
    <section id="services" className={styles.services}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTag}>Mit is csinálok?</div>
        <h2 className={styles.sectionTitle}>Szolgáltatások</h2>
      </div>
      <div className={`${styles.grid} ${styles.reveal}`} ref={ref}>
        <div className={styles.card}>
          <div className={styles.icon}>🎯</div>
          <h3>Track - Mozgás közben</h3>
          <p>Minden, ahol az autó mozgásban van! Drift, gyorsulás, pályanapok...</p>
          <a href="#contact" className={styles.link}>Katt, hogy többet megtudj! →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>🌆</div>
          <h3>Előre megbeszélt helyek</h3>
          <p>Erdőben, parkolóban akár parkolóházban, napfelkeltében, naplementében, úton - út közben, bárhol!</p>
          <a href="#contact" className={styles.link}>Katt, hogy többet megtudj! →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>✨</div>
          <h3>Utómunka</h3>
          <p>Profeszionális utómunka, képek színezése, Photoshop...Akár személyre is szabva, ha nem tetszik változtatunk!</p>
          <a href="#contact" className={styles.link}>Katt, hogy többet megtudj! →</a>
        </div>
      </div>
    </section>
  );
};

export default Services;
