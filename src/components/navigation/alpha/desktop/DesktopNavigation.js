import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { Return } from "../icons/Return";
import { NavigationButton } from "../NavigationButton";
import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import { NavDropdownMenu } from "./nav_dropdown/NavDropdownMenu";
import { NavDropdownButton } from "./NavDropdownButton";
import { NotificationWidget } from "../NotificationWidget";
import image from "../icons/search.svg";
import { useHistory } from "react-router-dom";

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-1);
  z-index: 1000;
  padding: 12px 0;

  button,
  a,
  input {
    font-size: 14px;
    font-weight: 500;
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

  input {
    background-repeat: no-repeat;
    background-repeat: no-repeat;
    border-radius: 50px;
    padding: 10px 25px 10px 44px;
    background-position: 12px 8px;
    border: 0;
    background-color: #2b2f31;
    font-weight: 500;
    color: white;
    margin-left: 50px;

    :focus {
      border: 0;
      outline: 0;
    }

    ::placeholder {
      color: #9ba1a6;
      font-weight: 500;
    }
  }

  .form-wrapper {
    position: relative;

    svg {
      position: absolute;
      right: 16px;
      top: 10px;
      width: 20px;
      height: 20px;
    }
  }
`;

export function DesktopNavigation(props) {
  const [menuDropdown, setMenuDropdown] = useState(false);
  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const history = useHistory();
  return (
    <StyledNavigation onMouseLeave={() => setMenuDropdown(false)}>
      <div className="container">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        <div className="form-wrapper">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              history.push(
                `/calebjacob.near/widget/GlobalSearchPage?term=${e.target[0].value}`
              );
            }}
          >
            <input
              placeholder="Search"
              style={{ backgroundImage: `url(${image})` }}
              onFocus={() => setSearchInputFocus(true)}
              onBlur={() => setSearchInputFocus(false)}
            />
          </form>
          {searchInputFocus && <Return />}
        </div>
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
