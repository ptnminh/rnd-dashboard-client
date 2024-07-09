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
  getUsers: async ({ page, limit, search }) => {
    try {
      let query = "";
      if (search) {
        query = `&pageSize=${limit}`;
      }
      if (page) {
        query = `${query}&page=${page}`;
      }
      if (limit) {
        query = `${query}&search=${search}`;
      }
      const url = query ? `${hostAPI}/users?${query}` : `${hostAPI}/users`;
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy user", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at getUsers:", error);
      showNotification("Thất bại", "Không tìm thấy user", "red");
      return false;
    }
  },
  createBriefs: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/briefs/create-batch`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo brief thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Tạo brief thành công", "green");
      return true;
    } catch (error) {
      console.log("Error at createBriefs:", error);
      showNotification("Thất bại", "Tạo brief thất bại", "red");
      return false;
    }
  },
  fetchBriefs: async ({
    page,
    limit,
    search,
    batch,
    sku,
    briefType,
    size,
    rndTeam,
    rnd,
    designer,
    status,
    date,
    view = "design",
  }) => {
    try {
      const filter = {
        ...(search && { search }),
        ...(batch && { batch }),
        ...(sku && { sku }),
        ...(briefType && { briefType }),
        ...(size && { size }),
        ...(rndTeam && { rndTeam }),
        ...(rnd && { rnd }),
        ...(designer && { designer }),
        ...(status && { status }),
        ...(date && { startDate: date.startDate, endDate: date.endDate }),
      };
      let url = `${hostAPI}/briefs?page=${page}&pageSize=${limit}&view=${view}`;
      if (Object.keys(filter).length !== 0) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`;
        url = `${url}&${queryString}`;
      }

      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        // showNotification("Thất bại", "Không tìm thấy brief", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchBriefs:", error);
      // showNotification("Thất bại", "Không tìm thấy brief", "red");
      return false;
    }
  },
  updateBrief: async ({ uid, data }) => {
    try {
      const response = await axios.put(`${hostAPI}/briefs/${uid}`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Cập nhật brief thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at updateBrief:", error);
      showNotification("Thất bại", "Cập nhật brief thất bại", "red");
      return false;
    }
  },
  deleteBrief: async (uid) => {
    try {
      const response = await axios.put(`${hostAPI}/briefs/delete/${uid}`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Xóa brief thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at deleteBrief:", error);
      showNotification("Thất bại", "Xóa brief thất bại", "red");
      return false;
    }
  },
};
