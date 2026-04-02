import axios from "axios";

// ⚠️ IMPORTANT: Use your computer IP, not localhost
const BASE_URL = "http://192.168.0.100:5000"; 

export const api = axios.create({
  baseURL: BASE_URL,
});