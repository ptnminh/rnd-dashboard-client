import axios from "axios";
import { hostAPI } from "../constant";
import { isEmpty } from "lodash";

export const campaignServices = {
  createCamps: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/api/campaigns/v2/create`, {
        data,
      });
      const { data: result } = response;
      return isEmpty(result?.data) ? false : result?.data;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
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
};
