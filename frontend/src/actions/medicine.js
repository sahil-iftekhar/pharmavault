'use server';

import { getMedicines, getMedicine, postMedicine, patchMedicine, deleteMedicine } from '@/libs/api';

export const fetchMedicines = async () => {
  try {
    const medicines = await getMedicines();

    if (medicines.status === 404) {
      return { error: "Failed to fetch medicines. Please try again later." };
    }
    console.log("medicines", medicines);
    return { medicines };
  } catch (error) {
    console.error("Failed to fetch medicines:", error);
    return { error: "Failed to fetch medicines. Please try again later." };
  };
};

export const fetchMedicine = async (value) => {
  console.log(value);
  try {
    const medicine = await getMedicine(value.medicine);
    if (medicine.status === 404) {
      return { error: "Failed to fetch medicines. Please try again later." };
    }
    console.log("medicine", medicine);
    return { medicine };
  } catch (error) {
    console.error("Failed to fetch medicine:", error);
    return { error: "Failed to fetch medicine. Please try again later." };
  };
};

export const fetchMedicineById = async (id) => {
  console.log(id);
  try {
    const medicine = await getMedicine(id);
    if (medicine.status === 404) {
      return { error: "Failed to fetch medicines. Please try again later." };
    }
    console.log("medicine", medicine);
    return { medicine };
  } catch (error) {
    console.error("Failed to fetch medicine:", error);
    return { error: "Failed to fetch medicine. Please try again later." };
  };
};

export const createMedicine = async (prevState, formData) => {

  let error_data = {};

  if (!formData.get('price') || isNaN(parseFloat(formData.get('price'))) || parseFloat(formData.get('price')) <= 0) {
    error_data.price = 'Price must be a positive number';
  }
  if (!formData.get('stock') || !Number.isInteger(Number(formData.get('stock'))) || Number(formData.get('stock')) < 0) {
    error_data.stock = 'Stock must be a non-negative integer';
  }

  if (Object.keys(error_data).length > 0) {
    return {
      status: null,
      error: "Error creating medicine",
      error_data: error_data
    }
  }

  const medicine = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    expiry_date: formData.get('expiry_date')
  };

  try {
    const response = await postMedicine(medicine);
    console.log("response", response);

    if (response.status) {
      console.log("Medicine creation failed")
      return {
        status: null,
        error: 'Failed to create medicine or medicine already exists. Please try again later.',
        error_data: null
      };
    } else {
      console.log("Medicine created successfully")
      return {
        status: 200,
        error: null,
        error_data: null
      };
    }
  } catch (error) {
    console.error("Failed to create medicine:", error);
    return {
      status: null,
      error: "Failed to create medicine or medicine already exists. Please try again later.",
      error_data: null
    };
  }
};

export const updateMedicine = async ({ id, stock }) => {
  console.log(`Updating medicine with ID: ${id}, New Stock: ${stock}`);
  const data = { stock };

  try {
    const response = await patchMedicine(id, data); // Ensure you pass the ID to the patch function
    console.log("response", response);

    if (response.status) {
      console.log("Medicine update failed");
      return { error: 'Failed to update medicine. Please try again later.' };
    } else {
      console.log("Medicine updated successfully");
      return { error: null };
    }
  } catch (error) {
    console.error("Failed to update medicine:", error);
    return { error: "Failed to update medicine. Please try again later." };
  }
}

export const removeMedicine = async (id) => {
  try {
    const response = await deleteMedicine(id);
    if (response.status) {
      console.log("Medicine deletion failed");
      return { error: 'Failed to delete medicine. Please try again later.' };
    } else {
      console.log("Medicine deleted successfully");
      return { error: null };
    }
  } catch (error) {
    console.error("Failed to delete medicine:", error);
    return { error: "Failed to delete medicine. Please try again later." };
  }
}