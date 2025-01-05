'use server';
import { DEFAULT_LOGIN_REDIRECT } from '@/route';
import { createUser } from '@/libs/api';
import { revalidatePath } from 'next/cache';


export async function createNewUser(prevState, formData) {
  console.log("Triggered loginUser");
  let email = formData.get('email');
  let name = formData.get('name');
  let phone = formData.get('phone');
  let address = formData.get('address');
  let password = formData.get('password');
  let confirm_password = formData.get('confirm_password');

  let error_data = {};

  // Validation checks
  if (email === '' || !email.includes('@')) {
    error_data.email = 'Email is required and must contain @ symbol.';
  };

  if (name === '') {
    error_data.name = 'Name is required.';
  };

  if (phone === '' || phone.length !== 14) {
    error_data.phone = 'Phone number must contain country code.';
  };

  if (address === '') {
    error_data.address = 'Address is required.';
  };

  if (password === '') {
    error_data.password = 'Password is required.';
  };

  if (confirm_password === '') {
    error_data.confirm_password = 'Confirm password is required.';
  };

  if (password !== confirm_password) {
    return {
      errors: 'Passwords do not match.'
    }
  };

  // Return errors if validation fails
  if (Object.keys(error_data).length > 0) {
    return {
      errors: "Required fields missing",
      error_data: error_data
    };
  };
  
  const user_data = {
    email: email,
    name: name,
    phone: phone,
    address: address,
    password: password
  };

  try {
    const response = await createUser(user_data);
    console.log(response);
    
    if (response.status !== 200) {
      console.log("User creation failed");
      return {
        errors: "Email or phone number taken"
      };
    } else {
      console.log("Login successful");
      revalidatePath(DEFAULT_LOGIN_REDIRECT);
      return {
        status: 200
      };
    }
  } catch (error) {
    console.error("User creation failed:", error);
    return {
      errors: "Failed to create user."
    };
  };
};