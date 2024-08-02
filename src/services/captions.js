import axios from "axios";
import { hostAPI } from "../constant";
import { showNotification } from "../utils/index";
import { filter, isEmpty, keys } from "lodash";

export const captionServices = {
  createCaption: async (payload) => {
    try {
      const { data: result } = await axios.post(`${hostAPI}/captions`, payload);
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchQuotes:", error);
      showNotification("Thất bại", "Tạo caption thất bại", "red");
      return false;
    }
  },
  fetchCaptions: async ({ page, limit, query }) => {
    try {
      let url = `${hostAPI}/captions?page=${page}&pageSize=${limit}`;
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
  removeCaption: async (id) => {
    try {
      const { data: result } = await axios.delete(`${hostAPI}/captions/${id}`);
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at removeCaption:", error);
      return false;
    }
  },
};
