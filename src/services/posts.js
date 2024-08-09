import { filter, isEmpty, keys } from "lodash";
import { hostAPI } from "../constant";
import axios from "axios";
import { showNotification } from "../utils/index";

export const postService = {
  fetchFanpages: async ({ limit = 10, page = 1, query = {}, sorting = {} }) => {
    try {
      let url = `${hostAPI}/pages?page=${page}&pageSize=${limit}`;
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
      const response = await axios.get(url);
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
      const response = await axios.post(`${hostAPI}/posts/batch`, {
        payloads: data,
      });
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", result?.message, "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at createPost:", error);
      return false;
    }
  },
  fetchPosts: async ({ limit = 10, page = 1, query = {}, sorting = {} }) => {
    try {
      let url = `${hostAPI}/posts?page=${page}&pageSize=${limit}`;
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
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchPosts:", error);
      return false;
    }
  },
  updatePost: async (id, data) => {
    try {
      const response = await axios.put(`${hostAPI}/posts/${id}`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Cập nhật thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at updatePost:", error);
      return false;
    }
  },
};
