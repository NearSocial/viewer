return {
  type: "app",
  routes: {
    home: {
      path: "buildhub.near/widget/page.home",
      blockHeight: "final",
      init: {
        name: "Home",
      },
    },
    feed: {
      path: "buildhub.near/widget/page.feed",
      blockHeight: "final",
      init: {
        name: "Feed",
      },
    },
    proposal: {
      path: "buildhub.near/widget/page.proposals",
      blockHeight: "final",
      init: {
        name: "Proposals",
      },
    },
  },
  theme: theme,
};
