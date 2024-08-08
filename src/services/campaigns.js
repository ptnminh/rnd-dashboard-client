import axios from "axios";
import { hostAPI } from "../constant";
import { filter, isEmpty, keys, omit, pick } from "lodash";
import { showNotification } from "../utils/index";

export const campaignServices = {
  createCamps: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/campaigns/batch`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Tạo Campaign thất bại",
          "red"
        );

        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
  fetchCampaigns: async ({ page, limit, query }) => {
    try {
      let url = `${hostAPI}/campaigns?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
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
  getCampaignHistories: async ({ search, page }) => {
    try {
      const response = await axios.post(`${hostAPI}/api/campaigns/histories`, {
        search,
        page,
      });
      const { data: result } = response;
      return result;
    } catch (error) {
      console.log("Error at getCampaignHistories:", error);
      return false;
    }
  },
  duplicateCampaigns: async ({ campaignNames, stores }) => {
    try {
      const response = await axios.post(`${hostAPI}/api/campaigns/duplicate`, {
        campaignNames,
        stores,
      });
      const { data: result } = response;
      return result;
    } catch (error) {
      console.log("Error at duplicateCampaigns:", error);
      return false;
    }
  },
  getAvailableStores: async (skus) => {
    try {
      const response = await axios.post(
        `${hostAPI}/api/keywords/ready-keywords`,
        {
          skus,
        }
      );
      const { data: result } = response;
      return result.data;
    } catch (error) {
      console.log("Error at getAvailableStores:", error);
      return false;
    }
  },
  createCampaign: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/sample-campaigns`, data);
      const { data: result } = response;
      if (result?.success === false) {
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
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at deleteSampleCampaign:", error);
      return false;
    }
  },
};
