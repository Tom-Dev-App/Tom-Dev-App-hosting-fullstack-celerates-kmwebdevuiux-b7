import axios from "axios";

async function getAllProductCategories() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v2/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}

export default getAllProductCategories;
