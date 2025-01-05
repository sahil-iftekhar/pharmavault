'use client';
import { useActionState } from 'react';
import { useEffect, startTransition } from 'react';
import Link from 'next/link';
import { fetchMedicines } from '@/actions/medicine';
import styles from './page.module.css';
import { useRef } from 'react';

export default function Medicine() {
  const [state, action] = useActionState(fetchMedicines, { medicines: [], error: null });
  const hasFetched = useRef(false); // Use a ref to track if data has been fetched

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched.current) { // Check if data has already been fetched
        hasFetched.current = true; // Set the flag to true
        startTransition(() => {
          try {
            action(); // Trigger the server action to fetch the medicines
          } catch (error) {
            console.error("Error fetching medicines:", error);
          }
        });
      }
    };

    fetchData();
  }, [action]);

  return (
    <div className={styles.container}>
      <h1>Our Medicines</h1>

      {state.error && <p className={styles.error}>{state.error}</p>}

      {!state.medicines && !state.error && <p className={styles.loading}>Loading...</p>}

      <div className={styles.productGrid}>
        {state.medicines && state.medicines.map(product => (
          <div key={product.id} className={styles.productCard}>
            <Link href={`/pharmavault/medicine/${product.id}`} passHref>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.price}>${product.price}</p>
                <button className={styles.addToCart}>Add to Cart</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
