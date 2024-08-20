import { filter, isEmpty, keys, omit } from "lodash";
import { showNotification } from "../utils/index";
import apiClient from "./axiosClient";

export const userServices = {
  fetchUsers: async ({ page, limit, query }) => {
    try {
      let url = `/users?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      const emptyKeys = filter(queryKeys, (key) => !query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...omit(query, emptyKeys),
          })
        )}`;
        url = `${url}&${queryString}`;
      }
      const response = await apiClient.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchProductLines:", error);
      return false;
    }
  },
  createUser: async (data) => {
    try {
      const response = await apiClient.post(`/users/auth0`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Tạo người dùng thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      const message = error?.response?.data?.message;
      showNotification("Thất bại", message || "Tạo người dùng thất bại", "red");
      console.error("Failed to create user:", error);
      return false;
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
  },
  update: async ({ uid, data }) => {
    try {
      const response = await apiClient.put(`/users/auth0/${uid}`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Cập nhật người dùng thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      const message = error?.response?.data?.message;
      showNotification(
        "Thất bại",
        message || "Cập nhật người dùng thất bại",
        "red"
      );
      console.error("Failed to update user:", error);
      return false;
    }
  },
  resendEmailVerification: async (uid) => {
    try {
      const response = await apiClient.post(
        `/users/auth0/send-verification-email/${uid}`
      );
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Gửi lại email xác thực thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      const message = error?.response?.data?.message;
      showNotification(
        "Thất bại",
        message || "Gửi lại email xác thực thất bại",
        "red"
      );
      console.error("Failed to resend email verification:", error);
      return false;
    }
  },
  updatePassword: async ({ uid, data }) => {
    try {
      const response = await apiClient.put(
        `/users/auth0/update-password/${uid}`,
        data
      );
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Cập nhật mật khẩu thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      const message = error?.response?.data?.message;
      showNotification(
        "Thất bại",
        message || "Cập nhật mật khẩu thất bại",
        "red"
      );
      console.error("Failed to update password:", error);
      return false;
    }
  },
};
