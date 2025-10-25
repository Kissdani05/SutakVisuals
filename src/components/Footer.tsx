import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h3>SutakVisuals</h3>
          <p>Autófotózás mesterfokon 2020 óta.</p>
        </div>
        <div className={styles.section}>
          <h4>Katt az ugráshoz</h4>
          <div className={styles.links}>
            <a href="#home">Kezdőlap</a>
            <a href="#gallery">Portfólió</a>
            <a href="#services">Szolgáltatások</a>
            <a href="#contact">Kontakt</a>
          </div>
        </div>
        <div className={styles.section}>
          <h4>szolgáltatások</h4>
          <div className={styles.links}>
            <a href="#services">Track - Mozgás közben</a>
            <a href="#services">Előre megbeszélt helyek</a>
            <a href="#services">Utómunka</a>
          </div>
        </div>
        <div className={styles.section}>
          <h4>Kövess be!</h4>
          <div className={styles.links}>
            <a href="https://www.instagram.com/sutakvisuals" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2025 SutakVisuals</p>
      </div>
    </footer>
  );
};

export default Footer;
