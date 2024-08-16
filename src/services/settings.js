import { filter, isEmpty, keys } from "lodash";
import { hostAPI, LOCAL_STORAGE_KEY } from "../constant";
import axios from "axios";
import { showNotification } from "../utils/index";
axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
)}`;
export const settingServices = {
  fetchSettings: async ({ limit = 10, page = 1, query = {}, view }) => {
    try {
      let url = `${hostAPI}/settings`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.keyword && { keyword: query.keyword }),
          })
        )}`;
        url = `${url}?${queryString}`;
      }
      const response = await axios.get(url, {
        params: {
          ...(page && { page }),
          ...(limit && { limit }),
          ...(view && { view }),
        },
      });
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchSettings:", error);
      return false;
    }
  },
  fetchSetting: async ({ identifier }) => {
    try {
      let url = `${hostAPI}/settings/${identifier}`;
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchSetting:", error);
      return false;
    }
  },
  updateSetting: async ({ uid, data }) => {
    try {
      let url = `${hostAPI}/settings/${uid}`;
      const response = await axios.put(url, data);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchSetting:", error);
      return false;
    }
  },
  createSetting: async (data) => {
    try {
      let url = `${hostAPI}/settings`;
      const response = await axios.post(url, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo setting thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Tạo setting thành công", "green");
      return result;
    } catch (error) {
      console.log("Error at fetchSetting:", error);
      return false;
    }
  },
};
