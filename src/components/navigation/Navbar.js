import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { UserDropdown } from "./desktop/UserDropdown";
import { Widget } from "near-social-vm";
import { useBosLoaderStore } from "../../stores/bos-loader";

const StyledNavbar = styled.nav`
  display: flex;
  width: 100%;
  padding: 24px 48px;
  align-items: center;
  justify-content: space-between;

  .logo {
    flex-grow: 1;
    flex-basis: 0;

    img {
      width: auto;
      height: 32px;
      flex-shrink: 0;
      object-fit: cover;
    }
  }

  .active {
    border-radius: 8px;
    background: var(--Yellow, #ffaf51) !important;
    color: var(--black-100, #000) !important;

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .sign-in {
    all: unset;

    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    border: 1px solid var(--white-100, #fff);

    color: var(--white-100, #fff);
    transition: all 300ms;

    &:hover {
      text-decoration: none;
      background: #fff;
      color: #000;
    }

    cursor: pointer;

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const NavLink = styled.a`
  all: unset;

  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 8px;
  background: var(--bg-2, #23242b) !important;
  color: var(--white-100, #fff) !important;

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: pointer;
  transition: all 300ms;

  &:hover {
    text-decoration: none;
    background: #ffaf51 !important;
    color: #000 !important;
  }
`;

const MobileDropdownButton = styled.button`
  all: unset;

  color: #fff;
  padding: 0.5rem;
  font-size: 2rem;
`;

const MobileLink = styled.a`
  all: unset;

  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 8px;
  border: 1px solid var(--white-100, #fff);

  color: var(--white-100, #fff);
  transition: all 300ms;

  &:hover {
    text-decoration: none;
    background: #fff;
    color: #000;
  }

  cursor: pointer;

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const logoLink =
  "https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya";

export function Navbar(props) {
  const redirectStore = useBosLoaderStore();
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = useCallback(() => {
    setDropdown((prev) => !prev);
  }, []);

  return (
    <div
      style={{
        borderBottom:
          "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))",
      }}
    >
      <StyledNavbar className="container-xl position-relative">
        <div className="logo">
          <a href="/" style={{ all: "unset", cursor: "pointer" }}>
            <img src={logoLink} />
          </a>
        </div>
        <div className="d-none flex-grow-1 justify-content-center d-md-flex align-items-center gap-3">
          <NavLink
            href="/"
            className={`${window.location.href === `${window.location.origin}/` && "active"
              }`}
          >
            Home
          </NavLink>
          <NavLink
            href="/edit"
            className={`${window.location.href === `${window.location.origin}/edit` &&
              "active"
              }`}
          >
            Editor
          </NavLink>
          <NavLink href={props.documentationHref}>Docs</NavLink>
          <NavLink
            href="/feed"
            className={`${window.location.href === `${window.location.origin}/feed` &&
              "active"
              }`}
          >
            Feed
          </NavLink>
          <NavLink
            href="/resources"
            className={`${window.location.href === `${window.location.origin}/resources` &&
              "active"
              }`}
          >
            Resources
          </NavLink>
        </div>
        <div className="d-none d-md-block flex-grow-1" style={{ flexBasis: 0 }}>
        {!props.signedIn && (
            <button className="sign-in" onClick={props.requestSignIn}>
              Sign In
            </button>
          )}
          {props.signedIn && (
            <Widget
              src="buildhub.near/widget/components.buttons.JoinNow"
              config={{
                redirectMap: redirectStore.redirectMap,
              }}
              props={{
                children: <UserDropdown {...props} />,
              }}
            />
            )}
        </div>
        
        <div className="d-block d-md-none">
          <MobileDropdownButton onClick={toggleDropdown}>
            <i className={`bi ${dropdown ? "bi-x" : "bi-list"}`}></i>
          </MobileDropdownButton>
        </div>
        <div
          className={`d-md-none ${dropdown ? "d-flex" : "d-none"
            } w-100 flex-column gap-3 text-white position-absolute start-50 top-100 shadow`}
          style={{
            transform: "translateX(-50%)",
            background: "#0b0c14",
            padding: "24px 48px",
            zIndex: 5,
            borderBottom: "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))"
          }}
        >
          <MobileLink
            href="/"
            className={`${window.location.href === `${window.location.origin}/` && "active"
              }`}
          >
            Home
          </MobileLink>
          <MobileLink
            href="/edit"
            className={`${window.location.href === `${window.location.origin}/edit` &&
              "active"
              }`}
          >
            Editor
          </MobileLink>
          <MobileLink
            href="/feed"
            className={`${window.location.href === `${window.location.origin}/feed` &&
              "active"
              }`}
          >
            Feed
          </MobileLink>
          <MobileLink
            href="/resources"
            className={`${window.location.href === `${window.location.origin}/resources` &&
              "active"
              }`}
          >
            Resources
          </MobileLink>
          <MobileLink href={props.documentationHref}>Docs</MobileLink>

          {props.signedIn ?
            <div>
              <Widget
                src="buildhub.near/widget/components.buttons.JoinNow"
                config={{
                  redirectMap: redirectStore.redirectMap,
                }}
                props={{
                  children: <UserDropdown {...props} />,
                }}
              />
            </div>
            : <button className="sign-in my-3" onClick={props.requestSignIn}>
              Sign In
            </button>}
        </div>
      </StyledNavbar>
    </div>
  );
}

