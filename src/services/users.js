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
      const response = await apiClient.post(`/users/auth0`, data);
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
  },
  fetchRoles: async () => {
    try {
      const response = await apiClient.get(`/roles`);
      const { data: result } = response;
      return result;
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      return false;
    }
  }
};
