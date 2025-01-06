'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, deleteProfile } from '@/actions/profile';
import { logoutUser } from '@/actions/logout';
import styles from './page.module.css';

const initialState = {
  error: null,
  success: null,
};

export default function Profile() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
  });
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      if (profileData.error) {
        setState({ ...state, error: profileData.error });
      } else {
        setFormData(profileData); // Assuming profileData has the same structure as formData
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target; // Get the form element
    console.log('form:', form);
    const formData = new FormData(form); // Create FormData from the form
    console.log('Form Data:', formData);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Check if passwords match
    if (password !== confirmPassword) {
      setState({ ...state, error: "Passwords do not match." });
      return;
    }

    const updatedData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      ...(password && { password }), // Include password only if it's provided
    };

    console.log('Updated Data:', updatedData);

    setPending(true);
    const response = await updateProfile(null, updatedData); // Pass null for prevState if not needed
    setPending(false);

    if (response.error) {
      setState({ ...state, error: response.error });
    } else {
      setState({ ...state, success: 'Profile updated successfully!' });
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await deleteProfile();
    if (response.error) {
      setState({ ...state, error: response.error });
    }
    await logoutUser(); // This will redirect to the login page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={formData.email} // Use defaultValue instead of value
            disabled
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={formData.name} // Use defaultValue instead of value
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={formData.phone} // Use defaultValue instead of value
            className={styles.input}
            placeholder="+88019xxxxxxxx"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Address:</label>
          <textarea
            id="address"
            name="address"
            defaultValue={formData.address} // Use defaultValue instead of value
            className={styles.textarea}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? 'Updating...' : 'Update Profile'}
        </button>
        <br />
        <br />
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete Profile
        </button>
      </form>
      {state.error && <p className={styles.error}>{state.error}</p>}
      {state.success && <p className={styles.success}>{state.success}</p>}
    </div>
  );
}

