import { filter, isEmpty, keys, omit } from "lodash";
import apiClient from "./axiosClient";
import { showNotification } from "../utils/index";

export const dashboardServices = {
  fetchDashboardsSetting: async ({ page, limit, query }) => {
    try {
      let url = `/times?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchDashboardsSetting:", error);
      return false;
    }
  },
  createNewWeek: async (payload) => {
    try {
      const { data: result } = await apiClient.post(`/quotas`, payload);
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Tạo mới thất bại",
          "red"
        );
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
        showNotification("Thất bại", "Tạo mới thất bại", "red");
      }
      return false;
    }
  },
  fetchQuotas: async ({ page, limit, query }) => {
    try {
      let url = `/quotas?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchDefaultQuota:", error);
      return false;
    }
  },
  fetchQuotasMonth: async ({ page, limit, query }) => {
    try {
      let url = `/quotas/month?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchDefaultQuota:", error);
      return false;
    }
  },
  updateQuota: async ({ uid, data }) => {
    try {
      const { data: result } = await apiClient.put(`/quotas/${uid}`, data);
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
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      } else {
        console.log("Error at fetchQuotes:", error);
        showNotification("Thất bại", "Cập nhật thất bại", "red");
      }
      return false;
    }
  },
  update: async ({ uid, data }) => {
    try {
      const { data: result } = await apiClient.put(`/times/${uid}`, data);
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
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      } else {
        console.log("Error at fetchQuotes:", error);
        showNotification("Thất bại", "Cập nhật thất bại", "red");
      }
      return false;
    }
  },
  fetchDefaultQuota: async ({ page, limit, query }) => {
    try {
      let url = `/default-quotas?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchDefaultQuota:", error);
      return false;
    }
  },
  updateDefaultQuota: async ({ uid, data }) => {
    try {
      const { data: result } = await apiClient.put(
        `/default-quotas/${uid}`,
        data
      );
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
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      } else {
        console.log("Error at fetchQuotes:", error);
        showNotification("Thất bại", "Cập nhật thất bại", "red");
      }
      return false;
    }
  },
  fetchDefaultQuotaDemand: async ({ page, limit, query }) => {
    try {
      let url = `/default-quotas-demands?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchDefaultQuotaDemand:", error);
      return false;
    }
  },
  updateDefaultDemandQuota: async ({ uid, data }) => {
    try {
      const { data: result } = await apiClient.put(
        `/default-quotas-demands/${uid}`,
        data
      );
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
      const code = error?.response?.data?.code;
      if (code === 403) {
        showNotification(
          "Thất bại",
          "Bạn không có quyền thực hiện hành động này",
          "red"
        );
      } else {
        console.log("Error at fetchQuotes:", error);
        showNotification("Thất bại", "Cập nhật thất bại", "red");
      }
      return false;
    }
  },
  fetchPODSKUMetrics: async ({ query, page, limit, sorting }) => {
    try {
      let url = `/sku-reports?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchSaleMetrics:", error);
      return false;
    }
  },
};
