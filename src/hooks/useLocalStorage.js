import { useState } from "react";

export const useLocalStorage = ({ key, defaultValue, expiryInMinutes }) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        // Check if the stored item is expired
        if (parsedItem.expiry && new Date(parsedItem.expiry) > new Date()) {
          return parsedItem.value;
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

  return [storedValue, setValue, clearValue];
};
