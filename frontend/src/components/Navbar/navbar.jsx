import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/pharmavault">HealthyRx Pharmacy</Link>
      </div>
      <div className={styles.links}>
        <Link href="/pharmavault">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/auth/login" className={styles.loginBtn}>Login</Link>
      </div>
    </nav>
  );
}

