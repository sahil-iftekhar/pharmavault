import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>Pharmavault</h3>
          <p>Providing quality medicine delivery since 2025</p>
        </div>
        
        <div className={styles.section}>
          <h3>Contact Us</h3>
          <p>11/A, Rankin Street, Wari, Dhaka</p>
          <p>Phone: +8801856664080</p>
          <p>Email: info@pharmavault.com</p>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2025 Pharmavault. All rights reserved.</p>
      </div>
    </footer>
  );
}

