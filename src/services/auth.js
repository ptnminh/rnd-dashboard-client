import axios from "axios";
import { hostAPI } from "../constant";
import { showNotification } from "../utils/index";

export const authServices = {
  verifyToken: async (token) => {
    try {
      const response = await axios.post(`${hostAPI}/auth/verify-access-token`, {
        accessToken: token,
      });
      const { data: result } = response;
      if (result?.success === false) {
        showNotification(
          "Thất bại",
          result?.message || "Tạo Campaign thất bại",
          "red"
        );

        return result;
      }
      return result;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
};
