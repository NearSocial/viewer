const { page, tab, ...passProps } = props;

const { routes } = VM.require("buildhub.near/widget/config.app") ?? {
  routes: {},
};

const { AppLayout } = VM.require("buildhub.near/widget/template.AppLayout") || {
  AppLayout: () => <></>,
};

if (!page) page = Object.keys(routes)[0] || "home";

const Root = styled.div`
  --stroke-color: rgba(255, 255, 255, 0.2);
  --bg-1: #0b0c14;
  --bg-1-hover: #17181c;
  --bg-1-hover-transparent: rgba(23, 24, 28, 0);
  --bg-2: ##23242b;
  --label-color: #fff;
  --font-color: #fff;
  --font-muted-color: #cdd0d5;
  --black: #000;
  --system-red: #fd2a5c;
  --yellow: #ffaf51;

  --compose-bg: #23242b;

  --post-bg: #23242b;
  --post-bg-hover: #1d1f25;
  --post-bg-transparent: rgba(23, 24, 28, 0);

  --button-primary-bg: #ffaf51;
  --button-outline-bg: transparent;
  --button-default-bg: #23242b;

  --button-primary-color: #000;
  --button-outline-color: #cdd0d5;
  --button-default-color: #cdd0d5;

  --button-primary-hover-bg: #e49b48;
  --button-outline-hover-bg: rgba(255, 255, 255, 0.2);
  --button-default-hover-bg: #17181c;
`;

function Router({ active, routes }) {
  // this may be converted to a module at devs.near/widget/Router
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
        src={src}
        props={{
          currentPath: `/buildhub.near/widget/app?page=${page}`,
          page: tab,
          ...passProps,
          ...defaultProps,
        }}
      />
    </div>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

return (
  <Root>
    <Container>
      <AppLayout page={page} routes={routes} {...props}>
        <Content>
          <Router active={page} routes={routes} />
        </Content>
      </AppLayout>
    </Container>
  </Root>
);
