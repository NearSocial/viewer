return {
  type: "app",
  routes: {
    home: {
      path: "buildhub.near/widget/page.home",
      blockHeight: "final",
      init: {
        name: "Home"
      }
    },
    feed: {
      path: "buildhub.near/widget/page.feed",
      blockHeight: "final",
      init: {
        name: "Feed"
      }
    },
    proposal: {
      path: "buildhub.near/widget/page.projects",
      blockHeight: "final",
      init: {
        name: "Projects"
      }
    },
    resources: {
      path: "buildhub.near/widget/page.resources",
      blockHeight: "final",
      init: {
        name: "Resources"
      }
    },
    library: {
      path: "buildhub.near/widget/page.library",
      blockHeight: "final",
      init: {
        name: "Library"
      }
    }
  }
};
