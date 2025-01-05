'use client';
import { useActionState } from 'react';
import { useEffect, startTransition } from 'react';
import { fetchMedicine } from '@/actions/medicine';
import { use } from 'react';
import styles from './page.module.css';
import { useRef } from 'react';


export default function Medicine({ params }) {
  const { id } = use(params);
  const [state, action] = useActionState(fetchMedicine, { medicine: [id], error: null });
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched.current) { // Check if data has already been fetched
        hasFetched.current = true; // Set the flag to true
        startTransition(() => {
          try {
            action(state); // Trigger the server action to fetch the medicines
          } catch (error) {
            console.error("Error fetching medicines:", error);
          }
        });
      }
    };

    fetchData();
  }, [action]); // Dependencies array includes action

  return (
    <div className={styles.container}>
      <h1>Medicine</h1>
      {state.medicine && state.medicine.id &&
      <div className={styles.productGrid}>
        <div key={state.medicine.id} className={styles.productCard}>
          <div className={styles.productInfo}>
            <h3>{state.medicine.name}</h3>
            <p className={styles.description}>{state.medicine.description}</p>
            <p className={styles.description}>Stock: {state.medicine.stock}</p>
            <p className={styles.price}>{state.medicine.expiry_date}</p>
            <p className={styles.price}>${state.medicine.price}</p>
            <button 
              className={styles.addToCart}
              onClick={() => addToCart(state.medicine.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

