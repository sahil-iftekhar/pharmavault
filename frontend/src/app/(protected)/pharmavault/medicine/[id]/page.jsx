'use client';
import { useActionState } from 'react';
import { patchCartItems } from '@/actions/cart';
import { useEffect, startTransition } from 'react';
import { fetchMedicine } from '@/actions/medicine';
import { AddToCartButton } from '@/components/Button/button';
import { use } from 'react';
import styles from './page.module.css';
import { useRef } from 'react';


export default function Medicine({ params }) {
  const { id } = use(params);
  const [state, action] = useActionState(fetchMedicine, { medicine: [id], error: null });
  const [cartItems, patchAction] = useActionState(patchCartItems, { error: null });
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

  const addToCart = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get the form data
    const quantity = formData.get('quantity'); // Extract the quantity

    console.log(`Added product ${id} to cart with quantity ${quantity}`);

    // Call the patch action with the form data
    startTransition(() => {
      try {
        patchAction({ id, quantity });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });
  };

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
            <form onSubmit={addToCart}>
              <input type="hidden" name="quantity" value="1" required/>
              <AddToCartButton />
            </form>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

