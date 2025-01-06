'use server';

import { getCart, patchCart, putCart } from '@/libs/api';


export const fetchCartItems = async () => {
  try {
    let cart = await getCart();
    if (cart.status) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    cart = cart[0]
    console.log('cart', cart);
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

export const putCartItems = async (prevState, formData) => {
  console.log('formData', formData);
  const form_medicines = formData.medicines
  try {
    const cart = await getCart();
    if (cart.status) {
      return { error: "Failed to fetch cart items. Please try again later." };
    };

    let cart_obj = {
      medicines : []
    }

    for (const form_medicine of form_medicines) {
      cart_obj.medicines.push({
        medicine: form_medicine.medicine.id,
        quantity: form_medicine.quantity
      })
    }

    const updatedCart = await putCart(cart[0].id, cart_obj);
    if (updatedCart.status) {
      return { error: "Failed to update cart items. Please try again later." };
    };

    return { cart: updatedCart };
  } catch (error) {
    console.error("Error updating cart items:", error);
    return { error: "Failed to update cart items. Please try again later." };
  };
};