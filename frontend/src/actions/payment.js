'use server';
import { postPayment } from "@/libs/api";


export async function createPayment(prevState, formData) {
  const data = {
    payment_method: formData.paymentMethod,
  }
  try {
    const response = await postPayment(data);
    console.log('response', response);
    if (response.status === 400) {
      console.log("Order creation failed");
      return {
        errors: "Failed to create order. Please try again later."
      };
    } else {
      console.log("Order created successfully");
      return {
        status: 200,
      }
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user. Please try again later." };
  };
};
