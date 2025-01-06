'use client';
import { use, useActionState, useState } from 'react';
import { userRole } from '@/actions/login';
import { patchCartItems } from '@/actions/cart'; // Assuming deleteMedicine is defined
import { useEffect, startTransition } from 'react';
import { fetchMedicine, updateMedicine, removeMedicine } from '@/actions/medicine';
import { AddToCartButton, DeleteMedicineButton, UpdateMedicineButton } from '@/components/Button/button';
import styles from './page.module.css';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Medicine({ params }) {
  const { id } = use(params);
  const [state, action] = useActionState(fetchMedicine, { medicine: [id], error: null });
  const [cartItems, patchAction] = useActionState(patchCartItems, { error: null });
  const [isEmployee, setIsEmployee] = useState(false);
  const hasFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched.current) {
        hasFetched.current = true;
        startTransition(() => {
          try {
            action(state);
          } catch (error) {
            console.error("Error fetching medicines:", error);
          }
        });
      }

      const result = await userRole();
      setIsEmployee(result === 'Employee'); 
    };

    fetchData();
  }, [action]);

  const addToCart = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const quantity = formData.get('quantity');

    console.log(`Added product ${id} to cart with quantity ${quantity}`);

    startTransition(() => {
      try {
        patchAction({ id, quantity });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  };

  const updateStock = async (event) => {
    event.preventDefault();
    const updateformData = new FormData(event.target);
    const newStock = updateformData.get('stock');

    if (newStock <= 0) {
      console.log("Stock cannot be negative or zero.");
      return;
    }

    console.log(`Updating stock for product ${id} to ${newStock}`);

    try {
      await updateMedicine({ id, stock: newStock });
      router.push('/pharmavault/medicine');
      
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    console.log(`Deleting product ${id}`);

    try {
      await removeMedicine(id)
      router.push('/pharmavault/medicine');
    } catch (error) {
      console.error("Error deleting product:", error);
    }

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
            {!isEmployee && <form onSubmit={addToCart}>
              <input type="hidden" name="quantity" value="1" required/>
              <AddToCartButton />
            </form>}
          </div>
        </div>
      </div>
      }
      <br />
      {isEmployee && (
        <div>
          <h2>Update Stock</h2>
          <form onSubmit={updateStock}>
            <div className={styles.formGroup}>
              <label htmlFor="stock">New Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                defaultValue={state.medicine.stock}
                required
              />
            </div>
            <UpdateMedicineButton />
          </form>
          <br />
          <form onSubmit={handleDelete}>
            <DeleteMedicineButton />
          </form>
        </div>
      )}
    </div>
  );
}
