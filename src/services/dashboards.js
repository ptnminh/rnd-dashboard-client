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
};
