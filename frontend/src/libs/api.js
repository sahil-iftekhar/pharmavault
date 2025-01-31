import { fetchClient, fetchClientForm } from "./fetchClient";
import { cookies } from 'next/headers';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (credentials) => {
  try {
    const response = await fetchClient(`${API_BASE_URL}/login/`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.access && response.refresh && response.user_role) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', response.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('refreshToken', response.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('userRole', response.user_role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('userId', response.user_id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    };

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials.");
  };
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');
};

export async function userId() {
  const cookieStore = await cookies();
  return cookieStore.get('userId')?.value;
}

export const refreshToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    await logout();
    throw new Error("Refresh token not found.");
  };

  try {
    const response = await fetchClient(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.access && response.refresh) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', response.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('refreshToken', response.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    };

    return response;
  } catch (error) {
    console.error("Refresh token failed:", error);
    await logout();
    throw new Error("Refresh token failed.");
  };
};

export const getUserById = async () => {
  const id = await userId();
  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const createUser = async (user) => {
  const response = await fetchClient(`${API_BASE_URL}/customers/`, {
    method: "POST",
    body: JSON.stringify(user),
  });

  console.log("response", response);
  return response;
};

export const updateUser = async (user) => {
  const id = await userId();
  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(user),
  });

  console.log("response", response);
  return response;
};

export const deleteUser = async () => {
  const id = await userId();
  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "DELETE",
  });

  console.log("response", response);
  return response;
}

export const getMedicines = async() => {
  const response = await fetchClient(`${API_BASE_URL}/medicines/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const getMedicine = async(id) => {
  const response = await fetchClient(`${API_BASE_URL}/medicines/${id}/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const postMedicine = async(medicine) => {
  const response = await fetchClient(`${API_BASE_URL}/medicines/`, {
    method: "POST",
    body: JSON.stringify(medicine),
  });

  console.log("response", response);
  return response;
};

export const patchMedicine = async(id, data) => {
  const response = await fetchClient(`${API_BASE_URL}/medicines/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const deleteMedicine = async(id) => {
  const response = await fetchClient(`${API_BASE_URL}/medicines/${id}/`, {
    method: "DELETE",
  });

  console.log("response", response);
  return response;
};

export const getCart = async() => {
  const response = await fetchClient(`${API_BASE_URL}/carts/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const patchCart = async(id, data) => {
  const response = await fetchClient(`${API_BASE_URL}/carts/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const putCart = async(id, data) => {
  const response = await fetchClient(`${API_BASE_URL}/carts/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const getOrders = async() => {
  const response = await fetchClient(`${API_BASE_URL}/orders/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const getOrder = async(id) => {
  const response = await fetchClient(`${API_BASE_URL}/orders/${id}/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const createOrder = async(data) => {
  const response = await fetchClient(`${API_BASE_URL}/orders/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const patchOrder = async(id, data) => {
  const response = await fetchClient(`${API_BASE_URL}/orders/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const deleteOrder = async(id) => {
  const response = await fetchClient(`${API_BASE_URL}/orders/${id}/`, {
    method: "DELETE",
  }); 

  console.log("response", response);
  return response;
};

export const postPayment = async(data) => {
  const response = await fetchClient(`${API_BASE_URL}/payments/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const postFeedback = async(data) => {
  const response = await fetchClient(`${API_BASE_URL}/feedbacks/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("response", response);
  return response;
};

export const getFeedbacks = async() => {
  const response = await fetchClient(`${API_BASE_URL}/feedbacks/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};