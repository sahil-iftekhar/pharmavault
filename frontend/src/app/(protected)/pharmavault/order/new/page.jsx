'use client';

import { useState, useEffect, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCartItems } from '@/actions/cart'; 
import { postOrder } from '@/actions/order';
import { fetchMedicineById } from '@/actions/medicine';
import styles from './page.module.css';

export default function NewOrder() {
    const [formData, setFormData] = useState({
        deliveryDate: '',
        deliveryType: 'once',
        medicines: [],
        prescriptionImages: [] // Change to an array for multiple images
    });
    const router = useRouter();
    const [formattedMedicines, setFormattedMedicines] = useState([]);
    const [state, action] = useActionState(postOrder, { error: null });

    useEffect(() => {
        const loadCartItems = async () => {
            const { cart, error } = await fetchCartItems();
            if (error) {
                console.error(error);
                return;
            }

            // Fetch medicine details for each medicine in the cart
            const medicinesWithDetails = await Promise.all(
                cart.medicines.map(async (med) => {
                    const { medicine, error } = await fetchMedicineById(med.medicine);
                    if (error) {
                        console.error(error);
                        return null; // Handle error appropriately
                    }
                    return {
                        quantity: med.quantity,
                        name: medicine.name, // Assuming medicine.name is the correct name to display
                        id: medicine.id // Store the ID for submission
                    };
                })
            );

            // Filter out any null values in case of errors
            const validMedicines = medicinesWithDetails.filter(Boolean);
            const formMedicines = validMedicines.map(med => ({ quantity: med.quantity, medicine: med.id }));
            setFormData(prevState => ({ ...prevState, medicines: formMedicines }));
            console.log("validMedicines", validMedicines);;
            setFormattedMedicines(validMedicines);
        };

        loadCartItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevState => ({ ...prevState, prescriptionImages: files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the order object
        const orderData = new FormData();
        orderData.append('delivery_date', formData.deliveryDate);
        orderData.append('delivery_type', formData.deliveryType);
        
        // Append medicines
        formData.medicines.forEach(med => {
            orderData.append('medicines', JSON.stringify({
                quantity: med.quantity,
                medicine: med.id // Use the medicine ID for submission
            }));
        });

        // Append prescription images
        formData.prescriptionImages.forEach(image => {
            orderData.append('prescription_images', image);
        });
        // orderData.append('prescription_images', formData.prescriptionImages);

        // In a real app, you'd send this data to your API
        console.log('medicines', formData.medicines);
        // Here you would typically make an API call to submit the order
        // await submitOrder(orderData);
        startTransition(() => {
          try {
            action(formData);
          } catch (error) {
            console.error("Error fetching medicines:", error);
          }
        });

        router.push('/pharmavault/checkout');
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
                    {formattedMedicines.map((medicine , index) => (
                        <div key={index} className={styles.medicineItem}>
                            <span>{medicine.name} - Quantity: {medicine.quantity}</span>
                        </div>
                    ))}
                </div>
                {/* <div className={styles.formGroup}>
                    <label htmlFor="prescriptionImages">Upload Prescription:</label>
                    <input
                        type="file"
                        id="prescriptionImages"
                        name="prescriptionImages"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div> */}
                <button type="submit" className={styles.submitButton}>Place Order</button>
            </form>
        </div>
    );
}

// 'use client';

// import { useState, useEffect, useActionState, startTransition } from 'react';
// import { useRouter } from 'next/navigation';
// import { fetchCartItems } from '@/actions/cart'; 
// import { postOrder } from '@/actions/order';
// import { fetchMedicineById } from '@/actions/medicine';
// import styles from './page.module.css';

// export default function NewOrder() {
//     const [formData, setFormData] = useState({
//         deliveryDate: '',
//         deliveryType: 'once',
//         medicines: [],
//         prescriptionImages: [] // Change to an array for multiple images
//     });
//     const [formattedMedicines, setFormattedMedicines] = useState([]); // New state for formatted medicines
//     const router = useRouter();
//     const [state, action] = useActionState(postOrder, { error: null });

//     useEffect(() => {
//         const loadCartItems = async () => {
//             const { cart, error } = await fetchCartItems();
//             if (error) {
//                 console.error(error);
//                 return;
//             }

//             // Fetch medicine details for each medicine in the cart
//             const medicinesWithDetails = await Promise.all(
//                 cart.medicines.map(async (med) => {
//                     const { medicine, error } = await fetchMedicineById(med.medicine);
//                     if (error) {
//                         console.error(error);
//                         return null; // Handle error appropriately
//                     }
//                     return {
//                         quantity: med.quantity,
//                         name: medicine.name, // Assuming medicine.name is the correct name to display
//                         id: medicine.id // Store the ID for submission
//                     };
//                 })
//             );

//             // Filter out any null values in case of errors
//             const validMedicines = medicinesWithDetails.filter(Boolean);
//             setFormData(prevState => ({ ...prevState, medicines: validMedicines }));
//             setFormattedMedicines(validMedicines); // Set formatted medicines for display
//         };

//         loadCartItems();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({ ...prevState, [name]: value }));
//     };

//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         setFormData(prevState => ({ ...prevState, prescriptionImages: files }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Prepare the order object
//         const orderData = new FormData();
//         orderData.append('delivery_date', formData.deliveryDate);
//         orderData.append('delivery_type', formData.deliveryType);
        
//         // Append medicines in the required format
//         formattedMedicines.forEach(med => {
//             orderData.append('medicines', JSON.stringify({
//                 quantity: med.quantity,
//                 medicine: med.id // Use the medicine ID for submission
//             }));
//         });

//         // Append prescription images
//         formData.prescriptionImages.forEach(image => {
//             orderData.append('prescription_images', image);
//         });

//         // Call the action to create the order
//         startTransition(() => {
//             try {
//                 action(orderData);
//                 router.push('/orders'); // Redirect after successful submission
//             } catch (error) {
//                 console.error("Error creating order:", error);
//             }
//         });
//     };

//     return (
//         <div className={styles.container}>
//             <h1>New Order</h1>
//             <form onSubmit={handleSubmit} className={styles.form}>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="deliveryDate">Delivery Date:</label>
//                     <input
//                         type="date"
//                         id="deliveryDate"
//                         name="deliveryDate"
//                         value={formData.deliveryDate}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="deliveryType">Delivery Type:</label>
//                     <select
//                         id="deliveryType"
//                         name="deliveryType"
//                         value={formData.deliveryType}
//                         onChange={handleInputChange}
//                     >
//                         <option value="once">Once</option>
//                         <option value="weekly">Weekly</option>
//                         <option value="monthly">Monthly</option>
//                     </select>
//                 </div>
//                 <div className={styles.medicinesSection}>
//                     <h2>Medicines</h2>
//                     {formattedMedicines.map((medicine , index) => (
//                         <div key={index} className={styles.medicineItem}>
//                             <span>{medicine.name} - Quantity: {medicine.quantity}</span>
//                         </div>
//                     ))}
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="prescriptionImages">Upload Prescription:</label>
//                     <input
//                         type="file"
//                         id="prescriptionImages"
//                         name="prescriptionImages"
//                         accept="image/*"
//                         multiple // Allow multiple file uploads
//                         onChange={handleImageUpload}
//                     />
//                 </div>
//                 <button type="submit" className={styles.submitButton}>Place Order</button>
//             </form>
//         </div>
//     );
// }
