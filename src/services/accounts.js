import { filter, isEmpty, keys } from "lodash";
import { hostAPI, LOCAL_STORAGE_KEY } from "../constant";
import axios from "axios";
import { showNotification } from "../utils/index";
axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
)}`;
export const accountServices = {
  fetchAllAccounts: async ({ query, page, limit }) => {
    try {
      let url = `${hostAPI}/accounts?page=${page}&pageSize=${limit}`;
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
  updateAccount: async (data) => {
    try {
      const { id, ...payload } = data;
      const response = await axios.put(`${hostAPI}/accounts/${id}`, payload);
      const { data: result } = response;
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
            "red"
          );
        } else {
          showNotification("Lỗi", "Cập nhật thất bại", "red");
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
      console.log("Error at updateAccount:", error);
      return false;
    }
  },
};
