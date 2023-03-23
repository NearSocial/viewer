import React from "react";
import styled from "styled-components";
import { NavigationButton } from "../NavigationButton";
import { HouseLine } from "../icons/HouseLine";
import { MagnifyingGlass } from "../icons/MagnifyingGlass";
import { UserLarge } from "../icons/UserLarge";
import { Widget } from "near-social-vm";
import { useLocation } from "react-router-dom";
import { Bell } from "../icons/Bell";

const StyledNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #eceef0;
  z-index: 1000;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    background-color: transparent !important;
    svg {
      width: 24px;
      height: 24px;
      path {
        stroke: #11181c;
      }
    }
    &.active {
      svg {
        path {
          stroke: #14c35b;
        }
      }
    }
  }

  .active-link {
    a {
      svg {
        path {
          stroke: #14c35b;
        }
      }
    }
  }

  > div {
    width: 44px;
    height: 40px;
  }

  .bell-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      opacity: 0.4;
    }
  }
`;

export function BottomNavigation(props) {
  const location = useLocation();
  return (
    <StyledNavigation>
      <NavigationButton route="/" homeRoute {...props}>
        <HouseLine />
      </NavigationButton>
      <NavigationButton route={`/${props.widgets.globalSearchPage}`}>
        <MagnifyingGlass />
      </NavigationButton>
      {props.signedIn ? (
        <div
          className={
            location.pathname === `/${props.widgets.notificationsPage}`
              ? "active-link"
              : ""
          }
        >
          <Widget src={props.widgets.notificationButton} />
        </div>
      ) : (
        <div className="bell-wrapper">
          <Bell />
        </div>
      )}
      {props.signedIn ? (
        <NavigationButton
          route={`/${props.widgets.profilePage}?accountId=${props.signedAccountId}`}
        >
          <UserLarge />
        </NavigationButton>
      ) : (
        <div className="bell-wrapper">
          <UserLarge />
        </div>
      )}
    </StyledNavigation>
  );
}
