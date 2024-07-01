import axios from "axios";
import { hostAPI } from "../constant";
export const keywordServices = {
  createTemplateKeyword: async ({ name, keywords }) => {
    try {
      const response = await axios.post(
        `${hostAPI}/api/keywords/create-template-keyword`,
        {
          name,
          keywords,
        }
      );
      const { data: result } = response;
      return result;
    } catch (error) {
      console.log("Error at createTemplateKeyword:", error);
      return error;
    }
  },
  getTemplatesKeyword: async ({ search, page, isTakeAll = false }) => {
    try {
      const response = await axios.post(`${hostAPI}/api/keywords/templates`, {
        search,
        page,
        isTakeAll,
      });
      const { data: result } = response;
      return result;
    } catch (error) {
      console.log("Error at getTemplatesKeyword:", error);
      return error;
    }
  },
  createNewKeywordInTemplate: async ({ name, keywords, newName }) => {
    const response = await axios.post(
      `${hostAPI}/api/keywords/update-keyword-template`,
      {
        name,
        keywords,
        newName,
      }
    );
    const { data: result } = response;
    return result;
  },
  deleteTemplateKeyword: async ({ names }) => {
    const response = await axios.post(
      `${hostAPI}/api/keywords/delete-keyword-templates`,
      {
        names,
      }
    );
    const { data: result } = response;
    return result;
  },
};
