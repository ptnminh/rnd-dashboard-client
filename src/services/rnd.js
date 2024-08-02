import axios from "axios";
import { hostAPI } from "../constant";
import { showNotification } from "../utils/index";
import { filter, isEmpty, keys, map } from "lodash";
export const rndServices = {
  searchProducts: async (SKU) => {
    try {
      const response = await axios.get(`${hostAPI}/skus/search/${SKU}`);
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
        // showNotification("Thất bại", "Không tìm thấy collection", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at getCollections:", error);
      showNotification("Thất bại", "Không tìm thấy collection", "red");
      return false;
    }
  },
  deleteCollection: async (uid) => {
    try {
      const response = await axios.delete(`${hostAPI}/collections/${uid}`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Xóa collection thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at deleteCollection:", error);
      showNotification("Thất bại", "Xóa collection thất bại", "red");
      return false;
    }
  },
  getAllProducts: async ({ page, limit, search, isTakeAll, productName }) => {
    try {
      let query = "";
      if (page) {
        query = `${query}&page=${page}`;
      }
      if (limit) {
        query = `${query}&pageSize=${limit}`;
      }
      let url = query ? `${hostAPI}/skus?${query}` : `${hostAPI}/skus`;
      if (isTakeAll) {
        url = `${hostAPI}/skus?pageSize=-1`;
      }
      if (search || productName) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(search && { sku: search }),
            ...(productName && { keyword: productName }),
          })
        )}`;
        url = `${hostAPI}/skus?${query}&${queryString}`;
      }
      const response = await axios.get(url, {
        params: {
          fields: "sku",
        },
      });
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
  fetchSKUs: async ({
    page,
    limit,
    query,
    includeFields = "productInfo,nasLink",
    fields = "uid,sku,productLine",
  }) => {
    try {
      let url = `${hostAPI}/skus?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.keyword && { sku: query.keyword }),
            ...(query.productName && { productName: query.productName }),
          })
        )}`;
        url = `${url}&${queryString}`;
      }
      if (includeFields) {
        url = `${url}&includeFields=${includeFields}`;
      }
      const response = await axios.get(url, {
        params: {
          fields,
        },
      });
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchQuotes:", error);
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
  syncUser: async () => {
    try {
      const response = await axios.post(`${hostAPI}/users/sync-from-sheet`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Sync user thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Sync user thành công", "green");
      return true;
    } catch (error) {
      console.log("Error at syncUser:", error);
      showNotification("Thất bại", "Sync user thất bại", "red");
      return false;
    }
  },
  createBriefs: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/briefs/create-batch`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Tạo brief thất bại",
          "red"
        );
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
    epm,
    view = "design",
    sorting,
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
        ...(epm && { epm }),
      };
      const sort = !isEmpty(sorting)
        ? {
            [sorting[0].id === "date" || "time" ? "createdAt" : sorting.id]:
              sorting[0].id === "time"
                ? sorting[0].desc
                  ? "asc"
                  : "desc"
                : sorting[0].desc
                ? "desc"
                : "asc",
          }
        : {};
      let url = `${hostAPI}/briefs?page=${page}&pageSize=${limit}&view=${view}`;
      if (Object.keys(filter).length !== 0) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`;
        url = `${url}&${queryString}`;
      }
      if (Object.keys(sort).length !== 0) {
        const queryString = `sort=${encodeURIComponent(JSON.stringify(sort))}`;
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
  fetchFilters: async () => {
    try {
      const response = await axios.get(`${hostAPI}/libraries/clipart-filters`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Không tìm thấy filters", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchFilters:", error);
      showNotification("Thất bại", "Không tìm thấy filters", "red");
      return false;
    }
  },
  fetchClipArts: async ({ page, limit, query, type = "clipart", keyword }) => {
    try {
      let url = `${hostAPI}/libraries?page=${page}&pageSize=${limit}&type=${type}`;
      const queryKeys = keys(query);
      const transformedQuery = map(queryKeys, (key) => {
        return {
          key,
          value: query[key],
        };
      });
      const filterTransformedQuery = filter(
        transformedQuery,
        (o) => !isEmpty(o.value)
      );
      if (!isEmpty(filterTransformedQuery) || keyword) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(keyword && { keyword }),
            ...(!isEmpty(filterTransformedQuery) && {
              multipleFilters: filterTransformedQuery,
            }),
          })
        )}`;
        url = `${url}&${queryString}`;
      }
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        // showNotification("Thất bại", "Không tìm thấy clipart", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchClipArts:", error);
      // showNotification("Thất bại", "Không tìm thấy clipart", "red");
      return false;
    }
  },
  fetchQuotes: async ({ page, limit, query }) => {
    try {
      let url = `${hostAPI}/quotes?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.name && { name: query.name }),
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
      console.log("Error at fetchQuotes:", error);
      return false;
    }
  },
  syncQuotes: async () => {
    try {
      const response = await axios.post(`${hostAPI}/quotes/sync-from-sheet`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Sync thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at syncQuotes:", error);
      return false;
    }
  },
  syncProductBases: async () => {
    try {
      const response = await axios.post(
        `${hostAPI}/libraries/sync-latest-product-lines`
      );
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Sync thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at syncQuotes:", error);
      return false;
    }
  },
  syncCliparts: async () => {
    try {
      const response = await axios.post(
        `${hostAPI}/libraries/sync-latest-cliparts`
      );
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Sync thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at syncQuotes:", error);
      return false;
    }
  },
  fetchQuotesFilter: async () => {
    try {
      const response = await axios.get(`${hostAPI}/quotes/filters`);
      const { data: result } = response;
      if (result?.success === false) {
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at fetchQuotesFilter:", error);
      return false;
    }
  },
  fetchProductLines: async ({ page, limit, query, fields }) => {
    try {
      let url = `${hostAPI}/product-lines?page=${page}&pageSize=${limit}`;
      const queryKeys = keys(query);
      const transformedQuery = filter(queryKeys, (key) => query[key]);
      if (!isEmpty(transformedQuery)) {
        const queryString = `filter=${encodeURIComponent(
          JSON.stringify({
            ...(query.name && { name: query.name }),
            ...(query.keyword && { keyword: query.keyword }),
          })
        )}`;
        url = `${url}&${queryString}`;
      }
      if (fields) {
        url = `${url}&fields=${fields}`;
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
  createCollection: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/collections`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo collection thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Tạo collection thành công", "green");
      return result;
    } catch (error) {
      console.log("Error at createCollection:", error);
      showNotification("Thất bại", "Tạo collection thất bại", "red");
      return false;
    }
  },
  updateCollection: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/collections`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Cập nhật collection thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Cập nhật collection thành công", "green");
      return result;
    } catch (error) {
      console.log("Error at updateCollection:", error);
      showNotification("Thất bại", "Cập nhật collection thất bại", "red");
      return false;
    }
  },
  getLayouts: async ({ page, limit }) => {
    try {
      let query = "";
      if (limit) {
        query = `pageSize=${limit}`;
      }
      if (page) {
        query = `${query}&page=${page}`;
      }

      const url = query ? `${hostAPI}/layouts?${query}` : `${hostAPI}/layouts`;
      const response = await axios.get(url);
      const { data: result } = response;
      if (result?.success === false) {
        // showNotification("Thất bại", "Không tìm thấy layout", "red");
        return false;
      }
      return result;
    } catch (error) {
      console.log("Error at getLayouts:", error);
      showNotification("Thất bại", "Không tìm thấy layout", "red");
      return false;
    }
  },
  createLayout: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/layouts`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Tạo layout thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Tạo layout thành công", "green");
      return result;
    } catch (error) {
      console.log("Error at createLayout:", error);
      showNotification("Thất bại", "Tạo layout thất bại", "red");
      return false;
    }
  },
  updateLayout: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/layouts`, data);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Cập nhật layout thất bại", "red");
        return false;
      }
      showNotification("Thành công", "Cập nhật layout thành công", "green");
      return result;
    } catch (error) {
      console.log("Error at updateLayout:", error);
      showNotification("Thất bại", "Cập nhật layout thất bại", "red");
      return false;
    }
  },
  deleteLayout: async (uid) => {
    try {
      const response = await axios.delete(`${hostAPI}/layouts/${uid}`);
      const { data: result } = response;
      if (result?.success === false) {
        showNotification("Thất bại", "Xóa layout thất bại", "red");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error at deleteLayout:", error);
      showNotification("Thất bại", "Xóa layout thất bại", "red");
      return false;
    }
  },
};
