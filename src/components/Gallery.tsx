"use client";
import React, { useEffect } from "react";
import styles from "./Gallery.module.css";
import { LightboxProvider, useLightbox, GalleryItem as Item } from "./LightboxContext";
import Lightbox from "./Lightbox";

const items: Item[] = [
  { image: "/images/onedaymitsu.webp", thumb: "/images/onedaymitsu.thumb.webp", title: "ONEDAY x OLD & SLOW", desc: "Mitsubishi EVO V", tag: "@sopi_s4" },
  { image: "/images/onedaye30.webp", thumb: "/images/onedaye30.thumb.webp", title: "ONEDAY x OLD & SLOW", desc: "BMW E30", tag: "@levent_e30" },
  { image: "/images/e36amts2.webp", thumb: "/images/e36amts2.thumb.webp", title: "UNIX-AMTS 2025", desc: "BMW E36", tag: "@gerofbatyus" },
  { image: "/images/rs4compressed.webp", thumb: "/images/rs4compressed.thumb.webp", title: "UNIX-AMTS 2025", desc: "Audi RS4 B5", tag: "@__mikub__" },
  { image: "/images/debrecendrive.webp", thumb: "/images/debrecendrive.thumb.webp", title: "Debrecen Drive", desc: "BMW E46", tag: "@unknown" },
  { image: "/images/patrix.webp", thumb: "/images/patrix.thumb.webp", title: "Előre megbeszélt hely", desc: "BMW E60", tag: "@_szabopatrik" },
];

const GalleryGrid: React.FC = () => {
  const { openWith } = useLightbox();

  useEffect(() => {
    // reveal animation per item
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add(styles.active);
            const bg = el.getAttribute("data-bg");
            if (bg && !el.style.backgroundImage) {
              el.style.backgroundImage = bg;
              el.style.backgroundSize = "cover";
              el.style.backgroundPosition = "center";
            }
          }
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
          data-bg={`url('${it.thumb || it.image}')`}
          onClick={() => openWith(items, idx)}
        >
          <div className={styles.itemOverlay}>
            <h3>{it.title}</h3>
            <p>{it.desc}</p>
            <a
              className={styles.tag}
              href={`https://instagram.com/${(it.tag || "").replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {it.tag}
            </a>
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
