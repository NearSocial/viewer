const TestnetDomains = {
  "test.nearbuilders.org": true,
  "127.0.0.1": true,
};

export const NetworkId =
  window.location.hostname in TestnetDomains ? "testnet" : "mainnet";
const TestnetWidgets = {
  image: "eugenethedream/widget/Image",
  default: "eugenethedream/widget/Welcome",
  viewSource: "eugenethedream/widget/WidgetSource",
  widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
  widgetMetadata: "eugenethedream/widget/WidgetMetadata",
  profileImage: "eugenethedream/widget/ProfileImage",
  profilePage: "buildhub.near/widget/Profile",
  profileName: "eugenethedream/widget/ProfileName",
  profileInlineBlock: "eugenethedream/widget/Profile",
  notificationButton: "eugenethedream/widget/NotificationButton",
};

const MainnetWidgets = {
  image: "mob.near/widget/Image",
  default: "buildhub.near/widget/home",
  feed: "buildhub.near/widget/Feed",
  resources: "buildhub.near/widget/Resources",
  viewSource: "mob.near/widget/WidgetSource",
  widgetMetadataEditor: "buildhub.near/widget/WidgetMetadataEditor",
  widgetMetadata: "buildhub.near/widget/WidgetMetadata",
  profileImage: "mob.near/widget/ProfileImage",
  notificationButton: "mob.near/widget/NotificationButton",
  profilePage: "buildhub.near/widget/Profile",
  profileName: "patrick.near/widget/ProfileName",
  editorComponentSearch: "mob.near/widget/Editor.ComponentSearch",
  profileInlineBlock: "mob.near/widget/Profile.InlineBlock",
  viewHistory: "bozon.near/widget/WidgetHistory",
};

export const Widgets =
  NetworkId === "testnet" ? TestnetWidgets : MainnetWidgets;
