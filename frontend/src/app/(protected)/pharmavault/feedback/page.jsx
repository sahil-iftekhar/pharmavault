'use client';
import { useState, useActionState, startTransition } from 'react';
import { createFeedback } from '@/actions/feedback';
import styles from './page.module.css';

export default function Feedback() {
  const [formData, setFormData] = useState({
    message: '',
    rating: 5,
  });
  const [state, action] = useActionState(createFeedback, { error: null });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    startTransition(() => {
        try {
            action(formData);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    });
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <button onClick={() => setSubmitted(false)}>Submit Another Feedback</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Feedback Form</h1>
      <p className={styles.subtitle}>We value your feedback to improve our services</p>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message">Your Feedback</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
          ></textarea>
        </div>
        
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

