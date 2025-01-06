'use server';
import { getFeedbacks, postFeedback } from "@/libs/api";


export async function createFeedback(prevState, formData) {
  const data = {
    name: formData.name,
    rating: formData.rating,
    feedback_text: formData.message,
  }

  console.log('data', data);
  try {
    const response = await postFeedback(data);
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
  }
}
  


