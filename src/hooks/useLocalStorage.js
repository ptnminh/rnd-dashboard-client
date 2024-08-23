import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LOCAL_STORAGE_KEY } from "../constant/localStorage";

export const useLocalStorage = ({ key, defaultValue, expiryInMinutes }) => {
  const { getAccessTokenSilently } = useAuth0(); // Access Auth0 hook

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);

        // Check if the stored item is expired
        if (parsedItem.expiry && new Date(parsedItem.expiry) > new Date()) {
          return parsedItem.value;
        } else if (key === LOCAL_STORAGE_KEY.ACCESS_TOKEN) {
          // If the key is "token" and it's expired, we should refresh the token
          return refreshToken();
        } else {
          localStorage.removeItem(key); // Remove expired item
        }
      }
      return defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  });

  const refreshToken = async () => {
    try {
      console.log(`Refreshing token for key: ${key}`);
      // Use Auth0's silent token refresh
      const newAccessToken = await getAccessTokenSilently();

      // Save the new token in localStorage with the expiry
      const now = new Date();
      const expiryTime = new Date(
        now.getTime() + (expiryInMinutes || 5) * 60000
      ); // Calculate expiry time

      const tokenToStore = {
        value: newAccessToken,
        expiry: expiryTime,
      };

      localStorage.setItem(key, JSON.stringify(tokenToStore));
      setStoredValue(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return defaultValue; // return defaultValue if token refresh fails
    }
  };

  const setValue = (value) => {
    try {
      const now = new Date();
      const expiryTime = new Date(
        now.getTime() + (expiryInMinutes || 5) * 60000
      ); // Calculate expiry time
      const valueToStore = {
        value,
        expiry: expiryTime,
      };
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const clearValue = () => {
    try {
      localStorage.removeItem(key); // Remove from localStorage
      setStoredValue(defaultValue); // Reset to default value
    } catch (error) {
      console.error(error);
    }
  };

  // Optionally refresh token when the component mounts
  useEffect(() => {
    if (key === LOCAL_STORAGE_KEY.ACCESS_TOKEN) {
      const tokenData = JSON.parse(localStorage.getItem(key));
      if (tokenData?.expiry && new Date(tokenData.expiry) <= new Date()) {
        refreshToken(); // Refresh the token if it's expired
      }
    }
  }, [key]); // Run when `key` changes

  return [storedValue, setValue, clearValue];
};
