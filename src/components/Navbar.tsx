"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

const scrollToId = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        burgerRef.current && !burgerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  // close mobile menu when navigating
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} id="navbar">
      <div className={styles.container}>
        <div className={styles.logo}>SutakVisuals</div>
        <button
          className={styles.burger}
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          ref={burgerRef}
        >
          <span/>
          <span/>
          <span/>
        </button>
        <ul className={styles.links}>
          <li><a href="#home" onClick={(e) => handleNav(e, "#home")}>Kezdőlap</a></li>
          <li><a href="#gallery" onClick={(e) => handleNav(e, "#gallery")}>Portfólió</a></li>
          <li><a href="#services" onClick={(e) => handleNav(e, "#services")}>Szolgáltatások</a></li>
          <li><a href="#contact" onClick={(e) => handleNav(e, "#contact")}>Kontakt</a></li>
        </ul>
      </div>
      {/* Mobile menu */}
      <div id="mobile-menu" className={`${styles.mobile} ${open ? styles.open : ""}`} ref={menuRef}>
        <ul>
          <li><a href="#home" onClick={(e) => handleNav(e, "#home")}>Kezdőlap</a></li>
          <li><a href="#gallery" onClick={(e) => handleNav(e, "#gallery")}>Portfólió</a></li>
          <li><a href="#services" onClick={(e) => handleNav(e, "#services")}>Szolgáltatások</a></li>
          <li><a href="#contact" onClick={(e) => handleNav(e, "#contact")}>Kontakt</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
