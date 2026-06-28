import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Normalize MongoDB task document for frontend use.
 */
const normalizeTask = (task) => ({
  ...task,
  id: task._id ?? task.id,
});

/**
 * Extract error message from Axios error response.
 */
const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  return error.message || "Something went wrong";
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getErrorMessage(error);
    return Promise.reject(error);
  }
);

/**
 * Fetch tasks with optional search, filter, and sort query params.
 */
export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  const tasks = response.data?.data ?? [];
  return tasks.map(normalizeTask);
};

/**
 * Fetch a single task by ID.
 */
export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return normalizeTask(response.data?.data);
};

/**
 * Create a new task.
 */
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", {
    ...taskData,
    dueDate: taskData.dueDate || undefined,
  });
  return normalizeTask(response.data?.data);
};

/**
 * Update an existing task.
 */
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, {
    ...taskData,
    dueDate: taskData.dueDate || null,
  });
  return normalizeTask(response.data?.data);
};

/**
 * Delete a task by ID.
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;
