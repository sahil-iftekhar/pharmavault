'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './CartItems.module.css';

export default function CartItems({ items: initialItems }) {
  const [cartItems, setCartItems] = useState(initialItems);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    // Here you would typically make an API call to update the quantity
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = async (id) => {
    // Here you would typically make an API call to remove the item
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>Your cart is empty</p>
        <Link href="/products" className={styles.continueShoppingButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.cartItems}>
        {cartItems.map(item => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.name} width={80} height={80} />
            <div className={styles.itemDetails}>
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className={styles.quantity}>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p className={styles.subtotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button 
              className={styles.removeButton}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className={styles.cartSummary}>
        <h2>Cart Summary</h2>
        <div className={styles.summaryDetails}>
          <div>
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className={styles.total}>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <Link href="/checkout" className={styles.checkoutButton}>
          Proceed to Checkout
        </Link>
      </div>
    </>
  );
}

