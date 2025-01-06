'use client';
import { useEffect, useState, useActionState, startTransition } from 'react';
import { fetchCartItems, putCartItems } from '@/actions/cart';
import { fetchMedicineById } from '@/actions/medicine';
import { SaveCartButton } from '@/components/Button/button';
import Link from 'next/link';
import styles from './page.module.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState(null); // State for cart items
  const [saveCartItems, putAction] = useActionState(putCartItems, { error: null });
  const [medicines, setMedicines] = useState([]); // State for detailed medicines
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart items from the server
        const fetchedCart = await fetchCartItems();
        
        // Check if the cart was fetched successfully
        if (fetchedCart.error) {
          console.error(fetchedCart.error);
          return; // Handle the error as needed
        }

        // Set the cart items state
        setCartItems(fetchedCart.cart); // Set the cart object

        // Fetch medicines based on the cart items
        const fetchedMedicines = await Promise.all(
          fetchedCart.cart.medicines.map(async (item) => {
            const medicineData = await fetchMedicineById(item.medicine); // Fetch medicine by ID
            return { ...medicineData, quantity: item.quantity }; // Merge medicine data with quantity
          })
        );

        console.log("fetchedMedicines", fetchedMedicines);
        // Update medicines state with fetched data
        setMedicines(fetchedMedicines);
      } catch (error) {
        console.error("Error fetching cart or medicines:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    // Update medicines state
    setMedicines((prev) =>
      prev.map((item) => (item.medicine.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id) => {
    setMedicines((prev) => prev.filter((item) => item.medicine.id !== id));
  };

  const calculateTotal = () => {
    return medicines.reduce((total, item) => total + item.medicine.price * item.quantity, 0);
  };

  const addToCart = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('CartItems', cartItems);
    console.log('medicines', medicines);

    const formData = new FormData(event.target); // Get the form data

    console.log(`Updating Cart`);

    // Call the patch action with the form data
    startTransition(() => {
      try {
        putAction({ medicines });
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Loading state
  }

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>

      {!cartItems || medicines.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/pharmavault/medicine'}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {console.log("medicines", medicines)} 
            {medicines.map((item) => (
              <div key={item.medicine.id} className={styles.cartItem}>
                <div>
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.medicine.name}</h3>
                  <p>${item.medicine.price}</p>
                </div>
                <div className={styles.quantity}>
                  <button onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}>+</button>
                </div>
                <p className={styles.subtotal }>${(item.medicine.price * item.quantity).toFixed(2)}</p>
                <button className={styles.removeButton} onClick={() => removeItem(item.medicine.id)}>Remove</button>
              </div>
            ))}
            <form onSubmit={addToCart}>
              <input type="hidden" name="quantity" value="1" required/>
              <SaveCartButton />
            </form>
          </div>
          <div className={styles.total}>
            <h2>Total: ${calculateTotal().toFixed(2)}</h2>
            <Link href="/pharmavault/order/new">
              <button className={styles.checkoutButton}>Place Order</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};