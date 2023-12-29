const widgetOwner = "easypoll-v0.ndc-widgets.near";
const page = "VIEW_POLL";

const tabs = {
  OFFICIAL_POLLS: {
    text: "Official Polls by NDC",
    description:
      "Explore polls officially conducted by the NDC. These are verified, authoritative, and can provide valuable insights! Participating in the Official Polls by the NDC may eventually contribute to your on-chain reputation!",
    href: `#/${widgetOwner}/widget/EasyPoll?page=official_polls`,
    active: page === "OFFICIAL_POLLS",
  },
  PUBLIC_POLLS: {
    text: "All Public Polls",
    description:
      "Dive into the world of public opinion. These are polls created by users like you, a melting pot of diverse thoughts and perspectives!",
    href: `#/${widgetOwner}/widget/EasyPoll?page=public_polls`,
    active: page === "PUBLIC_POLLS",
  },
  MY_POLLS: {
    text: "My Polls",
    description:
      "Your personal polling station! Manage and review your own polls, watch them gain traction, and get insights from responses.",
    href: `#/${widgetOwner}/widget/EasyPoll?page=my_polls`,
    active: page === "MY_POLLS",
  },
  CREATE_POLL: {
    href: `#/${widgetOwner}/widget/EasyPoll?page=create_poll`,
    active: page === "CREATE_POLL",
    hideSidebar: true,
  },
  DELETE_POLL: {
    href: (src, blockHeight) =>
      `#/${widgetOwner}/widget/EasyPoll?page=delete_poll&src=${src}`,
    active: page === "DELETE_POLL",
    hideSidebar: true,
  },
  EDIT_POLL: {
    href: (src, blockHeight) =>
      `#/${widgetOwner}/widget/EasyPoll?page=create_poll&src=${src}`,
    active: page === "EDIT_POLL",
    hideSidebar: true,
  },
  VIEW_POLL: {
    href: (src, blockHeight) =>
      `#/${widgetOwner}/widget/EasyPoll?page=view_poll&src=${src}`,
    active: page === "VIEW_POLL",
    hideSidebar: true,
  },
  RESULTS: {
    href: (src, blockHeight) =>
      `#/${widgetOwner}/widget/EasyPoll?page=results&src=${src}`,
    active: page === "RESULTS",
    hideSidebar: true,
  },
};

return (
  <Widget
    src="easypoll-v0.ndc-widgets.near/widget/EasyPoll.ViewPoll"
    props={{ src: props.src, tabs }}
  />
);
