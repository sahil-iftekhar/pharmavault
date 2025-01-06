'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './order.module.css';

export default function Order() {
  const [medicines, setMedicines] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryType, setDeliveryType] = useState('once');
  const [prescription, setPrescription] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMedicines = async () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      // Here you would typically fetch the medicine details from your API
      // For this example, we'll use dummy data
      const dummyMedicines = cartItems.map(id => ({
        id,
        name: `Medicine ${id}`,
        price: 9.99,
        quantity: 1
      }));
      setMedicines(dummyMedicines);
    };

    fetchMedicines();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, quantity: Math.max(1, newQuantity) } : med
    ));
  };

  const handleRemove = (id) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    setPrescription(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you would typically submit the order to your API
    console.log('Order submitted', { medicines, deliveryDate, deliveryType, prescription });
    // Clear the cart
    localStorage.removeItem('cartItems');
    // Redirect to the cart page
    router.push('/cart');
  };

  return (
    <div className={styles.container}>
      <h1>Place Your Order</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deliveryType">Delivery Type:</label>
          <select
            id="deliveryType"
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <option value="once">Once</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <h2>Medicines</h2>
        {medicines.map(med => (
          <div key={med.id} className={styles.medicineItem}>
            <span>{med.name}</span>
            <span>${med.price.toFixed(2)}</span>
            <input
              type="number"
              value={med.quantity}
              onChange={(e) => handleQuantityChange(med.id, parseInt(e.target.value))}
              min="1"
            />
            <button type="button" onClick={() => handleRemove(med.id)}>Remove</button>
          </div>
        ))}

        <div className={styles.formGroup}>
          <label htmlFor="prescription">Upload Prescription:</label>
          <input
            type="file"
            id="prescription"
            accept="image/*"
            onChange={handlePrescriptionUpload}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Place Order</button>
      </form>
    </div>
  );
}
