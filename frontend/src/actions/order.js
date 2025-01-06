'use server';

import { getOrders, getOrder, createOrder, patchOrder, deleteOrder } from '@/libs/api';
import { revalidatePath } from 'next/cache';


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

export const postOrder = async (prevState, formData) => {
  const order_obj = {
    delivery_date: formData.deliveryDate,
    delivery_type: formData.deliveryType,
    medicines: formData.medicines,
    prescription_images: formData.prescriptionImages
  }
  console.log('prescription_images', formData.prescriptionImages);
  try {
    console.log('formData', order_obj);
    const response = await createOrder(order_obj);
    console.log('response', response);
    if (response.status === 400) {
      console.log("Order creation failed");
      return {
        errors: "Failed to create order. Please try again later."
      };
    } else {
      console.log("Order created successfully");
      revalidatePath("/pharamavault/order");
      return {
        status: 200,
      }
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user. Please try again later." };
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