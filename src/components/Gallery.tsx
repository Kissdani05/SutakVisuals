"use client";
import React, { useEffect } from "react";
import styles from "./Gallery.module.css";
import { LightboxProvider, useLightbox, GalleryItem as Item } from "./LightboxContext";
import Lightbox from "./Lightbox";

const items: Item[] = [
  { image: "/pictures/onedaymitsu.png", title: "ONEDAY x OLD & SLOW", desc: "Mitsubishi EVO V", tag: "@sopi_s4" },
  { image: "/pictures/onedaye30.png", title: "ONEDAY x OLD & SLOW", desc: "BMW E30", tag: "@levent_e30" },
  { image: "/pictures/e36amts2.png", title: "UNIX-AMTS 2025", desc: "BMW E36", tag: "@gerofbatyus" },
  { image: "/pictures/rs4compressed.png", title: "UNIX-AMTS 2025", desc: "Audi RS4 B5", tag: "@__mikub__" },
  { image: "/pictures/debrecendrive.png", title: "Debrecen Drive", desc: "BMW E46", tag: "@unknown" },
  { image: "/pictures/patrix.png", title: "Előre megbeszélt hely", desc: "BMW E60", tag: "@_szabopatrik" },
];

const GalleryGrid: React.FC = () => {
  const { openWith } = useLightbox();

  useEffect(() => {
    // reveal animation per item
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add(styles.active);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.grid}>
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`${styles.item} ${styles.reveal}`}
          style={{ backgroundImage: `url('${it.image}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          onClick={() => openWith(items, idx)}
        >
          <div className={styles.itemOverlay}>
            <h3>{it.title}</h3>
            <p>{it.desc}</p>
            <span className={styles.tag}>{it.tag}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <LightboxProvider>
      <section id="gallery" className={styles.gallery}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>Portfólió</div>
          <h2 className={styles.sectionTitle}>Válogatott kollekció</h2>
          <p className={styles.sectionDescription}>
            Ezek a képek egy jó pár autós talalkozóról lettek válogatva amin megjelentem, mint Media Press. Legfrissebb képeimet az Instagramon láthatod. @sutakvisuals
          </p>
        </div>
        <GalleryGrid />
      </section>
      <Lightbox />
    </LightboxProvider>
  );
};

export default Gallery;
