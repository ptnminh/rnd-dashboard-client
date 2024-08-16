import axios from "axios";
import {
  AUTH0_MANAGEMENT_API_TOKEN_URL,
  AUTH0_MANAGEMENT_AUDIENCE,
  AUTH0_MANAGEMENT_CLIENT_GRANT_TYPE,
  AUTH0_MANAGEMENT_CLIENT_ID,
  AUTH0_MANAGEMENT_CLIENT_SECRET,
  hostAPI,
} from "../constant";
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
  refreshAuthToken: async () => {
    try {
      const clientId = AUTH0_MANAGEMENT_CLIENT_ID;
      const clientSecret = AUTH0_MANAGEMENT_CLIENT_SECRET;
      const audience = AUTH0_MANAGEMENT_AUDIENCE;
      const grantType = AUTH0_MANAGEMENT_CLIENT_GRANT_TYPE;
      console.log(AUTH0_MANAGEMENT_API_TOKEN_URL);
      const response = await axios.post(`${AUTH0_MANAGEMENT_API_TOKEN_URL}`, {
        client_id: clientId,
        client_secret: clientSecret,
        audience,
        grant_type: grantType,
      });
      const { data } = response;
      return data?.access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  },
};
