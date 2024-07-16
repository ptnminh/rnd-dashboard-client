import axios from "axios";
import { hostAPI } from "../constant";

export const uploadServices = {
  upload: async (file, fileName = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fileName) {
        formData.append("fileName", fileName);
      }
      const response = await axios.post(`${hostAPI}/uploads`, formData);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
