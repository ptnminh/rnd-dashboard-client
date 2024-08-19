import { showNotification } from "../utils/index";
import apiClient from "./axiosClient";

export const userServices = {
  fetchUsers: async ({ page, limit, query }) => {
    try {
      return []
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return false;
    }
  },
  createUser: async (data) => {
    try {
      const response = await apiClient.post(`/users`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo người dùng thất bại", "red");
        return false;
      }
      return result;
    } catch (error) {
      const message = error?.response?.data?.message
      showNotification("Thất bại", message || "Tạo người dùng thất bại", "red");
      console.error("Failed to create user:", error);
      return false
    }
  }
};
