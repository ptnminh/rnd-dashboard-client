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
export const CAMP_TYPES = ["BD1", "BD2", "BD3"];
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

export const CTA_LINK =
  "https://adsmanager.facebook.com/adsmanager/manage/ads/edit?act=222657127518910&business_id=2266543650269835&global_scope_id=2266543650269835&nav_entry_point=am_local_scope_selector&columns=name%2Cdelivery%2Ccampaign_name%2Cbid%2Cbudget%2Clast_significant_edit%2Cattribution_setting%2Cresults%2Creach%2Cimpressions%2Ccost_per_result%2Cquality_score_organic%2Cquality_score_ectr%2Cquality_score_ecvr%2Cspend%2Cend_time%2Cschedule%2Ccreated_time&attribution_windows=default&filter_set=SEARCH_BY_CAMPAIGN_GROUP_NAME-STRING%1ECONTAIN%1E%22IT%22&selected_campaign_ids=120209308981790378&selected_ad_ids=120209308981930378&is_reload_from_account_change&breakdown_regrouping=true&nav_source=no_referrer&current_step=0";

export const CREATE_CAMP_FLOWS = [
  {
    id: 1,
    title: "1 camp - N post",
  },
  {
    id: 2,
    title: "1 camp hình - 1 camp video",
  },
  {
    id: 3,
    title: "1 camp - 1 post",
  },
];
