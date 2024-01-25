const { Button } = VM.require("buildhub.near/widget/components");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // margin-top: calc(-1 * var(--body-top-padding));
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Navbar = styled.div`
  width: 64px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  width: 100%;

  background-color: #0b0c14;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const { NavLink } = props || {
  NavLink: ({ to, children }) => (
    <Link key={to} to={`/?page=${to}`}>
      {children}
    </Link>
  ),
};

const AppHeader = ({ page, routes }) => (
  <Navbar className="container-xl">
    <ButtonGroup>
      {routes &&
        (Object.keys(routes) || []).map((k) => {
          const route = routes[k];
          if (route.hide) {
            return null;
          }
          return (
            <NavLink to={k}>
              <Button key={k} className={`${page === k ? "active" : ""} `}>
                {route.init.icon && <i className={route.init.icon}></i>}
                {route.init.name}
              </Button>
            </NavLink>
          );
        })}
    </ButtonGroup>
    {routes && (
      <>
        <ButtonGroup>
          <NavLink to={`inspect&src=${routes[page].path}`}>
            <Button type="icon">
              <i className={"bi bi-code"}></i>
            </Button>
          </NavLink>
          <NavLink to={"notifications"}>
            <Button type="icon">
              <i className={"bi bi-bell"}></i>
            </Button>
          </NavLink>
        </ButtonGroup>
      </>
    )}
  </Navbar>
);

const Footer = (props) => {
  return <></>;
};

// Define the new component that follows the AppLayout pattern
function AppLayout({ routes, page, children }) {
  return (
    <>
      <Container>
        <AppHeader page={page} routes={routes} />
        <ContentContainer>{children}</ContentContainer>
        <Footer page={page} />
      </Container>
    </>
  );
}

return { AppLayout };
