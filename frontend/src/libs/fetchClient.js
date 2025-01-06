import { cookies } from 'next/headers';
import { refreshToken } from '@/libs/api';

export const fetchClient = async (url, options = {}) => {
  options.headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...options.headers,
  };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        return fetchClient(url, options);
      }
      console.error("Fetch error:", response);
      return response;
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  };
};

export const fetchClientForm = async (url, options = {}) => {
  options.headers = {
    "Content-Type": "multipart/form-data",
    ...options.headers,
  };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  };
  
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        return fetchClientForm(url, options);
      }
      console.error("Fetch error:", response);
      return response;
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  };
};