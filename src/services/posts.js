import { filter, isEmpty, keys } from "lodash";
import { showNotification } from "../utils/index";
import apiClient from "./axiosClient";

export const postService = {
  fetchFanpages: async ({ limit = 10, page = 1, query = {}, sorting = {} }) => {
    try {
      let url = `/pages?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.keyword && { keyword: query.keyword }),
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
  createPost: async (data) => {
    try {
      const response = await apiClient.post(`/posts/batch`, {
        payloads: data,
      });
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo post thất bại", "red");
      }
      return result;
    } catch (error) {
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      }
      console.log("Error at createPost:", error);
      return false;
    }
  },
  fetchPosts: async ({ limit = 10, page = 1, query = {}, sorting = {} }) => {
    try {
      let url = `/posts?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.keyword && { keyword: query.keyword }),
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
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      }
      console.log("Error at fetchPosts:", error);
      return false;
    }
  },
  updatePost: async (id, data) => {
    try {
      const response = await apiClient.put(`/posts/${id}`, data);
      const { data: result } = response;
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
            "red"
          );
        } else {
          showNotification(
            "Thất bại",
            result?.message || "Cập nhật thất bại",
            "red"
          );
        }

        return false;
      }
      return result;
    } catch (error) {
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      }
      console.log("Error at updatePost:", error);
      return false;
    }
  },
};
