import Link from 'next/link';
import styles from './navbar.module.css';
import { LogoutButton } from '@/components/Button/button';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/pharmavault">HealthyRx Pharmacy</Link>
      </div>
      <div className={styles.links}>
        <Link href="/pharmavault">Home</Link>
        <Link href="/pharmavault/medicine">Medicines</Link>
        <Link href="/contact">Contact</Link>
        <LogoutButton />
      </div>
    </nav>
  );
};

