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
    parentPermissions: ["update:design_feedback"],
    childPermissions: ["read:design_feedback"],
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
    childPermissions: ["read:artist", "read:brief"],
  },
  {
    parentPermissions: ["update:artist_setting"],
    childPermissions: ["read:artist", "read:artist_setting"],
  },
  {
    parentPermissions: ["update:user", "create:user"],
    childPermissions: ["read:user"],
  },
];
