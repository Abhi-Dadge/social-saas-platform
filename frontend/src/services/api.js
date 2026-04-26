import axios from "axios";

const API = axios.create({
  baseURL: "https://social-saas-backend.onrender.com"
});

export default API;