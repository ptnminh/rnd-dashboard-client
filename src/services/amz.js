import { filter, isEmpty, keys, omit } from "lodash";
import axios from "axios";
import { AMZ_URL } from "../constant";

export const amzServices = {
  fetchSaleMetrics: async ({ query, page, limit }) => {
    try {
      let url = `${AMZ_URL}/sales-metrics?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      const emptyKeys = filter(queryKeys, (key) => !query[key]);
      let queryString = {};
      if (!isEmpty(transformedQuery)) {
        queryString = {
          ...omit(query, emptyKeys),
        };
      }
      const response = await axios.get(url, {
        params: {
          ...queryString,
        },
      });
      const { data: result } = response;
      if (result?.success === "false" || result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchSaleMetrics:", error);
      return false;
    }
  },
};
