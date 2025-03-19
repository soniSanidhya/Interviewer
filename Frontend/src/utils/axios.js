// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Replace with your API's base URL
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// GET request
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("GET error:", error.message);
    throw error;
  }
};

// POST request
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("POST error:", error.message);
    throw error;
  }
};

// PUT request
export const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("PUT error:", error.message);
    throw error;
  }
};

// DELETE request
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("DELETE error:", error.message);
    throw error;
  }
};

export default api;
