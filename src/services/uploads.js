import apiClient from "./axiosClient";

export const uploadServices = {
  upload: async (file, fileName = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fileName) {
        formData.append("fileName", fileName);
      }
      const response = await apiClient.post(`/uploads`, formData);
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
