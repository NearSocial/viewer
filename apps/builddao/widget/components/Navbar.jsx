const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const NavContainer = styled.div`
  display: flex;
  padding: 24px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  font-family: "Poppins", sans-serif;

  background-color: var(--bg, #000);
  border-bottom: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 50px;

  @media screen and (max-width: 960px) {
    gap: 16px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;

  @media screen and (max-width: 960px) {
    gap: 16px;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    position: fixed;
    background: var(--bg, #000);
    z-index: 1001;
    padding: 24px 48px;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  span {
    color: var(--text-white, #fff);
  }

  .active {
    color: var(--eca-227, #eca227);
    font-weight: 700;
  }

  @media screen and (max-width: 960px) {
    gap: 16px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-top: 38px;
    span {
      font-size: 20px;
    }
  }
`;

const StyledDropdown = styled.div`
  .dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #23242b;
    color: #fff;
    border-radius: 8px;
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
    background-color: #23242b;
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

const MobileContent = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

function Navbar(props) {
  const { page, routes } = props;
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <NavContainer>
      <MainContent className="container-xl">
        <Left>
          <Link
            to={href({
              widgetSrc: "buildhub.near/widget/app",
              params: {
                page: "home",
              },
            })}
            className="d-flex align-items-center"
          >
            <img
              className="object-fit-cover"
              style={{ height: 46 }}
              src="https://ipfs.near.social/ipfs/bafkreiglw3t6b3dx2axk7x4ftzk6pwwe6ziiyexlszlkhenxist6osrlbe"
            />
          </Link>
          <NavLinks>
            {routes &&
              (Object.keys(routes) || []).map((k) => {
                const route = routes[k];
                if (route.hide) {
                  return null;
                }
                return (
                  <Link
                    key={`desktop=${k}`}
                    style={{ textDecoration: "none" }}
                    to={href({
                      widgetSrc: "buildhub.near/widget/app",
                      params: {
                        page: k,
                      },
                    })}
                  >
                    <span key={k} className={page === k ? "active" : null}>
                      {route.init.icon && <i className={route.init.icon}></i>}
                      {route.init.name}
                    </span>
                  </Link>
                );
              })}
          </NavLinks>
        </Left>
        <Right>
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
                <i style={{ color: "white" }} className="bi bi-three-dots"></i>
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
          </div>
          {context.accountId ? (
            <Widget
              src="buildhub.near/widget/components.buttons.UserDropdown"
              loading=""
              props={props}
            />
          ) : (
            <Button
              variant="primary"
              linkClassName="d-flex"
              href="https://nearbuilders.org/join"
              noLink={true}
              className="w-100"
            >
              Sign In
            </Button>
          )}
        </Right>
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
              className="object-fit-cover"
              onClick={() => setDropdown(false)}
              src="https://ipfs.near.social/ipfs/bafkreifotevq6g6ralhvutlcssaasa7xbfjjc6mbo5hlnvgpxxgfmwswmq"
              style={{ height: 40 }}
              alt="BuildDAO"
            />
          </Link>
          <Button
            type="icon"
            variant="outline"
            className="rounded-2 border-0"
            onClick={toggleDropdown}
          >
            <i style={{ fontSize: 24 }} className="bi bi-list"></i>
          </Button>
        </MobileNavigation>
      </MainContent>

      {dropdown && (
        <MobileView>
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
                onClick={() => setDropdown(false)}
                src="https://ipfs.near.social/ipfs/bafkreifotevq6g6ralhvutlcssaasa7xbfjjc6mbo5hlnvgpxxgfmwswmq"
                style={{ height: 40 }}
                alt="BuildDAO"
              />
            </Link>
            <Button
              type="icon"
              variant="outline"
              className="rounded-2 border-0"
              onClick={toggleDropdown}
            >
              <i style={{ fontSize: 24 }} className="bi bi-list"></i>
            </Button>
          </MobileNavigation>
          <MobileContent>
            <NavLinks>
              {routes &&
                (Object.keys(routes) || []).map((k) => {
                  const route = routes[k];
                  if (route.hide) {
                    return null;
                  }
                  return (
                    <Link
                      key={`mobile=${k}`}
                      style={{ textDecoration: "none" }}
                      to={href({
                        widgetSrc: "buildhub.near/widget/app",
                        params: {
                          page: k,
                        },
                      })}
                    >
                      <span
                        onClick={toggleDropdown}
                        key={k}
                        className={page === k ? "active" : null}
                      >
                        {route.init.icon && <i className={route.init.icon}></i>}
                        {route.init.name}
                      </span>
                    </Link>
                  );
                })}
            </NavLinks>
            <div className="d-flex flex-column gap-2 w-100">
              <div className="d-flex gap-2">
                <Button
                  linkClassName="d-flex w-100"
                  className="w-100"
                  href={href({
                    widgetSrc: "buildhub.near/widget/app",
                    params: {
                      page: "inspect",
                      widgetPath: routes[page].path,
                    },
                  })}
                >
                  <span>View source</span>
                </Button>
                <Button
                  linkClassName="d-flex w-100"
                  className="w-100"
                  href={`/edit/${routes[page].path}`}
                >
                  Edit Code
                </Button>
              </div>
              {context.accountId ? (
                <div className="mx-auto d-flex align-items-stretch ">
                  <Widget
                    src="buildhub.near/widget/components.buttons.UserDropdown"
                    loading=""
                    props={props}
                  />
                </div>
              ) : (
                <>
                  <Button
                    variant="primary"
                    linkClassName="d-flex"
                    href="https://nearbuilders.org/join"
                    noLink={true}
                    className="w-100"
                    onClick={() => setDropdown(false)}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </MobileContent>
        </MobileView>
      )}
    </NavContainer>
  );
}

return <Navbar {...props} />;
