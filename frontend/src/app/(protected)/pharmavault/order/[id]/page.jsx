'use client';

import { use, useState, useEffect, useActionState, startTransition } from 'react';
import { CancelOrderButton, AcceptOrderButton, RejectOrderButton, DeliveredOrderButton } from '@/components/Button/button';
import { userRole } from '@/actions/login';
import { useRouter } from 'next/navigation';
import { fetchOrder, removeOrder, patchOrderItems } from '@/actions/order'; // Import your fetchOrder function
import { fetchMedicineById } from '@/actions/medicine'; // Import your fetchMedicineById function
import styles from './page.module.css';

export default function OrderDetails({ params }) {
  const { id } = use(params); // Directly destructure params
  const [order, setOrder] = useState(null);
  const [medicines, setMedicines] = useState([]); // State to hold medicine details
  const [isEmployee, setIsEmployee] = useState(false);
  const [cancelOrder, setCancelOrder] = useActionState(removeOrder, { error: null });
  const [patchOrder, setPatchOrder] = useActionState(patchOrderItems, { error: null });
  const router = useRouter();

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      const { order, error } = await fetchOrder(id); // Fetch order using the API

      if (error) {
        console.error(error);
        // Handle error (e.g., show a notification)
        return;
      }

      setOrder(order); // Set the fetched order
      const result = await userRole();
      setIsEmployee(result === 'Employee'); // Check if the user is an employee

      // Fetch medicine details for each medicine in the order
      const medicineDetails = await Promise.all(
        order.medicines.map(async (med) => {
          const { medicine, error } = await fetchMedicineById(med.medicine); // Fetch medicine by ID
          if (error) {
            console.error(error);
            return null; // Handle error as needed
          }
          return { ...medicine, quantity: med.quantity }; // Merge medicine data with quantity
        })
      );

      setMedicines(medicineDetails.filter(Boolean)); // Filter out any null values
    };

    fetchOrderDetails();
  }, [id]);

  const cancelOrderHandler = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get the form data

    console.log(`Updating Cart`);

    const order_id = order.id

    // Call the patch action with the form data
    startTransition(() => {
      try {
        setCancelOrder({ order_id });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });

    router.push('/pharmavault/order');
  };

  const acceptOrderHandler = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get the form data

    console.log(`Updating Cart`);

    const order_id = order.id
    const status = 'accepted'

    // Call the patch action with the form data
    startTransition(() => {
      try {
        setPatchOrder({ order_id, status });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });

    router.push('/pharmavault/order');
  };

  const rejectOrderHandler = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get the form data

    console.log(`Updating Cart`);

    const order_id = order.id
    const status = 'rejected'

    // Call the patch action with the form data
    startTransition(() => {
      try {
        setPatchOrder({ order_id, status });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });

    router.push('/pharmavault/order');
  };

  const deliveredOrderHandler = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Get the form data

    console.log(`Updating Cart`);

    const order_id = order.id
    const status = 'delivered'

    // Call the patch action with the form data
    startTransition(() => {
      try {
        setPatchOrder({ order_id, status });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });

    router.push('/pharmavault/order');
  };

  const handleCheckout = async () => {
    // In a real app, you'd implement the checkout logic here
    console.log('Proceeding to checkout');
    router.push('/pharamavault/checkout');
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Order #{order.id}</h1>
      <div className={styles.orderDetails}>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Delivery Date:</strong> {order.delivery_date}</p>
        <p><strong>Delivery Type:</strong> {order.delivery_type}</p>
        <h2>Medicines</h2>
        <ul className={styles.medicineList}>
          {medicines.map(medicine => (
            <li key={medicine.id} className={styles.medicineItem}>
              <span>{medicine.name}</span>
              <span>Quantity: {medicine.quantity}</span>
              <span>${medicine.price}</span>
            </li>
          ))}
        </ul>
        <p className={styles.total}><strong>Total:</strong> ${medicines.reduce((total, med) => total + (med.price * med.quantity), 0).toFixed(2)}</p>
        <div className={styles.prescriptionImage}>
          {order.prescription_images && order.prescription_images.length > 0 && (
            <>
              <h2>Prescription</h2>
              <img src={order.prescription_images[0].image} alt="Prescription" />
            </>
          )}
        </div>
        <div className={styles.orderActions}></div>
          {!isEmployee && order.status === 'pending' && (
            <form onSubmit={cancelOrderHandler}>
              <CancelOrderButton />
            </form>
          )}
          {isEmployee && order.status === 'pending' && (
            <>
              <form onSubmit={acceptOrderHandler}>
                <AcceptOrderButton />
              </form>
              <form onSubmit={rejectOrderHandler}>
                <RejectOrderButton />
              </form>
            </>
          )}
          {console.log("isEmployee", isEmployee)}
          {isEmployee && (order.status === 'accepted') && (
            <form onSubmit={deliveredOrderHandler}>
              <DeliveredOrderButton />
            </form>
          )}
        </div>
        {!isEmployee && order.status === 'accepted' && (
          <button onClick={handleCheckout} className={styles.checkoutButton}>Proceed to Checkout</button>
        )}
    </div>
  );
}

