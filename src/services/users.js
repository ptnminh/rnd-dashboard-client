import auth0ManagementApi from "./auth0Client";

export const userServices = {
  fetchUsers: async ({ page, limit, query }) => {
    try {
      const response = await auth0ManagementApi.get(`/users`, {
        params: {
          ...(page && { page }),
          ...(limit && { per_page: +limit }),
          ...(query && { q: query }),
          include_totals: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return Promise.reject(error);
    }
  },
};
