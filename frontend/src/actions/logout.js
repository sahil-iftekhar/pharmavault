'use server';

import { logout } from '@/libs/api';
import { redirect } from 'next/navigation';

export async function logoutUser() {
  try {
    await logout();
    redirect('/auth/login');
  } catch (error) {
    console.error("Logout successful:", error);
    throw error;
  }
}
