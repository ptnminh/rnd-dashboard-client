import { filter, isEmpty, keys } from "lodash";
import { hostAPI } from "../constant";
import axios from "axios";

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
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at updateAccount:", error);
      return false;
    }
  },
};
