import axios from 'axios';

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
// const BACKEND_URL = `http://localhost:8000}`;

export const getAllCategories = async (token) => {
  return await axios.get(`${BACKEND_URL}/api/v2/categories`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCategoryById = async (id, token) => {
  return await axios.get(`${BACKEND_URL}/api/v2/categories/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCategory = async (data, token) => {
  return await axios.post(`${BACKEND_URL}/api/v2/categories/`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCategory = async (id, data, token) => {
  return await axios.put(`${BACKEND_URL}/api/v2/categories/${id}`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCategory = async (id, token) => {
  return await axios.delete(`${BACKEND_URL}/api/v2/categories/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
