import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Logotype } from "../Logotype";
import { NavigationButton } from "../NavigationButton";
import { ArrowUpRight } from "../../icons/ArrowUpRight";
import { SignInButton } from "../SignInButton";
import { CreateButton } from "../CreateButton";
import { UserDropdown } from "./UserDropdown";
import { Widget } from "../../Widget/Widget";

const StyledNavigation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-1);
  z-index: 1000;
  padding: 12px 0;

  .user-section {
    margin-left: auto;
    > button {
      font-size: 14px;
    }
  }

  .container {
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

  .nav-notification-widget {
    margin: 0 15px;
    background-color: var(--slate-dark-5);
    height: 40px;
    width: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      color: var(--slate-dark-11) !important;

      i {
        font-size: 17px !important;
      }
    }
  }
`;

export function DesktopNavigation(props) {
  return (
    <StyledNavigation>
      <div className="container">
        <Link to="/" className="logo-link">
          <Logotype />
        </Link>
        <div className="navigation-section">
          <NavigationButton route="/">Home</NavigationButton>
          <NavigationButton route="/edit">Editor</NavigationButton>
          <NavigationButton href="https://thewiki.near.page/near.social_docs">
            Documentation
            <ArrowUpRight />
          </NavigationButton>
        </div>
        <div className="user-section">
          {!props.signedIn && (
            <SignInButton onSignIn={() => props.requestSignIn()} />
          )}
          <CreateButton />
          {props.signedIn && (
            <div className="nav-notification-widget">
              <Widget src={props.NearConfig.widgets.notificationButton} />
            </div>
          )}
          {props.signedIn && <UserDropdown {...props} />}
        </div>
      </div>
    </StyledNavigation>
  );
}
