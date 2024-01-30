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
    resources: {
      path: "buildhub.near/widget/page.resources",
      blockHeight: "final",
      init: {
        name: "Resources",
      },
    },
    library: {
      path: "buildhub.near/widget/page.library",
      blockHeight: "final",
      init: {
        name: "Library",
      },
    },
  },
};
