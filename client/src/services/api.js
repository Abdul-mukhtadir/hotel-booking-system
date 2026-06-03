import axios from "axios";

const API = axios.create({
  baseURL: "https://your-render-url.onrender.com/api",
});

export default API;