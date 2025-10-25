"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) el.classList.add(styles.active); });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px"});
    obs.observe(el);
    return ()=> obs.disconnect();
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3500);
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={`${styles.container} ${styles.reveal}`} ref={sectionRef}>
        <div className={styles.info}>
          <h2>Készítsünk együtt valami nagyon extrát!</h2>
          <p>Írj nekem, egyeztessünk időpontot!</p>
          <div className={styles.details}>
            <div className={styles.item}>
              <div className={styles.itemIcon}>📧</div>
              <div className={styles.itemText}>
                <h4>Email</h4>
                <p>sutak.media@gmail.com</p>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemIcon}>📱</div>
              <div className={styles.itemText}>
                <h4>Telefon</h4>
                <p>+36 30 295 8530</p>
              </div>
            </div>
          </div>
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.group}>
            <label htmlFor="name">Név</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className={styles.group}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className={styles.group}>
            <label htmlFor="subject">Autó márka / Pontos típus</label>
            <input id="subject" name="subject" type="text" required />
          </div>
          <div className={styles.group}>
            <label htmlFor="message">Hagyj üzenetet! Speciális kérések, stb...</label>
            <textarea id="message" name="message" required />
          </div>
          <button type="submit" className={styles.cta}>Elküldöm!</button>
        </form>
      </div>

      {showMsg && (
        <div className={styles.toast}>
          ✓ Message sent successfully! We'll be in touch soon.
        </div>
      )}
    </section>
  );
};

export default Contact;
