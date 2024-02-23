/**
 * Every app is structured the same
 */
const { page, tab, layout, loading, ...passProps } = props;

const { routes } = {
  type: "project",
  routes: {
    home: {
      path: "hack.near/widget/dev.social",
      blockHeight: "final",
      init: { name: "Home", description: "Home", icon: "bi bi-house" },
    },
    discover: {
      path: "efiz.near/widget/Things.index",
      blockHeight: "final",
      init: { icon: "bi bi-globe" },
    },
    tree: {
      path: "efiz.near/widget/Tree",
      blockHeight: "final",
      init: { icon: "bi bi-tree" },
    },
    search: {
      path: "chaotictempest.near/widget/Search",
      blockHeight: "final",
      init: { icon: "bi bi-search" },
    },
    create: {
      path: "create.near/widget/home",
      blockHeight: "final",
      init: { icon: "bi bi-plus-circle" },
    },
    events: {
      path: "itexpert120-contra.near/widget/Events",
      blockHeight: "final",
      init: { icon: "bi bi-calendar" },
    },
    editor: {
      path: "every.near/widget/creator",
      blockHeight: "final",
      init: { icon: "bi bi-pencil" },
    },
    hashtag: {
      path: "efiz.near/widget/every.hashtag",
      blockHeight: "final",
      init: { icon: "bi bi-hash" },
    },
    social: {
      path: "mob.near/widget/N",
      blockHeight: "final",
      init: { icon: "bi bi-people" },
    },
    map: {
      path: "hack.near/widget/Map.tutorial",
      blockHeight: "final",
      init: { icon: "bi bi-map" },
    },
    marketplace: {
      path: "mintbase.near/widget/nft-marketplace",
      blockHeight: "final",
      init: { icon: "bi bi-cart" },
    },
    blocks: {
      path: "devs.near/widget/Module.Feed.demo",
      blockHeight: "final",
      init: { icon: "bi bi-boxes" },
    },
    voyager: {
      path: "efiz.near/widget/voyager.index",
      blockHeight: "final",
      init: { icon: "bi bi-rocket" },
    },
    video: {
      path: "efiz.near/widget/App.index",
      blockHeight: "final",
      init: { icon: "bi bi-camera-video" },
    },
    files: {
      path: "hyperfiles.near/widget/app",
      blockHeight: "final",
      init: { icon: "bi bi-files" },
    },
    graph: {
      path: "efiz.near/widget/SocialGraph",
      blockHeight: "final",
      init: { icon: "bi bi-stars" },
    },
    plugins: {
      path: "embeds.near/widget/Plugin.Index",
      blockHeight: "final",
      init: { icon: "bi bi-plug" },
    },
    build: {
      path: "efiz.near/thing/builddao",
      blockHeight: "final",
      init: { icon: "bi bi-hammer" },
    },
    music: {
      path: "jaswinder.near/widget/MusicPlayer-Harmonic",
      blockHeight: "final",
      init: { icon: "bi bi-music-note" },
    },
    core: {
      path: "efiz.near/thing/core",
      blockHeight: "final",
      init: { icon: "bi bi-dot" },
    },
    draw: {
      path: "efiz.near/widget/draw",
      blockHeight: "final",
      init: { icon: "bi bi-palette-fill" },
    },
    inspect: {
      path: "mob.near/widget/WidgetSource",
      blockHeight: "final",
      hide: true,
    },
    notifications: {
      path: "mob.near/widget/NotificationFeed",
      blockHeight: "final",
      hide: true,
    },
  },
};

const { AppLayout } = VM.require("every.near/widget/layout") || {
  AppLayout: () => <>Layout loading...</>,
};

if (!page) page = "home";

const Theme = styled.div`
  a {
    color: inherit;
  }
`;

const [activeRoute, setActiveRoute] = useState(page);

useEffect(() => {
  setActiveRoute(page);
}, [page]);

function Router({ active, routes }) {
  const routeParts = active.split(".");

  let currentRoute = routes;
  let src = "";
  let defaultProps = {};

  for (let part of routeParts) {
    if (currentRoute[part]) {
      currentRoute = currentRoute[part];
      src = currentRoute.path;

      if (currentRoute.init) {
        defaultProps = { ...defaultProps, ...currentRoute.init };
      }
    } else {
      // Handle 404 or default case for unknown routes
      return <p>404 Not Found</p>;
    }
  }

  return (
    <div key={active}>
      <Widget
        src="every.near/widget/thing"
        props={{ ...passProps, ...defaultProps, path: src, page: tab }}
      />
    </div>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

return (
  <Theme>
    <Container>
      <AppLayout page={activeRoute} routes={routes}>
        <Content>
          <Router active={activeRoute} routes={routes} />
        </Content>
      </AppLayout>
    </Container>
  </Theme>
);
