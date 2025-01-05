import styles from './hero.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <h1>Your Health, Our Priority</h1>
      <p>Providing quality healthcare products and services to our community.</p>
      <button className={styles.ctaButton}>Contact Us</button>
    </div>
  );
}

