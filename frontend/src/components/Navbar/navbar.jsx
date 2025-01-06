import { cookies } from 'next/headers';
import Link from 'next/link';
import styles from './navbar.module.css';
import { LogoutButton } from '@/components/Button/button';

export default async function Navbar() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;
  console.log(userRole);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/pharmavault">Pharmavault</Link>
      </div>
      <div className={styles.links}>
        <Link href="/pharmavault">Home</Link>
        <Link href="/pharmavault/medicine">Medicines</Link>
        <Link href="/pharmavault/order">Order</Link>
        {userRole === 'Customer' && <Link href="/pharmavault/cart">Cart</Link>}
        <LogoutButton />
      </div>
    </nav>
  );
};

