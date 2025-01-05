'use server'

import { getMedicines, getMedicine } from '@/libs/api';

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
