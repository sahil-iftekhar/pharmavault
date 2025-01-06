'use server';

import { getOrders, getOrder, createOrder, patchOrder, deleteOrder } from '@/libs/api';


export const fetchOrders = async () => {
  try {
    const orders = await getOrders();
    console.log('orders', orders);
    if (orders.status) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    return { orders };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items. Please try again later." };
  };
};

export const fetchOrder = async (orderId) => {
  try {
    const order = await getOrder(orderId);
    console.log('order', order);
    if (order.status === 404) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    return { order };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items. Please try again later." };
  };
};

export const removeOrder = async (prevState, formData) => {
  try {
    const order = await deleteOrder(formData.order_id);
    console.log('order', order);
    if (order.status !== 204) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    return { order };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items. Please try again later." };
  };
};

export const patchOrderItems = async (prevState, formData) => {
  try {
    const order_id = formData.order_id
    const status = formData.status

    if (status === 'delivered') {
      var data = {
        status,
        active: false
      }
    } else {
      var data = {
        status
      }
    }
    const order = await patchOrder(order_id, data);
    console.log('order', order);
    if (order.status !== 204) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    return { order };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items. Please try again later." };
  };
};

// export const patchCartItems = async (prevState, formData) => {
//   const medicineId = formData.id
//   const quantity = formData.quantity
//   try {
//     const cart = await getCart();
//     console.log('cart', cart);
//     if (cart.status) {
//       return { error: "Failed to fetch cart items. Please try again later." };
//     };

//     let cart_obj = {
//       medicines : [
//         {
//           medicine: medicineId,
//           quantity: quantity
//         }
//       ]
//     }

//     const updatedCart = await patchCart(cart[0].id, cart_obj);
//     if (updatedCart.status) {
//       return { error: "Failed to update cart items. Please try again later." };
//     };

//     return { cart: updatedCart };
//   } catch (error) {
//     console.error("Error updating cart items:", error);
//     return { error: "Failed to update cart items. Please try again later." };
//   };
// };

// export const putCartItems = async (prevState, formData) => {
//   console.log('formData', formData);
//   const form_medicines = formData.medicines
//   try {
//     const cart = await getCart();
//     if (cart.status) {
//       return { error: "Failed to fetch cart items. Please try again later." };
//     };

//     let cart_obj = {
//       medicines : []
//     }

//     for (const form_medicine of form_medicines) {
//       cart_obj.medicines.push({
//         medicine: form_medicine.medicine.id,
//         quantity: form_medicine.quantity
//       })
//     }

//     const updatedCart = await putCart(cart[0].id, cart_obj);
//     if (updatedCart.status) {
//       return { error: "Failed to update cart items. Please try again later." };
//     };

//     return { cart: updatedCart };
//   } catch (error) {
//     console.error("Error updating cart items:", error);
//     return { error: "Failed to update cart items. Please try again later." };
//   };
// };