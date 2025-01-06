'use client';
import { useState, useActionState, startTransition } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { createPayment } from '@/actions/payment';

const steps = ['Shipping', 'Payment Method', 'Payment Details', 'Confirmation'];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, action] = useActionState(createPayment, { error: null });
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card', // Default to card
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {

      startTransition(() => {
        try {
          action(formData);
        } catch (error) {
          console.error("Error fetching medicines:", error);
        }
      });
      
      console.log('Order submitted:', formData);

      router.push('/pharmavault');
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <>
            <h2>Shipping Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2>Select Payment Method</h2>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ondelivery"
                  checked={formData.paymentMethod === 'ondelivery'}
                  onChange={handleChange}
                />
                On Delivery
              </label>
            </div>
          </>
        );
      case 2:
        if (formData.paymentMethod === 'ondelivery') {
          return (
            <>
              <h2>Order Confirmation</h2>
              <div className={styles.confirmationDetails}>
                <h3>Shipping Address:</h3>
                <p>{formData.fullName}</p>
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.zipCode}</p>
                <p>{formData.country}</p>
                
                <h3>Payment Method:</h3>
                <p>On Delivery</p>
              </div>
            </>
          );
        }
        return (
          <>
            <h2>Payment Details</h2>
            <div className={styles.formGroup}>
              <label htmlFor="cardName">Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2>Order Confirmation</h2>
            <div className={styles.confirmationDetails}>
              <h3>Shipping Address:</h3>
              <p>{formData.fullName}</p>
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.zipCode}</p>
              <p>{formData.country}</p>
              
              <h3>Payment Method:</h3>
              <p>{formData.paymentMethod === 'ondelivery' ? 'On Delivery' : `Card ending in ${formData.cardNumber.slice(-4)}`}</p>
              
              <h3>Order Summary:</h3>
              <p>Total: $XX.XX</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      
      <div className={styles.stepIndicator}>
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`${styles.step} ${index <= currentStep ? styles.active : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        {renderStepContent()}
        
        <div className={styles.buttons}>
          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className={styles.backButton}
            >
              Back
            </button>
          )}
          <button type="submit">
            {currentStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}
