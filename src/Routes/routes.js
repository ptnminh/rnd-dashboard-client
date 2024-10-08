export const PATH_NAMES = {
  DIRECTION: {
    title: "1. Direction",
    url: "/",
  },
  PRODUCT_BASE: {
    title: "2. Product Base",
    children: {
      NEW_PRODUCT_LINE: {
        title: "1. New Product Line",
        children: {
          BRIEF: {
            title: "1.1 - Brief",
            url: "/product-base/new-product-line",
          },
          TASK: {
            title: "1.2 - Task",
            url: "/product-base/new-product-line/task",
          },
          SETTING: {
            title: "1.3 - Setting",
            url: "/product-base/new-product-line/setting",
          },
        },
      },
      NEW_MOCKUP: {
        title: "2. Mockup",
        children: {
          READY_TO_LAUNCH: {
            title: "2.1 - Brief",
            url: "/product-base/mockup/ready-to-launch",
          },
          TASK: {
            title: "2.2 - Task",
            url: "/product-base/mockup/task",
          },
          PHOTOGRAPHY: {
            title: "2.3 - Chụp",
            url: "/product-base/mockup/photography",
          },
          SETTING: {
            title: "2.4 - Setting",
            url: "/product-base/mockup/setting",
          },
        },
      },
      NEW_CLIPART: {
        title: "3. New Clipart",
        children: {
          BRIEF: {
            title: "3.1 - Brief",
            url: "/product-base/new-clipart/brief",
          },
          TASK: {
            title: "3.2 - Task",
            url: "/product-base/new-clipart/task",
          },
          SETTING: {
            title: "3.3 - Setting",
            url: "/product-base/new-clipart/setting",
          },
        },
      },
    },
  },
  RND: {
    title: "3. RnD",
    children: {
      BRIEF_DESIGN: {
        title: "1. Brief Design",
        url: "/rnd",
      },
      SETTING: {
        title: "2. Setting",
        children: {
          LIST_PRODUCT_LINE: {
            title: "2.1 Product Line",
            url: "/rnd/product-line",
          },
        },
      },
    },
  },
  DESIGNER: {
    title: "4. Designer",
    children: {
      TASK: {
        title: "1. Task",
        url: "/designer",
      },
      FEEDBACK: {
        title: "2. Design Feedback",
        url: "/designer/feedback",
      },
      SETTING: {
        title: "3. Setting",
        url: "/designer/setting",
      },
    },
  },
  EPM: {
    title: "5. EPM",
    children: {
      TASK: {
        title: "1. Task",
        url: "/epm",
      },
      SETTING: {
        title: "2. Setting",
        url: "/epm/setting",
      },
    },
  },
  MKT: {
    title: "7. MKT",
    children: {
      LIST_SKU: {
        title: "1. List SKU",
        url: "/mkt",
      },
      POST: {
        title: "1. Post",
        children: {
          DASHBOARD: {
            title: "1.1 Post lẻ",
            url: "/mkt/post/dashboard",
          },
          CREATE: {
            title: "1.2 Post nhiều",
            url: "/mkt/post/create",
          },
          ASSIGN_CTA: {
            title: "1.3 Gắn CTA",
            url: "/mkt/post/assign-cta",
          },
        },
      },
      CAMP: {
        title: "2. Camp",
        children: {
          CREATE: {
            title: "2.1 Tạo",
            url: "/mkt/camp/dashboard",
          },
          CREATED: {
            title: "2.2 Đã tạo",
            url: "/mkt/camp/created",
          },
        },
      },
      MATERIAL: {
        title: "3. Setting",
        children: {
          ACCOUNT: {
            title: "3.1 Account",
            url: "/mkt/material/account",
          },
          ROOT_CAMPAIGN: {
            title: "3.2 Camp phôi",
            url: "/mkt/material/root-campaign",
          },
          CAMPAIGN_CAPTION: {
            title: "3.3 - Caption",
            url: "/mkt/material/caption",
          },
          SETTING: {
            title: "3.4 - Setting",
            url: "/mkt/material/setting",
          },
        },
      },
    },
  },
  USER: {
    title: "8. User",
    url: "/users",
  },
  DASHBOARD: {
    title: "9. Dashboard",
    url: "/dashboard",
    children: {
      RECHARTS: {
        title: "Recharts",
        url: "/dashboard/rechart",
      },
      CHARTJS: {
        title: "ChartJS",
        url: "/dashboard/chartjs",
      },
      QUOTA_SETTING: {
        title: "4. Dashboard - Quota",
        url: "/dashboard/sales",
      },
      SETTING: {
        title: "5. Setting",
        url: "/dashboard/default-setting",
      },
      AMZ_SELLER_BOARD: {
        title: "2. AMZ-Dashboard",
        url: "/dashboard/amz-seller-board",
      },
      POD_RANKING: {
        title: "3. Ranking",
        url: "/dashboard/pod-ranking",
      },
      POD_AMZ: {
        title: "1. POD-Dashboard",
        url: "/dashboard/pod",
      },
    },
  },
  VIDEO: {
    title: "6. Request Video",
    url: "/video",
    children: {
      SAMPLE: {
        title: "1. Sample",
        url: "/request-video/sample",
      },
      VIDEO: {
        title: "2. Video",
        url: "/request-video/video",
      },
    },
  },
};

