import axios from "axios";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products`);
    return response.data.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
