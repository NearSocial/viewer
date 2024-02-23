const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => "/",
};

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

function Router({ active, routes, PageNotFound, debug, routerParam }) {
  if (!PageNotFound) PageNotFound = () => <p>404 Not Found</p>;

  let currentRoute = routes[active];

  if (!currentRoute) {
    // Handle 404 or default case for unknown routes
    return <PageNotFound />;
  }

  if (debug) {
    return (
      <div key={active}>
        <pre>{JSON.stringify(currentRoute, null, 2)}</pre>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  } else {
    return (
      <Content key={active}>
        <Widget
          src={currentRoute.path}
          props={currentRoute.init}
          loading={<div style={{ height: "100%", width: "100%" }} />}
        />
      </Content>
    );
  }
}

return { Router };
