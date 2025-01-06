'use server';

import { getUserById, updateUser, deleteUser } from "@/libs/api";

export async function getProfile() {
  try {
    const response = await getUserById();
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { error: "Failed to fetch profile. Please try again later." };
  }
}

export async function updateProfile(prevState, formData) {
  console.log('formData', formData);
  try {
    const response = await updateUser(formData);
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile. Please try again later." };
  }
}

export async function deleteProfile() {
  try {
    const response = await deleteUser();

    if (response.status) {
      console.error("Error deleting profile:", response.error);
      return { error: "Failed to delete profile. Please try again later." };
    }
    return response;
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { error: "Failed to delete profile. Please try again later." };
  }
}