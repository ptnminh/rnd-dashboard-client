import { showNotification } from "../utils/index";
import { filter, isEmpty, keys, omit } from "lodash";
import apiClient from "./axiosClient";

export const artistServices = {
  createArtistBrief: async (payload) => {
    try {
      const { data: result } = await apiClient.post(
        `/art-briefs/create-batch`,
        payload
      );
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
            result?.message || "Tạo brief thất bại",
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
  fetchArtistTask: async ({ page, limit, query, view }) => {
    try {
      let url = `/art-briefs?page=${page}&pageSize=${limit}&view=${view}`;
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
  update: async ({ uid, data }) => {
    try {
      const { data: result } = await apiClient.put(
        `/art-briefs/${uid}/art`,
        data
      );
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Cập nhật brief thất bại",
          "red"
        );
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at updateBrief:", error);
      showNotification("Thất bại", "Cập nhật brief thất bại", "red");
      return false;
    }
  },
};
