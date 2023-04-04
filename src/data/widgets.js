const TestnetDomains = {
  "test.near.org": true,
  "127.0.0.1": true,
};

export const NetworkId =
  window.location.hostname in TestnetDomains ? "testnet" : "mainnet";
const TestnetWidgets = {
  image: "eugenethedream/widget/Image",
  default: "one.testnet/widget/ActivityPage",
  viewSource: "eugenethedream/widget/WidgetSource",
  widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
  widgetMetadata: "eugenethedream/widget/WidgetMetadata",
  profileImage: "eugenethedream/widget/ProfileImage",
  profilePage: "eugenethedream/widget/Profile",
  profileName: "eugenethedream/widget/ProfileName",
  componentsPage: "one.testnet/widget/ComponentsPage",
  peoplePage: "one.testnet/widget/PeoplePage",
  globalSearchPage: "one.testnet/widget/GlobalSearchPage",
  notificationButton: "one.testnet/widget/NotificationButton",
  profilePage: "one.testnet/widget/ProfilePage",
  componentSummary: "one.testnet/widget/ComponentSummary",
  notificationsPage: "one.testnet/widget/NotificationsPage",
  tosCheck: "one.testnet/widget/TosCheck",
  tosContent: "one.testnet/widget/TosContent",
  wrapper: "one.testnet/widget/DS.Theme",
};

const MainnetWidgets = {
  image: "mob.near/widget/Image",
  default: "adminalpha.near/widget/ActivityPage",
  viewSource: "mob.near/widget/WidgetSource",
  widgetMetadataEditor: "mob.near/widget/WidgetMetadataEditor",
  widgetMetadata: "mob.near/widget/WidgetMetadata",
  profileImage: "mob.near/widget/ProfileImage",
  profileName: "patrick.near/widget/ProfileName",
  editorComponentSearch: "mob.near/widget/Editor.ComponentSearch",
  profileInlineBlock: "mob.near/widget/Profile.InlineBlock",
  componentsPage: "adminalpha.near/widget/ComponentsPage",
  peoplePage: "adminalpha.near/widget/PeoplePage",
  globalSearchPage: "chaotictempest.near/widget/Search",
  notificationButton: "adminalpha.near/widget/NotificationButton",
  profilePage: "adminalpha.near/widget/ProfilePage",
  componentSummary: "adminalpha.near/widget/ComponentSummary",
  notificationsPage: "adminalpha.near/widget/NotificationsPage",
  tosCheck: "adminalpha.near/widget/TosCheck",
  tosContent: "adminalpha.near/widget/TosContent",
  wrapper: "adminalpha.near/widget/DS.Theme",
};

export const Widgets =
  NetworkId === "testnet" ? TestnetWidgets : MainnetWidgets;
