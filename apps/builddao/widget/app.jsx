const { page, layout, loading, ...passProps } = props;

const { routes, theme } = VM.require("buildhub.near/widget/config") ?? {
  routes: {},
  theme: "background-color: red;"
};

const { AppLayout } = VM.require("every.near/widget/layout") || {
  AppLayout: () => <>Layout loading...</>,
};

if (!page) page = Object.keys(routes)[0] || "home";

const Root = styled.div`
  a {
    color: inherit;
  }

  ${theme}

  // can come from config
`;

const [activeRoute, setActiveRoute] = useState(page);

useEffect(() => {
  setActiveRoute(page);
}, [page]);

function Router({ active, routes }) { // this may be converted to a module at devs.near/widget/Router
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
        props={{ ...passProps, ...defaultProps, path: src }}
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
  <Root>
    <Container>
      <AppLayout page={activeRoute} routes={routes}>
        <Content>
          <Router active={activeRoute} routes={routes} />
        </Content>
      </AppLayout>
    </Container>
  </Root>
);
