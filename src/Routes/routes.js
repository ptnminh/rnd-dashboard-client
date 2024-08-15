const PATH_NAMES = {
  RND_BRIEFS: {
    title: "RnD - Tạo Brief",
    url: "/",
  },
  RND_PRODUCT_LINE: {
    title: "List - Product Line",
    url: "/rnd/product-line",
  },
  DESIGN: {
    title: "Design - Task",
    url: "/designer",
  },
  DESIGN_FEEDBACK: {
    title: "Design - Feedback",
    url: "/designer/feedback",
  },
  DESIGN_VIDEO: {
    title: "Video - Submit",
    url: "/designer/video",
  },
  EPM: {
    title: "Listing - Task",
    url: "/epm",
  },
  MKT: {
    title: "MKT - Task",
    url: "/mkt",
  },
  MKT_POST: {
    title: "1. Post",
    url: "/mkt/post",
  },
  MKT_POST_DASHBOARD: {
    title: "1.1 Dashboard",
    url: "/mkt/post/dashboard",
  },
  MKT_POST_CREATE: {
    title: "1.2 Lên Post",
    url: "/mkt/post/create",
  },
  MKT_CAMPS: {
    title: "2. Camps",
    url: "/mkt/camp",
  },
  MKT_CAMPS_CREATE: {
    title: "2.1 Tạo",
    url: "/mkt/camp/dashboard",
  },
  MKT_CAMPS_CREATED: {
    title: "2.2 Đã tạo",
    url: "/mkt/camp/created",
  },
  MKT_MATERIALS: {
    title: "3. Materials",
    url: "/mkt/materials",
  },
  MKT_ACCOUNT: {
    title: "3.1 Accounts",
    url: "/mkt/account",
  },
  MKT_ROOT_CAMPAIGN: {
    title: "3.2 Camp Phôi",
    url: "/mkt/root-campaign",
  },
  MKT_CAPTION: {
    title: "3.3 Caption",
    url: "/mkt/caption",
  },
};

export const NAVIGATION = [
  {
    title: PATH_NAMES.RND_BRIEFS.title,
    slug: "rnd",
    icon: "diamond",
    arrowDown: true,
    permissions: ["read:briefs"],
    pathname: PATH_NAMES.RND_BRIEFS.url,
    dropdown: [
      {
        title: PATH_NAMES.RND_PRODUCT_LINE.title,
        url: PATH_NAMES.RND_PRODUCT_LINE.url,
        permissions: ["read:product_lines"],
      },
    ],
  },
  {
    title: PATH_NAMES.DESIGN.title,
    icon: "diamond",
    arrowDown: true,
    permissions: ["read:design"],
    slug: "/designer",
    pathname: PATH_NAMES.DESIGN.url,
    dropdown: [
      {
        title: PATH_NAMES.DESIGN_FEEDBACK.title,
        url: PATH_NAMES.DESIGN_FEEDBACK.url,
        permissions: ["read:design_feedback"],
      },
      {
        title: PATH_NAMES.DESIGN_VIDEO.title,
        url: PATH_NAMES.DESIGN_VIDEO.url,
        permissions: ["read:video"],
      },
    ],
  },
  {
    title: PATH_NAMES.EPM.title,
    arrowDown: true,
    permissions: ["read:epm"],
    icon: "diamond",
    url: PATH_NAMES.EPM.url,
  },
  {
    title: PATH_NAMES.MKT.title,
    icon: "diamond",
    arrowDown: true,
    permissions: ["read:mkt"],
    slug: PATH_NAMES.MKT.url,
    pathname: PATH_NAMES.MKT.url,
    dropdown: [
      {
        title: PATH_NAMES.MKT_POST.title,
        arrowDown: true,
        dropdown: [
          {
            title: PATH_NAMES.MKT_POST_DASHBOARD.title,
            pathname: PATH_NAMES.MKT_POST_DASHBOARD.url,
            permissions: ["read:mkt_post"],
          },
          {
            title: PATH_NAMES.MKT_POST_CREATE.title,
            pathname: PATH_NAMES.MKT_POST_CREATE.url,
            permissions: ["create:mkt_post"],
          },
        ],
      },
      {
        title: PATH_NAMES.MKT_CAMPS.title,
        arrowDown: true,
        dropdown: [
          {
            title: PATH_NAMES.MKT_CAMPS_CREATE.title,
            pathname: PATH_NAMES.MKT_CAMPS_CREATE.url,
            permissions: ["read:mkt_camp"],
          },
          {
            title: PATH_NAMES.MKT_CAMPS_CREATED.title,
            pathname: PATH_NAMES.MKT_CAMPS_CREATED.url,
            permissions: ["create:mkt_camp"],
          },
        ],
      },
      {
        title: PATH_NAMES.MKT_MATERIALS.title,
        arrowDown: true,
        dropdown: [
          {
            title: PATH_NAMES.MKT_ACCOUNT.title,
            pathname: PATH_NAMES.MKT_ACCOUNT.url,
            permissions: ["read:mkt_account"],
          },
          {
            title: PATH_NAMES.MKT_ROOT_CAMPAIGN.title,
            pathname: PATH_NAMES.MKT_ROOT_CAMPAIGN.url,
            permissions: ["read:mkt_sample_campaign"],
          },
          {
            title: PATH_NAMES.MKT_CAPTION.title,
            pathname: PATH_NAMES.MKT_CAPTION.url,
            permissions: ["read:mkt_caption"],
          },
        ],
      },
    ],
  },
];
