import axios from "axios";
import { hostAPI } from "../constant";
import { showNotification } from "../utils/index";
export const rndServices = {
  searchProducts: async (SKU) => {
    try {
      const response = await axios.get(`${hostAPI}/products/search/${SKU}`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy SKU", "red");
        return false;
      }
      return result.data;
    } catch (error) {
      console.log("Error at searchProducts:", error);
      showNotification("Thất bại", "Không tìm thấy SKU", "red");
      return false;
    }
  },
  getCollections: async ({ page, limit, search }) => {
    try {
      const response = await axios.get(
        `${hostAPI}/collections?page=${page}&limit=${limit}&search=${search}`
      );
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy collection", "red");
        return false;
      }
      return result.data;
    } catch (error) {
      console.log("Error at getCollections:", error);
      showNotification("Thất bại", "Không tìm thấy collection", "red");
      return false;
    }
  },
};
