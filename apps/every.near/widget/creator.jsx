const { page, tab, ...passProps } = props;

const { routes } = {
  type: "app",
  routes: {
    write: {
      path: "devs.near/widget/app",
      blockHeight: "final",
      init: {
        action: "write",
      },
    },
    draw: {
      path: "everycanvas.near/widget/index",
      blockHeight: "final",
      init: {
        action: "draw",
        path: undefined,
      },
    },
  },
};

const { ToggleLayout } = VM.require("every.near/widget/template.toggle") || {
  ToggleLayout: () => <></>,
};

function Router({
  basePath,
  active,
  routes,
  depth,
  PageNotFound,
  passProps,
  children,
}) {
  if (!depth) depth = 1;
  if (!PageNotFound) PageNotFound = () => <p>404 Not Found</p>;

  let currentRoute = routes[active];

  if (!currentRoute) {
    // Handle 404 or default case for unknown routes
    return <PageNotFound />;
  }

  const src = currentRoute.path;

  // Determine the parameter name based on depth
  let param;
  switch (depth) {
    case 1:
      param = "page";
      break;
    case 2:
      param = "tab";
      break;
    case 3:
      param = "view";
      break;
    default:
      // This should set the src as the new baseUrl, reset the depth
      console.error("Unsupported depth:", depth);
      return <p>Error: Unsupported depth</p>;
  }

  // Construct the currentPath dynamically based on depth
  const currentPath = (a) =>
    `${basePath}${depth === 1 ? "?" : "&"}${param}=${a}`;

  function NavLink({ to, children }) {
    console.log("using custom link", currentPath);
    return <Link to={`${currentPath(to)}`}>{children}</Link>;
  }

  return (
    <div key={active}>
      {children && children({ src, currentPath, depth, NavLink })}
    </div>
  );
}

if (!page) page = Object.keys(routes)[0] || "write";

const Root = styled.div``;

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
    <Router
      basePath="?page=editor" // this should come from widgetSrc (gateway should handling trimmings)
      active={page}
      routes={routes}
      passProps={passProps}
      depth={2}
      children={(routerProps) => (
        <Container>
          <ToggleLayout page={tab} routes={routes} {...routerProps} {...props}>
            <Content>
              <Widget src={routerProps.src} props={routerProps} />
            </Content>
          </ToggleLayout>
        </Container>
      )}
    />
  </Root>
);
