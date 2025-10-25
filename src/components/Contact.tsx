"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showMsg, setShowMsg] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) el.classList.add(styles.active); });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px"});
    obs.observe(el);
    return ()=> obs.disconnect();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Hiba történt");

      setShowMsg(true);
      form.reset();
      setTimeout(() => setShowMsg(false), 3500);
    } catch (err: any) {
      setError(err?.message || "Nem sikerült elküldeni az üzenetet.");
    } finally {
      setSending(false);
    }
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
            <label htmlFor="instagram">Instagram neved (Itt veszem fel a kapcsolatot veled)</label>
            <input id="instagram" name="instagram" type="text" placeholder="pl. @sutakvisuals" />
          </div>
          <div className={styles.group}>
            <label htmlFor="subject">Autó márka / Pontos típus</label>
            <input id="subject" name="subject" type="text" required />
          </div>
          <div className={styles.group}>
            <label htmlFor="message">Hagyj üzenetet! Speciális kérések, stb...</label>
            <textarea id="message" name="message" required />
          </div>
          {/* honeypot */}
          <input type="text" name="_hp" className={styles.hp} tabIndex={-1} autoComplete="off" />
          <button type="submit" className={styles.cta} disabled={sending}>
            {sending ? "Küldés..." : "Elküldöm!"}
          </button>
        </form>
      </div>

      {showMsg && (
        <div className={styles.toast}>✓ Üzenetedet megkaptuk, hamarosan jelentkezünk.</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
};

export default Contact;
