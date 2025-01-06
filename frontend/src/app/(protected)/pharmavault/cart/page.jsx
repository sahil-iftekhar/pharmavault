'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pain Relief Tablets',
      price: 9.99,
      quantity: 2,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Vitamin C Supplements',
      price: 14.99,
      quantity: 1,
      image: '/placeholder.svg'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/pharmavault/medicine'}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                
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
      )}
    </div>
  );
}
