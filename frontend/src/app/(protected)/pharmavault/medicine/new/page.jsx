'use client';

import { useActionState, useEffect } from 'react';
import { createMedicine } from '@/actions/medicine';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AddMedicineButton } from '@/components/Button/button';

export default function AddMedicine() {
  const [state, formAction] = useActionState(createMedicine, { status: null, error: null, error_data: null });
  const router = useRouter();

  useEffect(() => {
    if (state.status === 200) {
      router.push('/pharmavault/medicine');
    }
  }, [state.status, router]); 

  return (
    <div className={styles.container}>
      <h1>Add New Medicine</h1>
      <form action={formAction} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
          />
          {state.error_data && state.error_data.name && <span className={styles.error_data}>{state.error_data.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            required
          />
          {state.error_data && state.error_data.description && <span className={styles.error_data}>{state.error_data.description}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            required
          />
          {state.error_data && state.error_data.price && <span className={styles.error_data}>{state.error_data.price}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            required
          />
          {state.error_data && state.error_data.stock && <span className={styles.error_data}>{state.error_data.stock}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="expiry_date">Expiry Date:</label>
          <input
            type="date"
            id="expiry_date"
            name="expiry_date"
            required
          />
          {state.error_data && state.error_data.expiry_date && <span className={styles.error_data}>{state.error_data.expiry_date}</span>}
        </div>

        <AddMedicineButton />
        {state.error && <span className={styles.error_data}>{state.error}</span>}
      </form>
    </div>
  );
}