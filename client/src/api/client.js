import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',withCredentials:true,headers:{'Content-Type':'application/json'}});
export const getErrorMessage=(error,fallback='Something went wrong. Please try again.')=>error?.response?.data?.message||error?.message||fallback;
export default api;
