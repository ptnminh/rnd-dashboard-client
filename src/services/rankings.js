import { filter, isEmpty, keys, omit } from "lodash";
import apiClient from "./axiosClient";
import { showNotification } from "../utils/index";

export const rankingServices = {
  fetchRankingMetrics: async ({ query, page, limit, sorting }) => {
    try {
      let url = `/product-rankings?page=${page}&pageSize=${limit}`;
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
      const response = await apiClient.get(url, {
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
      console.log("Error at fetchRankingMetrics:", error);
      return false;
    }
  },
  updateRanking: async ({ id, data }) => {
    try {
      const url = `/product-rankings/${id}`;
      const response = await apiClient.put(url, data);
      const { data: result } = response;
      if (result?.success === "false" || result?.success === false) {
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
      console.log("Error at updateRanking:", error);
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
  fetchCompetitors: async () => {
    try {
      const url = "/product-rankings/competitors";
      const response = await apiClient.get(url);
      const { data: result } = response;
      if (result?.success === "false" || result?.success === false) {
        return false;
      }
      return result?.data;
    } catch (error) {
      console.log("Error at fetchCompetitors:", error);
      return false;
    }
  },
};
