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
      let query = "";
      if (search) {
        query = `&search=${search}`;
      }
      if (page) {
        query = `${query}&page=${page}`;
      }
      if (limit) {
        query = `${query}&pageSize=${limit}`;
      }
      const url = query
        ? `${hostAPI}/collections?${query}`
        : `${hostAPI}/collections`;
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy collection", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at getCollections:", error);
      showNotification("Thất bại", "Không tìm thấy collection", "red");
      return false;
    }
  },
  getAllProducts: async ({ page, limit, search, isTakeAll }) => {
    try {
      let query = "";
      if (search) {
        query = `&search=${search}`;
      }
      if (page) {
        query = `${query}&page=${page}`;
      }
      if (limit) {
        query = `${query}&pageSize=${limit}`;
      }
      let url = query ? `${hostAPI}/products?${query}` : `${hostAPI}/products`;
      if (isTakeAll) {
        url = `${hostAPI}/products?pageSize=-1`;
      }
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy product", "red");
        return false;
      }
      return result?.data;
    } catch (error) {
      console.log("Error at getAllProducts:", error);
      showNotification("Thất bại", "Không tìm thấy product", "red");
      return false;
    }
  },
};
