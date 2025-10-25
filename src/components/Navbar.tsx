"use client";
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const scrollToId = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} id="navbar">
      <div className={styles.container}>
        <div className={styles.logo}>SutakVisuals</div>
        <ul className={styles.links}>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToId("#home"); }}>Kezdőlap</a></li>
          <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToId("#gallery"); }}>Portfólió</a></li>
          <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToId("#services"); }}>Szolgáltatások</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("#contact"); }}>Kontakt</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
