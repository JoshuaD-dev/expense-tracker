import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-a3qb.onrender.com",
  withCredentials: true,
});

export default api;