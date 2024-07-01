import axios from "axios";
import { isEmpty } from "lodash";
import { hostAPI } from "../constant";
export const portfolioServices = {
  syncPortfolio: async ({ store, prefix, stores }) => {
    try {
      const response = await axios.post(`${hostAPI}/api/portfolios/sync`, {
        store,
        prefix,
        stores,
      });
      const { data: result } = response;
      return isEmpty(result?.data) ? false : result?.data;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
  findProductLine: async ({ store, productLine, stores }) => {
    try {
      const response = await axios.post(
        `${hostAPI}/api/portfolios/find-product-line`,
        {
          store,
          productLine,
          stores,
        }
      );
      const { data: result } = response;
      return isEmpty(result?.data) ? false : result?.data;
    } catch (error) {
      console.log("Error at findProductLine:", error);
      return false;
    }
  },
};
