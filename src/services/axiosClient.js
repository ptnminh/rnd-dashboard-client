import axios from "axios";
import { hostAPI, LOCAL_STORAGE_KEY } from "../constant";

const apiClient = axios.create({
  baseURL: hostAPI,
});

// Interceptor to add the token dynamically
apiClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    );
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
