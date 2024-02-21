const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const Navbar = styled.div`
  width: 64px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  width: 100%;

  background-color: #0b0c14;
  border-bottom: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));

  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    width: 100%;

    a {
      display: flex;
    }
  }
`;

const DesktopNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileNavigation = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const NavLink = ({ to, children }) => (
  <Link
    key={to}
    // to={`/?page=${to}`}
    to={href({
      widgetSrc: "buildhub.near/widget/app",
      params: {
        page: to,
      },
    })}
  >
    {children}
  </Link>
);

const [showMenu, setShowMenu] = useState(false);
const toggleDropdown = () => setShowMenu(!showMenu);

const SignInOrConnect = () => (
  <>
    {context.accountId ? (
      <Widget
        src="buildhub.near/widget/components.buttons.UserDropdown"
        props={{ logOut: props.logOut }}
      />
    ) : (
      <a
        href={"https://nearbuilders.org/join"}
        style={{ textDecoration: "none" }}
      >
        <Button variant={"outline"}>Sign In</Button>
      </a>
    )}
  </>
);

const StyledDropdown = styled.div`
  .dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--slate-dark-5);
    border-radius: 50px;
    outline: none;
    border: 0;
    width: 40px;
    height: 40px;

    &:after {
      display: none;
    }

    .menu {
      width: 18px;
      height: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      div {
        background-color: var(--slate-dark-11);
        height: 2px;
        width: 100%;
        border-radius: 30px;
      }
    }

    :hover {
      .menu {
        div {
          background-color: white;
        }
      }
    }
  }

  ul {
    background-color: var(--slate-dark-5);
    width: 100%;

    li {
      padding: 0 6px;
    }

    button,
    a {
      color: var(--slate-dark-11);
      display: flex;
      align-items: center;
      border-radius: 8px;
      padding: 12px;

      :hover,
      :focus {
        text-decoration: none;
        background-color: var(--slate-dark-1);
        color: white;

        svg {
          path {
            stroke: white;
          }
        }
      }

      svg {
        margin-right: 7px;
        path {
          stroke: var(--slate-dark-9);
        }
      }
    }
  }
`;

const AppHeader = ({ page, routes, ...props }) => (
  <Navbar>
    <div className="d-flex align-items-center justify-content-between w-100">
      <DesktopNavigation className="container-xl">
        <Link
          style={{ flex: 1 }}
          to={href({
            widgetSrc: "buildhub.near/widget/app",
            params: {
              page: "home",
            },
          })}
        >
          <img
            style={{ width: 85, objectFit: "cover" }}
            src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
            alt="Build DAO Logo"
          />
        </Link>
        <ButtonGroup style={{ flex: 1 }}>
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

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <StyledDropdown className="dropdown">
            <button
              className="dropdown-toggle"
              type="button"
              id="dropdownMenu2222"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i style={{ color: "white" }} className="bi bi-list"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2222">
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  href={href({
                    widgetSrc: "buildhub.near/widget/app",
                    params: {
                      page: "inspect",
                      widgetPath: routes[page].path,
                    },
                  })}
                  type="icon"
                  variant="outline"
                  className="d-flex align-tiems-center gap-2"
                >
                  <i className="bi bi-code"></i>
                  <span>View source</span>
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  href={`/edit/${routes[page].path}`}
                  type="icon"
                  variant="outline"
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-pencil"></i>
                  <span>Edit code</span>
                </Link>
              </li>
            </ul>
          </StyledDropdown>
          <SignInOrConnect />
        </div>
      </DesktopNavigation>
      <MobileNavigation>
        <Link
          to={href({
            widgetSrc: "buildhub.near/widget/app",
            params: {
              page: "home",
            },
          })}
        >
          <img
            style={{ width: 85, objectFit: "cover" }}
            src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
            alt="Build DAO Logo"
          />
        </Link>
        <Button
          type="icon"
          variant="outline"
          className="rounded-2"
          onClick={toggleDropdown}
        >
          <i style={{ fontSize: 24 }} className="bi bi-list"></i>
        </Button>
      </MobileNavigation>
    </div>
    <MobileNavigation>
      {showMenu && (
        <div className="text-white w-100 d-flex flex-column gap-3 mt-3">
          <ButtonGroup className="align-items-stretch">
            {routes &&
              (Object.keys(routes) || []).map((k) => {
                const route = routes[k];
                if (route.hide) {
                  return null;
                }
                return (
                  <NavLink to={k} style={{ textDecoration: "none" }}>
                    <Button
                      key={k}
                      variant={page === k && "primary"}
                      className="w-100"
                      onClick={() => setShowMenu(false)}
                    >
                      {route.init.icon && <i className={route.init.icon}></i>}
                      {route.init.name}
                    </Button>
                  </NavLink>
                );
              })}
          </ButtonGroup>
          <div className="d-flex w-100 align-items-center gap-3 justify-content-center">
            <StyledDropdown className="dropdown">
              <button
                className="dropdown-toggle"
                type="button"
                id="dropdownMenu2222"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i style={{ color: "white" }} className="bi bi-list"></i>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu2222">
                <li>
                  <Link
                    style={{ textDecoration: "none" }}
                    href={href({
                      widgetSrc: "buildhub.near/widget/app",
                      params: {
                        page: "inspect",
                        widgetPath: routes[page].path,
                      },
                    })}
                    type="icon"
                    variant="outline"
                    className="d-flex align-tiems-center gap-2"
                  >
                    <i className="bi bi-code"></i>
                    <span>View source</span>
                  </Link>
                </li>
                <li>
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/edit/${routes[page].path}`}
                    type="icon"
                    variant="outline"
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-pencil"></i>
                    <span>Edit code</span>
                  </Link>
                </li>
              </ul>
            </StyledDropdown>
            <SignInOrConnect />
          </div>
        </div>
      )}
    </MobileNavigation>
  </Navbar>
);

return <AppHeader page={props.page} routes={props.routes} {...props} />;
