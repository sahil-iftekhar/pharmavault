'use client';
import { useState, useActionState } from 'react';
import { userRole } from '@/actions/login';
import { useEffect, startTransition } from 'react';
import Link from 'next/link';
import { fetchMedicines } from '@/actions/medicine';
import { ViewDetailsButton, NewMedicineButton } from '@/components/Button/button';
import styles from './page.module.css';
import { useRef } from 'react';

export default function Medicine() {
  const [state, action] = useActionState(fetchMedicines, { medicines: [], error: null });
  const [isEmployee, setIsEmployee] = useState(false);
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

      const result = await userRole();
      setIsEmployee(result === 'Employee' || result === 'Supplier'); 
    };

    fetchData();
  }, [action]);

  return (
    <div className={styles.container}>
      <h1>Our Medicines</h1>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div>
        {isEmployee && (
          <Link href="/pharmavault/medicine/new" passHref>
            <NewMedicineButton />
          </Link>
        )}
      </div>
      <br />
      {!state.medicines && !state.error && <p className={styles.loading}>Loading...</p>}

      <div className={styles.productGrid}>
        {state.medicines && state.medicines.map(product => (
          <div key={product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.price}>${product.price}</p>
                <Link href={`/pharmavault/medicine/${product.id}`} passHref>
                  <ViewDetailsButton />
                </Link>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
