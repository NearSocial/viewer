/**
 * This is a standard layout with a header, body, and a footer
 */

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
  padding: 48px;
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
    <img
      style={{ width: 85, objectFit: "cover" }}
      src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
    />
    <ButtonGroup>
      {routes &&
        (Object.keys(routes) || []).map((k) => {
          const route = routes[k];
          if (route.hide) {
            return null;
          }
          return (
            <NavLink to={k}>
              <Button key={k} variant={page === k && "primary"}>
                {route.init.icon && <i className={route.init.icon}></i>}
                {route.init.name}
              </Button>
            </NavLink>
          );
        })}
    </ButtonGroup>
    <Widget
      src="buildhub.near/widget/components.buttons.Connect"
      props={{
        connectedChildren: <div className="text-white">User Dropdown</div>,
        showActivity: false,
        className: "custom-button",
        joinBtnChildren: "Join Now",
        href: "/join",
      }}
    />
  </Navbar>
);

const Footer = (props) => {
  return <></>;
};

// Define the new component that follows the AppLayout pattern
function AppLayout({ routes, page, children }) {
  return (
    <Container>
      <AppHeader page={page} routes={routes} />
      <ContentContainer key={page}>{children}</ContentContainer>
      <Footer page={page} />
    </Container>
  );
}

return { AppLayout };
