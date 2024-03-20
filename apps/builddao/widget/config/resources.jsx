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
    deployWeb4: {
      path: "buildhub.near/widget/Resources",
      blockHeight: "final",
      init: {
        name: "Deploying to Web4",
        icon: "bi-rocket",
        postAccountId: "efiz.near",
        postBlockHeight: "113409716",
      },
    },
  },
};
