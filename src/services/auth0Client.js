import axios from "axios";
import { jwtDecode } from "jwt-decode"; // for decoding JWT tokens
import { AUTH0_MANAGEMENT_API, LOCAL_STORAGE_KEY } from "../constant";
import { authServices } from "./auth";

const apiClient = axios.create({
  baseURL: AUTH0_MANAGEMENT_API,
});

// Helper function to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
};

// Interceptor to add the token dynamically and refresh if expired
apiClient.interceptors.request.use(
  async (config) => {
    let token = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    );

    if (!token || isTokenExpired(token)) {
      try {
        // Token is missing or expired, refresh it
        const newToken = await authServices.refreshAuthToken();
        if (!newToken) {
          return config;
        }
        localStorage.setItem(
          LOCAL_STORAGE_KEY.MANAGEMENT_ACCESS_TOKEN,
          JSON.stringify(newToken)
        );
        token = newToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Optionally handle token refresh failure (e.g., redirect to login)
        return config;
      }
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
