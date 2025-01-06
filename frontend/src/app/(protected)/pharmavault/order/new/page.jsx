'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function NewOrder() {
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryType: 'once',
    medicines: [],
    prescriptionImage: null
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddMedicine = () => {
    setFormData(prevState => ({
      ...prevState,
      medicines: [...prevState.medicines, { id: Date.now(), name: '', quantity: 1 }]
    }));
  };

  const handleMedicineChange = (id, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      medicines: prevState.medicines.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleRemoveMedicine = (id) => {
    setFormData(prevState => ({
      ...prevState,
      medicines: prevState.medicines.filter(med => med.id !== id)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      prescriptionImage: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your API
    console.log('Submitting order:', formData);
    router.push('/orders');
  };

  return (
    <div className={styles.container}>
      <h1>New Order</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="deliveryType">Delivery Type:</label>
          <select
            id="deliveryType"
            name="deliveryType"
            value={formData.deliveryType}
            onChange={handleInputChange}
          >
            <option value="once">Once</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className={styles.medicinesSection}>
          <h2>Medicines</h2>
          {formData.medicines.map(medicine => (
            <div key={medicine.id} className={styles.medicineItem}>
              <input
                type="text"
                placeholder="Medicine Name"
                value={medicine.name}
                onChange={(e) => handleMedicineChange(medicine.id, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                value={medicine.quantity}
                onChange={(e) => handleMedicineChange(medicine.id, 'quantity', parseInt(e.target.value))}
                required
              />
              <button type="button" onClick={() => handleRemoveMedicine(medicine.id)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddMedicine} className={styles.addMedicineButton}>Add Medicine</button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="prescriptionImage">Upload Prescription:</label>
          <input
            type="file"
            id="prescriptionImage"
            name="prescriptionImage"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Place Order</button>
      </form>
    </div>
  );
}

