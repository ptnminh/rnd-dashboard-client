export const STATUS = {
  BRIEF_CREATED: 1,
  DESIGNED: 2,
  LISTED: 3,
  MKT_DONE: 4,
};

export const MEMBER_POSITIONS = {
  DESIGNER: "designer",
  MARKETING: "marketing",
  EPM: "epm",
  VIDEO: "video",
  RND: "rnd",
  ARTIST: "artist",
  MOCKUP: "mockup",
  OTHER: "other",
};

export const ROLES = {
  MEMBER: "member",
};

export const NewProductLineBriefStatus = {
  BRIEF_CREATED: 1,
  NEW_PRODUCT_LINE_DONE: 2,
  READY_TO_LAUNCH_DONE: 3,
  MOCKUP_DONE: 4,
  OPTIMIZED_MOCKUP_UNDONE: 8,
  OPTIMIZED_MOCKUP_DONE: 9,
};

export const OP_TEAMS = {
  DS1: "DS1",
  DS2: "DS2",
  DS3: "DS3",
  ARTIST: "ARTIST",
  EPM: "EPM",
  MOCKUP: "MOCKUP",
};

export const OGZ_BD_TEAMS = {
  BD1: "BD1",
  BD2: "BD2",
  BD3: "BD3",
  AMZ: "AMZ",
};

export const POD_DASHBOARD_STATUS = {
  NOT_TOUCH: "Chưa touch",
  OPTIMIZED: "Optimized",
};
export const CONVERT_NUMBER_TO_POD_DASHBOARD_STATUS = {
  0: POD_DASHBOARD_STATUS.NOT_TOUCH,
  1: POD_DASHBOARD_STATUS.OPTIMIZED,
};
export const CONVERT_STATUS_TO_POD_DASHBOARD_NUMBER = {
  [POD_DASHBOARD_STATUS.NOT_TOUCH]: 0,
  [POD_DASHBOARD_STATUS.OPTIMIZED]: 1,
};
