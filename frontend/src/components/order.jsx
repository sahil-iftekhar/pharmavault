'use client';

import { useState } from 'react';
import styles from './OrderList.module.css';

export default function OrderList({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);

  const handlePayment = async (orderId) => {
    // Here you would typically make an API call to process the payment
    console.log(`Processing payment for order ${orderId}`);
    // Update the order status
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'paid' } : order
    ));
  };

  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <div key={order.id} className={styles.orderItem}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Delivery Date: {order.deliveryDate}</p>
          <p>Delivery Type: {order.deliveryType}</p>
          <ul>
            {order.medicines.map(med => (
              <li key={med.id}>{med.name} - Quantity: {med.quantity}</li>
            ))}
          </ul>
          {order.status === 'accepted' && (
            <button onClick={() => handlePayment(order.id)} className={styles.payButton}>
              Pay Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}



