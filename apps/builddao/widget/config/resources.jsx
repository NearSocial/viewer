return {
  type: "app",
  routes: {
    guide: {
      path: "buildhub.near/widget/Resources",
      blockHeight: "final",
      init: {
        name: "Guide",
        icon: "bi-map",
        mdPath:
          "https://raw.githubusercontent.com/NEARBuilders/gateway/main/resources.md",
      },
    },
    library: {
      path: "buildhub.near/widget/Resources",
      blockHeight: "final",
      init: {
        name: "Library",
        icon: "bi-collection",
        mdPath:
          "https://raw.githubusercontent.com/NEARBuilders/docs/main/build-library.md",
      },
    },
  },
};
