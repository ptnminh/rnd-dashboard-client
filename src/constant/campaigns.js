export const DEFAULT_VALUES_NAVIGATIONS = ["Default", "Edit"];
export const STRATEGIES = ["DOWN_ONLY", "UP_AND_DOWN"];
export const MATCH_TYPES = ["BROAD", "EXACT", "PHRASE"];
export const EXPRESSION_TYPES = [
  "ASIN_SAME_AS",
  "ASIN_CATEGORY_SAME_AS",
  "ASIN_BRAND_SAME_AS",
  // "ASIN_PRICE_LESS_THAN",
  // "ASIN_PRICE_BETWEEN",
  // "ASIN_PRICE_GREATER_THAN",
  // "ASIN_REVIEW_RATING_LESS_THAN",
  // "ASIN_REVIEW_RATING_BETWEEN",
  // "ASIN_REVIEW_RATING_GREATER_THAN",
  // "ASIN_IS_PRIME_SHIPPING_ELIGIBLE",
  // "ASIN_AGE_RANGE_SAME_AS",
  // "ASIN_GENRE_SAME_AS",
  // "ASIN_EXPANDED_FROM",
];
export const STORES = ["PFH", "QZL", "GGT", "KH", "PG", "PPN", "BIG"];
export const CHANNELS = ["FBM", "FBA"];
export const CHANNELS_OPTIONS = [
  {
    id: 1,
    title: "FBM",
  },
  {
    id: 2,
    title: "FBA",
  },
];
export const CAMPAIGN_TYPES_OPTIONS = [
  {
    id: 1,
    title: "KW",
  },
  {
    id: 2,
    title: "ASIN",
  },
];
export const CAMP_TYPES = ["KEYWORD", "AUTO", "ASIN"];
export const CREATE_SKU_CAMP_METHOD = [
  {
    id: 1,
    title: "Chung 1 camp",
  },
  {
    id: 2,
    title: "Nhiều camp",
  },
  {
    id: 3,
    title: "Tối đa N SKU/Camp",
  },
];
export const CREATE_KW_CAMP_METHOD = [
  {
    id: 1,
    title: "Tất cả KW/ASIN",
  },
  {
    id: 2,
    title: "Tối đa 10 KW/ASIN",
  },
  {
    id: 3,
    title: "Tối đa N KW/ASIN",
  },
];
export const PRODUCT_LINES_OPTIONS = ["Default", "Product Line"];
export const STORE_PREFIX_BRAND = {
  KH: {
    store: "Kool House",
    prefix: "JM",
    brand: "Joymarke",
    nasFolderIndex: 5,
  },
  PG: {
    store: "Pawfect Gifts",
    prefix: "PFR",
    brand: "Pawfery",
    nasFolderIndex: 4,
  },
  PPN: {
    store: "Perfect Print Nations",
    prefix: "PPN",
    brand: "Pafira",
    nasFolderIndex: 3,
  },
  BIG: {
    store: "Big Inspired Gifts",
    prefix: "BIG",
    brand: "Jovish",
    nasFolderIndex: 2,
  },
  GGT: {
    store: "GadgetsTalk",
    prefix: "GGT",
    brand: "GadgetsTalk",
    nasFolderIndex: 1,
  },
  PFH: {
    store: "Pawfect House",
    prefix: "PFH",
    brand: "Pawfect House",
  },
  QZL: {
    store: "Doptika",
    prefix: "QZL",
    brand: "Doptika",
  },
};
export const hostAPI = process.env.REACT_APP_BACKEND_URL;
export const MAPPED_STRATEGY = {
  DOWN_ONLY: "LEGACY_FOR_SALES",
  UP_AND_DOWN: "AUTO_FOR_SALES",
};
