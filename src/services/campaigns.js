import axios from "axios";
import { hostAPI, LOCAL_STORAGE_KEY } from "../constant";
import { filter, isEmpty, keys, omit, pick, reduce } from "lodash";
import { showNotification } from "../utils/index";
axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
)}`;
export const campaignServices = {
  createCamps: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/campaigns/batch`, data);
      const { data: result } = response;
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
            result?.message || "Tạo Campaign thất bại",
            "red"
          );
        }

        return result;
      }
      return result;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
  fetchCampaigns: async ({ page, limit, query, sorting }) => {
    try {
      let url = `${hostAPI}/campaigns?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      const sort = reduce(
        sorting,
        (acc, item) => {
          acc[item.id] = item.desc ? "desc" : "asc";
          return acc;
        },
        {}
      );
      if (!isEmpty(transformedQuery)) {
        let pickQuery = pick(query, transformedQuery);
        pickQuery = omit(pickQuery, ["statusValue", "valueName", "dateValue"]);
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...pickQuery,
          })
        )}`;
        url = `${url}&${queryString}`;
      }
      if (!isEmpty(sort)) {
        const sortString = `sort=${encodeURIComponent(JSON.stringify(sort))}`;
        url = `${url}&${sortString}`;
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
  createCampaign: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/sample-campaigns`, data);
      const { data: result } = response;
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
            "red"
          );
        }
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at createCampaign:", error);
      return false;
    }
  },
  fetchSampleCampaigns: async ({ query, page, limit }) => {
    try {
      let url = `${hostAPI}/sample-campaigns?page=${page}&pageSize=${limit}`;
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
      console.log("Error at fetchSampleCampaigns:", error);
      return false;
    }
  },
  deleteSampleCampaign: async (id) => {
    try {
      const response = await axios.delete(`${hostAPI}/sample-campaigns/${id}`);
      const { data: result } = response;
      if (result?.success === false) {
        if (result?.code === 403) {
          showNotification(
            "Thất bại",
            "Bạn không có quyền thực hiện hành động này",
            "red"
          );
        }
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at deleteSampleCampaign:", error);
      return false;
    }
  },
};
