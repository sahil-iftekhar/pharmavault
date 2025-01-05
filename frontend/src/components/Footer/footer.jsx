import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>HealthyRx Pharmacy</h3>
          <p>Providing quality healthcare since 1995</p>
        </div>
        
        <div className={styles.section}>
          <h3>Contact Us</h3>
          <p>123 Health Street, Wellness City</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@healthyrx.com</p>
        </div>
        
        <div className={styles.section}>
          <h3>Quick Links</h3>
          <Link href="/about">About Us</Link>
          <Link href="/services">Services</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2024 HealthyRx Pharmacy. All rights reserved.</p>
      </div>
    </footer>
  );
}

