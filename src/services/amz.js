import { filter, isEmpty, keys, omit } from "lodash";
import axios from "axios";
import { AMZ_URL } from "../constant";

export const amzServices = {
  fetchSaleMetrics: async ({ query, page, limit, sorting }) => {
    try {
      let url = `${AMZ_URL}/sales-metrics?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      const emptyKeys = filter(queryKeys, (key) => !query[key]);
      let queryParams = {};
      let sortingParams = {};
      if (!isEmpty(transformedQuery)) {
        queryParams = {
          ...omit(query, emptyKeys),
        };
      }
      if (!isEmpty(sorting)) {
        sortingParams = {
          sortBy: sorting[0].id,
          sortDir: sorting[0].desc ? "desc" : "asc",
        };
      }
      const response = await axios.get(url, {
        params: {
          ...queryParams,
          ...sortingParams,
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
  fetchSurvivalModeSaleMetrics: async ({ query, page, limit, sorting }) => {
    try {
      let url = `${AMZ_URL}/sales-metrics/survival-mode?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      const emptyKeys = filter(queryKeys, (key) => !query[key]);
      let queryParams = {};
      let sortingParams = {};
      if (!isEmpty(transformedQuery)) {
        queryParams = {
          ...omit(query, emptyKeys),
        };
      }
      if (!isEmpty(sorting)) {
        sortingParams = {
          sortBy: sorting[0].id,
          sortDir: sorting[0].desc ? "desc" : "asc",
        };
      }
      const response = await axios.get(url, {
        params: {
          ...queryParams,
          ...sortingParams,
        },
      });
      const { data: result } = response;
      if (result?.success === "false" || result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchSurvivalModeSaleMetrics:", error);
      return false;
    }
  },
  handleUpdateAMZDashboard: async (sku, data) => {
    try {
      const url = `${AMZ_URL}/asins/${sku}`;
      const response = await axios.put(url, data);
      const { data: result } = response;
      if (result?.success === "false" || result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at handleUpdateAMZDashboard:", error);
      return false;
    }
  }
};
