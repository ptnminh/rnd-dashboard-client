import { showNotification } from "../utils/index";
import { filter, isEmpty, keys } from "lodash";
import apiClient from "./axiosClient";

export const captionServices = {
  createCaption: async (payload) => {
    try {
      const { data: result } = await apiClient.post(`/captions`, payload);
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
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
      } else {
        console.log("Error at fetchQuotes:", error);
        showNotification("Thất bại", "Tạo caption thất bại", "red");
      }
      return false;
    }
  },
  fetchCaptions: async ({ page, limit, query }) => {
    try {
      let url = `/captions?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.keyword && { keyword: query.keyword }),
            ...(query.productLineId && { productLineId: query.productLineId }),
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
  removeCaption: async (id) => {
    try {
      const { data: result } = await apiClient.delete(`/captions/${id}`);
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
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
      console.log("Error at removeCaption:", error);
      return false;
    }
  },
};
