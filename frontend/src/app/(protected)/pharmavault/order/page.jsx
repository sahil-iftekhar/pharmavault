'use client';

import { useState, useEffect } from 'react';
import { userRole } from '@/actions/login';
import Link from 'next/link';
import { fetchOrders } from '@/actions/order'; // Import your fetchOrders function
import styles from './page.module.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      // Fetch orders from the server
      const { orders, error } = await fetchOrders();

      if (error) {
        console.error(error);
        // Handle error (e.g., show a notification)
        return;
      }

      setOrders(orders);
      const result = await userRole();
      setIsEmployee(result === 'Employee');
    };

    fetchOrderData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Orders</h1>
      <div className={styles.orderList}>
        {isEmployee && orders.map(order => (
          <div key={order.id} className={styles.orderItem}>
            <div className={styles.orderInfo}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Delivery Date: {order.delivery_date}</p>
            </div>
            <div className={styles.orderActions}>
              <Link href={`/pharmavault/order/${order.id}`} className={styles.viewButton}>View Details</Link>
            </div>
          </div>
        ))}
        {!isEmployee && orders.map(order => (
          <div key={order.id} className={styles.orderItem}>
            <div className={styles.orderInfo}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Delivery Date: {order.delivery_date}</p>
            </div>
            <div className={styles.orderActions}>
              <Link href={`/pharmavault/order/${order.id}`} className={styles.viewButton}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
