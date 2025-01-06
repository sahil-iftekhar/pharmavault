'use server';

import { getCart, patchCart, putCart } from '@/libs/api';


export const fetchCartItems = async () => {
  try {
    const cart = await getCart();
    if (cart.status) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    return { cart };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items. Please try again later." };
  };
};

export const patchCartItems = async (prevState, formData) => {
  const medicineId = formData.id
  const quantity = formData.quantity
  try {
    const cart = await getCart();
    console.log('cart', cart);
    if (cart.status) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    let cart_obj = {
      medicines : [
        {
          medicine: medicineId,
          quantity: quantity
        }
      ]
    }

    const updatedCart = await patchCart(cart[0].id, cart_obj);
    if (updatedCart.status) {
      return { error: "Failed to update cart items. Please try again later." };
    };

    return { cart: updatedCart };
  } catch (error) {
    console.error("Error updating cart items:", error);
    return { error: "Failed to update cart items. Please try again later." };
  };
};

// export const putCartItems = async (value) => {
//   try {
//     const cart = await getCart();
//     if (cart.status) {
//       return { error: "Failed to fetch cart items. Please try again later." };
//     };

//     const updatedCart = await putCart(cart.id, value.medicine);
//     if (updatedCart.status) {
//       return { error: "Failed to update cart items. Please try again later." };
//     };

//     return { cart: updatedCart };
//   } catch (error) {
//     console.error("Error updating cart items:", error);
//     return { error: "Failed to update cart items. Please try again later." };
//   };
// };