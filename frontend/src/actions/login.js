'use server';
import { DEFAULT_LOGIN_REDIRECT } from '@/route';
import { login } from '@/libs/api';
import { revalidatePath } from 'next/cache';


export async function loginUser(prevState, formData) {
  console.log("Triggered loginUser");
  let email = formData.get('email');
  let password = formData.get('password');

  if (email === '' || password === '') {
    return {
      errors: 'Email and password are required.'
    };
  };
  
  const credentials = {
    email: email,
    password: password
  }

  try {
    const response = await login(credentials);
    console.log(response);
    
    if (!response.access || !response.refresh || !response.user_role) {
      console.log("Login failed");
      return {
        errors: "Invalid credentials."
      };
    } else {
      console.log("Login successful");
      revalidatePath(DEFAULT_LOGIN_REDIRECT);
      return {
        status: 200
      };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return {
      errors: 'Invalid credentials.'
    }
  }
};