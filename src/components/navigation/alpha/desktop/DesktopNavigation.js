import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { NavigationButton } from "../NavigationButton";
import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import { NavDropdownMenu } from "./nav_dropdown/NavDropdownMenu";
import { NavDropdownButton } from "./NavDropdownButton";
import { NotificationWidget } from "../NotificationWidget";

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-1);
  z-index: 1000;
  padding: 12px 0;

  .logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-section {
    margin-left: auto;
    > button {
      font-size: 14px;
    }
  }

  > .container {
    display: flex;
    align-items: center;

    .navigation-section {
      margin-left: 50px;
      display: flex;

      > div {
        > a {
          margin-right: 20px;
        }
      }
      > button {
        margin-right: 20px;
      }
    }

    .user-section {
      display: flex;
      align-items: center;

      .nav-create-btn {
        margin-left: 10px;
      }
    }

    .arrow-up-right {
      margin-left: 4px;
    }
  }
`;

export function DesktopNavigation(props) {
  const [menuDropdown, setMenuDropdown] = useState(false);
  return (
    <StyledNavigation onMouseLeave={() => setMenuDropdown(false)}>
      <div className="container">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        <div className="navigation-section">
          <NavigationButton
            onMouseEnter={() => setMenuDropdown(false)}
            route="/"
          >
            Home
          </NavigationButton>
          <NavDropdownButton onMouseEnter={() => setMenuDropdown("discover")}>
            Discover
          </NavDropdownButton>
          <NavDropdownButton onMouseEnter={() => setMenuDropdown("develop")}>
            Develop
          </NavDropdownButton>
        </div>
        <div className="user-section">
          {!props.signedIn && (
            <SignInButton onSignIn={() => props.requestSignIn()} />
          )}
          {props.signedIn && (
            <>
              <NotificationWidget
                notificationButtonSrc="calebjacob.near/widget/NotificationButton"
                onMouseEnter={() => setMenuDropdown(false)}
              />
              <UserDropdown
                {...props}
                onMouseEnter={() => setMenuDropdown(false)}
              />
            </>
          )}
        </div>
      </div>
      <NavDropdownMenu
        {...props}
        menuDropdown={menuDropdown}
        onClickLink={() => setMenuDropdown(false)}
      />
    </StyledNavigation>
  );
}
