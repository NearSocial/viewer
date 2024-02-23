const { Router } = VM.require("devs.near/widget/Router") || {
  Router: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => "/",
};

const Root = styled.div``;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const App = ({
  routes,
  Layout,
  basePath,
  page,
  defaultPage,
  debug,
  depth,
  env,
  routerParam,
  ...passProps
}) => {
  if (!page) page = Object.keys(routes)[0] || defaultPage;

  function navigate({ param, to }) {
    if (!param) param = routerParam ?? "page";
    if (to === "/") to = defaultPage;

    return href({
      widgetSrc: basePath,
      params: {
        [param]: to,
        env: env ?? undefined,
      },
    });
  }

  return (
    <Root key={basePath}>
      <Container>
        <Layout
          page={page}
          routes={routes}
          navigate={navigate}
          {...routerProps}
          {...props}
          Outlet={(p) => (
            <Router
              debug={debug}
              basePath={basePath}
              active={passProps[routerParam ?? "page"] ?? page}
              routes={routes}
              passProps={p}
              routerParam={routerParam}
              depth={depth ?? 1}
              PageNotFound={() => <p>404 Not Found</p>} // routes[404]
            />
          )}
        />
      </Container>
    </Root>
  );
};

return { App };
