export const AMZ_URL = "https://amz-dashboard-staging.uidevify.com/api";
export const AMZ_STORES = ["PFH", "QZL", "GGT", "All"];
export const FULFILLMENT_CHANNELS = ["FBM", "FBA", "All"];
export const AMZ_SORTING = {
  ordersAsc: "Best selling (A-Z)",
  ordersDesc: "Best selling (Z-A)",
  saleInRangeAsc: "Sales in range (A-Z)",
  saleInRangeDesc: "Sales in range (Z-A)",
  createdDateAsc: "Created Date (A-Z)",
  createdDateDesc: "Created Date (Z-A)",
};
export const AMZ_DASHBOARD_STATUS = {
  NOT_TOUCH: "Chưa touch",
  OPTIMIZED: "Optimized",
};
export const CONVERT_NUMBER_TO_AMZ_DASHBOARD_STATUS = {
  0: AMZ_DASHBOARD_STATUS.NOT_TOUCH,
  1: AMZ_DASHBOARD_STATUS.OPTIMIZED,
};
export const CONVERT_STATUS_TO_AMZ_DASHBOARD_NUMBER = {
  [AMZ_DASHBOARD_STATUS.NOT_TOUCH]: 0,
  [AMZ_DASHBOARD_STATUS.OPTIMIZED]: 1,
};
