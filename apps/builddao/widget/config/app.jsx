return {
  type: "app",
  routes: {
    home: {
      path: "${config_account}/widget/page.home",
      blockHeight: "final",
      init: {
        name: "Home",
      },
    },
    feed: {
      path: "${config_account}/widget/page.feed",
      blockHeight: "final",
      init: {
        name: "Feed",
      },
    },
    proposal: {
      path: "${config_account}/widget/page.projects",
      blockHeight: "final",
      init: {
        name: "Projects",
      },
    },
    resources: {
      path: "${config_account}/widget/page.resources",
      blockHeight: "final",
      init: {
        name: "Resources",
      },
    },
    library: {
      path: "${config_account}/widget/page.library",
      blockHeight: "final",
      init: {
        name: "Library",
      },
    },
    profile: {
      path: "${config_account}/widget/page.profile",
      blockHeight: "final",
      init: {
        name: "Profile",
      },
      hide: true,
    },
    inspect: {
      path: "${config_account}/widget/page.inspect",
      blockHeight: "final",
      init: {
        name: "Inspect",
      },
      hide: true,
    },
    projects: {
      path: "${config_account}/widget/page.project-feed",
      blockHeight: "final",
      init: {
        name: "Project Feed",
      },
      hide: true,
    },
    project: {
      path: "${config_account}/widget/page.project",
      blockHeight: "final",
      init: {
        name: "Project Page",
      },
      hide: true,
    },
  },
};
