export const PERMISSIONS = [
  "read:briefs",
  "update:brief-design",
  "delete:briefs",
  "create:briefs",
  "read:product_lines",
  "update:product_lines",
  "delete:product_lines",
  "create:product_lines",
];

export const PERMISSIONS_RELATIONSHIP = [
  {
    parentPermissions: ["create:brief", "update:brief", "delete:brief"],
    childPermissions: ["read:brief"],
  },
  {
    parentPermissions: [
      "create:collection",
      "update:collection",
      "delete:collection",
    ],
    childPermissions: ["read:collection", "read:brief"],
  },
  {
    parentPermissions: ["read:collection"],
    childPermissions: ["read:brief"],
  },
  {
    parentPermissions: ["read:layout"],
    childPermissions: ["read:brief"],
  },
  {
    parentPermissions: ["create:layout", "update:layout", "delete:layout"],
    childPermissions: ["read:layout", "read:brief"],
  },
  {
    parentPermissions: [
      "create:product_line",
      "update:product_line",
      "delete:product_line",
    ],
    childPermissions: ["read:product_line"],
  },
  {
    parentPermissions: ["update:design"],
    childPermissions: ["read:design"],
  },
  {
    parentPermissions: ["update:design_setting"],
    childPermissions: ["read:design_setting", "read:design"],
  },
  {
    parentPermissions: ["update:design_feedback"],
    childPermissions: ["read:design_feedback"],
  },
  {
    parentPermissions: ["read:design_feedback"],
    childPermissions: ["read:design"],
  },
  {
    parentPermissions: ["update:video"],
    childPermissions: ["read:video"],
  },
  {
    parentPermissions: ["update:video_setting"],
    childPermissions: ["read:video_setting", "read:video"],
  },
  {
    parentPermissions: ["update:epm"],
    childPermissions: ["read:epm"],
  },
  {
    parentPermissions: ["update:epm_setting"],
    childPermissions: ["read:epm_setting", "read:epm"],
  },
  {
    parentPermissions: ["create:mkt_post", "update:mkt_post"],
    childPermissions: ["read:mkt_post", "read:mkt"],
  },
  {
    parentPermissions: ["read:mkt_post"],
    childPermissions: ["read:mkt"],
  },
  {
    parentPermissions: ["read:mkt_account"],
    childPermissions: ["read:mkt"],
  },
  {
    parentPermissions: ["read:mkt_sample_campaign"],
    childPermissions: ["read:mkt"],
  },
  {
    parentPermissions: ["read:mkt_setting"],
    childPermissions: ["read:mkt"],
  },
  {
    parentPermissions: ["create:mkt_camp", "update:mkt_camp"],
    childPermissions: ["read:mkt_camp", "read:mkt"],
  },
  {
    parentPermissions: ["create:mkt_camp", "update:mkt_camp"],
    childPermissions: ["read:mkt_camp", "read:mkt"],
  },
  {
    parentPermissions: ["create:mkt_account", "update:mkt_account"],
    childPermissions: ["read:mkt_account", "read:mkt"],
  },
  {
    parentPermissions: [
      "create:mkt_sample_campaign",
      "update:mkt_sample_campaign",
      "delete:mkt_sample_campaign",
    ],
    childPermissions: ["read:mkt_sample_campaign", "read:mkt"],
  },
  {
    parentPermissions: [
      "create:mkt_caption",
      "update:mkt_caption",
      "delete:mkt_caption",
    ],
    childPermissions: ["read:mkt_caption", "read:mkt"],
  },
  {
    parentPermissions: ["update:mkt_setting"],
    childPermissions: ["read:mkt_setting", "read:mkt"],
  },
  {
    parentPermissions: ["update:artist", "create:artist"],
    childPermissions: ["read:artist"],
  },
  {
    parentPermissions: ["update:artist_setting"],
    childPermissions: ["read:artist", "read:artist_setting"],
  },
  {
    parentPermissions: ["read:artist_setting"],
    childPermissions: ["read:artist"],
  },
  {
    parentPermissions: ["update:user", "create:user"],
    childPermissions: ["read:user"],
  },
  {
    parentPermissions: ["update:new_product_line", "create:new_product_line"],
    childPermissions: ["read:new_product_line"],
  },
  {
    parentPermissions: ["update:photography"],
    childPermissions: ["read:photography", "read:new_product_line"],
  },
  {
    parentPermissions: ["update:ready_to_launch"],
    childPermissions: ["read:ready_to_launch", "read:new_product_line"],
  },
  {
    parentPermissions: ["update:mockup"],
    childPermissions: ["read:mockup", "read:new_product_line"],
  },
  {
    parentPermissions: ["read:mockup"],
    childPermissions: ["read:new_product_line"],
  },
  {
    parentPermissions: ["read:photography"],
    childPermissions: ["read:new_product_line"],
  },
  {
    parentPermissions: ["read:ready_to_launch"],
    childPermissions: ["read:new_product_line"],
  },
  {
    parentPermissions: ["update:optimized_mockup", "create:optimized_mockup"],
    childPermissions: ["read:optimized_mockup", "read:new_product_line"],
  },
  {
    parentPermissions: ["update:mockup_setting"],
    childPermissions: ["read:mockup_setting", "read:new_product_line"],
  },
  {
    parentPermissions: ["update:new_product_line_setting"],
    childPermissions: [
      "read:new_product_line_setting",
      "read:new_product_line",
    ],
  },
  {
    parentPermissions: ["read:new_product_line_setting"],
    childPermissions: ["read:new_product_line"],
  },
  {
    parentPermissions: ["read:mockup_setting"],
    childPermissions: ["read:new_product_line"],
  },
];