export const NAVIGATION = [
  {
    title: PATH_NAMES.DIRECTION.title,
    icon: "diamond",
    pathname: "/",
    turnOffActive: true,
    arrowDown: true,
  },
  {
    title: PATH_NAMES.PRODUCT_BASE.title,
    icon: "diamond",
    isParent: true,
    pathname: "/product-base",
    arrowDown: true,
    turnOffActive: true,
    permissions: ["read:new_product_line"],
    dropdown: [
      {
        title: PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.title,
        arrowDown: true,
        dropdown: [
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.BRIEF
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.BRIEF
                .url,
            permissions: ["create:new_product_line"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.TASK
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.TASK
                .url,
            permissions: ["read:new_product_line"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.SETTING
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_PRODUCT_LINE.children.SETTING
                .url,
            permissions: ["read:new_product_line_setting"],
          },
        ],
      },
      {
        title: PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.title,
        arrowDown: true,
        dropdown: [
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children
                .READY_TO_LAUNCH.title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children
                .READY_TO_LAUNCH.url,
            permissions: ["read:ready_to_launch"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.TASK.title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.TASK.url,
            permissions: ["read:mockup", "read:optimized_mockup"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.PHOTOGRAPHY
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.PHOTOGRAPHY
                .url,
            permissions: ["read:photography"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.SETTING
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_MOCKUP.children.SETTING.url,
            permissions: ["read:mockup_setting"],
          },
        ],
      },
      {
        title: PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.title,
        arrowDown: true,
        dropdown: [
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.BRIEF.title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.BRIEF.url,
            permissions: ["create:artist"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.TASK.title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.TASK.url,
            permissions: ["read:artist"],
          },
          {
            title:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.SETTING
                .title,
            pathname:
              PATH_NAMES.PRODUCT_BASE.children.NEW_CLIPART.children.SETTING.url,
            permissions: ["read:artist_setting"],
          },
        ],
      },
    ],
  },
  {
    title: PATH_NAMES.RND.title,
    icon: "diamond",
    isParent: true,
    pathname: "/rnd",
    arrowDown: true,
    turnOffActive: true,
    permissions: ["read:brief"],
    dropdown: [
      {
        title: PATH_NAMES.RND.children.BRIEF_DESIGN.title,
        url: PATH_NAMES.RND.children.BRIEF_DESIGN.url,
        arrowDown: true,
        permissions: ["read:brief"],
      },
      {
        title: PATH_NAMES.RND.children.SETTING.title,
        arrowDown: true,
        dropdown: [
          {
            title:
              PATH_NAMES.RND.children.SETTING.children.LIST_PRODUCT_LINE.title,
            pathname:
              PATH_NAMES.RND.children.SETTING.children.LIST_PRODUCT_LINE.url,
            permissions: ["read:collection", "read:layout"],
          },
        ],
      },
    ],
  },
  {
    title: PATH_NAMES.DESIGNER.title,
    icon: "diamond",
    isParent: true,
    pathname: "/designer",
    turnOffActive: true,
    arrowDown: true,
    permissions: ["read:design"],
    dropdown: [
      {
        title: PATH_NAMES.DESIGNER.children.TASK.title,
        url: PATH_NAMES.DESIGNER.children.TASK.url,
        permissions: ["read:design"],
        arrowDown: true,
      },
      {
        title: PATH_NAMES.DESIGNER.children.FEEDBACK.title,
        url: PATH_NAMES.DESIGNER.children.FEEDBACK.url,
        permissions: ["read:design_feedback"],
        arrowDown: true,
      },
      // {
      //   title: PATH_NAMES.DESIGNER.children.SETTING.title,
      //   url: PATH_NAMES.DESIGNER.children.SETTING.url,
      //   arrowDown: true,
      //   permissions: ["read:design_setting"],
      // },
    ],
  },
  {
    title: PATH_NAMES.EPM.title,
    icon: "diamond",
    isParent: true,
    pathname: "/epm",
    turnOffActive: true,
    arrowDown: true,
    permissions: ["read:epm"],
    dropdown: [
      {
        title: PATH_NAMES.EPM.children.TASK.title,
        url: PATH_NAMES.EPM.children.TASK.url,
        arrowDown: true,
        permissions: ["read:epm"],
      },
      // {
      //   title: PATH_NAMES.EPM.children.SETTING.title,
      //   url: PATH_NAMES.EPM.children.SETTING.url,
      //   arrowDown: true,
      //   permissions: ["read:epm_setting"],
      // },
    ],
  },
  {
    title: PATH_NAMES.VIDEO.title,
    icon: "diamond",
    isParent: true,
    pathname: "/video",
    arrowDown: true,
    permissions: ["read:video"],
    turnOffActive: true,
    dropdown: [
      {
        title: PATH_NAMES.VIDEO.children.SAMPLE.title,
        url: PATH_NAMES.VIDEO.children.SAMPLE.url,
        arrowDown: true,
        permissions: ["read:video"],
      },
      {
        title: PATH_NAMES.VIDEO.children.VIDEO.title,
        url: PATH_NAMES.VIDEO.children.VIDEO.url,
        arrowDown: true,
        permissions: ["read:video"],
      },
    ],
  },
  {
    title: PATH_NAMES.MKT.title,
    icon: "diamond",
    isParent: true,
    pathname: "/mkt",
    arrowDown: true,
    turnOffActive: true,
    permissions: ["read:mkt"],
    dropdown: [
      // {
      //   title: PATH_NAMES.MKT.children.LIST_SKU.title,
      //   url: PATH_NAMES.MKT.children.LIST_SKU.url,
      //   arrowDown: true,
      //   permissions: ["read:mkt_post", "read:mkt_camp"],
      // },
      {
        title: PATH_NAMES.MKT.children.POST.title,
        arrowDown: true,
        dropdown: [
          {
            title: PATH_NAMES.MKT.children.POST.children.DASHBOARD.title,
            pathname: PATH_NAMES.MKT.children.POST.children.DASHBOARD.url,
            permissions: ["read:mkt_post"],
          },
          {
            title: PATH_NAMES.MKT.children.POST.children.CREATE.title,
            pathname: PATH_NAMES.MKT.children.POST.children.CREATE.url,
            permissions: ["read:mkt_post"],
          },
          {
            title: PATH_NAMES.MKT.children.POST.children.ASSIGN_CTA.title,
            pathname: PATH_NAMES.MKT.children.POST.children.ASSIGN_CTA.url,
            permissions: ["read:mkt_post"],
          },
        ],
      },
      {
        title: PATH_NAMES.MKT.children.CAMP.title,
        dropdown: [
          {
            title: PATH_NAMES.MKT.children.CAMP.children.CREATE.title,
            pathname: PATH_NAMES.MKT.children.CAMP.children.CREATE.url,
            permissions: ["read:mkt_camp"],
          },
          {
            title: PATH_NAMES.MKT.children.CAMP.children.CREATED.title,
            pathname: PATH_NAMES.MKT.children.CAMP.children.CREATED.url,
            permissions: ["create:mkt_camp"],
          },
        ],
        arrowDown: true,
      },
      {
        title: PATH_NAMES.MKT.children.MATERIAL.title,
        dropdown: [
          {
            title: PATH_NAMES.MKT.children.MATERIAL.children.ACCOUNT.title,
            pathname: PATH_NAMES.MKT.children.MATERIAL.children.ACCOUNT.url,
            permissions: ["read:mkt_account"],
          },
          {
            title:
              PATH_NAMES.MKT.children.MATERIAL.children.ROOT_CAMPAIGN.title,
            pathname:
              PATH_NAMES.MKT.children.MATERIAL.children.ROOT_CAMPAIGN.url,
            permissions: ["read:mkt_sample_campaign"],
          },
          {
            title:
              PATH_NAMES.MKT.children.MATERIAL.children.CAMPAIGN_CAPTION.title,
            pathname:
              PATH_NAMES.MKT.children.MATERIAL.children.CAMPAIGN_CAPTION.url,
            permissions: ["read:mkt_caption"],
          },
          {
            title: PATH_NAMES.MKT.children.MATERIAL.children.SETTING.title,
            pathname: PATH_NAMES.MKT.children.MATERIAL.children.SETTING.url,
            permissions: ["read:mkt_setting"],
          },
        ],
        arrowDown: true,
      },
    ],
  },
  {
    title: PATH_NAMES.USER.title,
    pathname: PATH_NAMES.USER.url,
    icon: "diamond",
    arrowDown: true,
    permissions: ["read:user"],
  },
  {
    title: PATH_NAMES.DASHBOARD.title,
    pathname: PATH_NAMES.DASHBOARD.url,
    icon: "diamond",
    arrowDown: true,
    isParent: true,
    turnOffActive: true,
    permissions: ["read:dashboard"],
    dropdown: [
      {
        title: PATH_NAMES.DASHBOARD.children.POD_AMZ.title,
        url: PATH_NAMES.DASHBOARD.children.POD_AMZ.url,
        permissions: ["read:dashboard"],
      },
      {
        title: PATH_NAMES.DASHBOARD.children.AMZ_SELLER_BOARD.title,
        url: PATH_NAMES.DASHBOARD.children.AMZ_SELLER_BOARD.url,
        permissions: ["read:dashboard"],
      },
      {
        title: PATH_NAMES.DASHBOARD.children.POD_RANKING.title,
        url: PATH_NAMES.DASHBOARD.children.POD_RANKING.url,
        permissions: ["read:dashboard"],
      },
      {
        title: PATH_NAMES.DASHBOARD.children.QUOTA_SETTING.title,
        url: PATH_NAMES.DASHBOARD.children.QUOTA_SETTING.url,
        permissions: ["read:dashboard"],
      },
      {
        title: PATH_NAMES.DASHBOARD.children.SETTING.title,
        url: PATH_NAMES.DASHBOARD.children.SETTING.url,
        permissions: ["read:dashboard"],
      },
    ],
  },
];
