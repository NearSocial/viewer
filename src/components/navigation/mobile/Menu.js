import React from "react";
import styled from "styled-components";
import { Close } from "../../icons/Close";
import { Home } from "../../icons/Home";
import { Book } from "../../icons/Book";
import { Code } from "../../icons/Code";
import { LogOut } from "../../icons/LogOut";
import { Fork } from "../../icons/Fork";
import { UserCircle } from "../../icons/UserCircle";
import { Widget } from "../../Widget/Widget";
import { NavigationButton } from "../NavigationButton";
import { SignInButton } from "../SignInButton";
import { Link } from "react-router-dom";

const StyledMenu = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  transition: 350ms;
  transform: translateX(-100%);

  &.show {
    transform: translateX(0);
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .left-side {
    flex: 80;
    background-color: var(--slate-dark-1);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 25px;
    overflow-x: auto;

    .nav-sign-in-btn {
      width: fit-content;
    }

    .profile-link {
      max-width: 100%;
      white-space: nowrap;

      :hover {
        text-decoration: none;
      }
    }

    img {
      border-radius: 50% !important;
    }

    .profile-name {
      color: var(--slate-dark-12);
      font-weight: var(--font-weight-bold);
      margin-top: 10px;
    }

    .profile-username {
      color: var(--slate-dark-11);
    }

    .profile-name,
    .profile-username {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .top-links,
  .bottom-links {
    a,
    button {
      justify-content: flex-start;
      padding: 28px 0;
      display: flex;
      align-items: center;
      color: var(--slate-dark-11);
      font-weight: var(--font-weight-bold);

      svg {
        margin-right: 12px;
      }

      &.active,
      &:hover,
      &:focus {
        background-color: transparent;
        color: white;
        text-decoration: none;
        svg {
          path {
            stroke: white;
          }
        }
      }
    }
  }

  .top-links {
    margin-top: 40px;
  }

  .bottom-links {
    margin-top: auto;

    a,
    button {
      padding: 14px 0;
    }
  }

  .log-out-button {
    background: none;
    border: none;
    color: var(--slate-dark-11);
    font-weight: var(--font-weight-bold);
    padding: 28px 0;

    svg {
      path {
        stroke: #9ba1a6;
      }
    }
  }

  .close-button {
    background: none;
    border: none;
    position: absolute;
    right: 16px;
    top: 16px;
    padding: 10px;

    svg {
      margin: 0;
    }
  }

  .right-side {
    flex: 20;
    opacity: 0.8;
    background-color: var(--slate-dark-1);
  }
`;

export function Menu(props) {
  return (
    <StyledMenu className={props.showMenu ? "show" : ""}>
      <div className="left-side">
        {props.signedIn ? (
          <Link
            to={`/${props.widgets.profilePage}?accountId=${props.signedAccountId}`}
            className="profile-link"
          >
            <Widget
              src={props.widgets.profileImage}
              props={{
                accountId: props.signedAccountId,
                className: "d-inline-block",
                style: { width: "56px", height: "56px" },
              }}
            />
            {props.widgets.profileName && (
              <div className="profile-name">
                <Widget src={props.widgets.profileName} />
              </div>
            )}
            <div className="profile-username">{props.signedAccountId}</div>
          </Link>
        ) : (
          <SignInButton
            onSignIn={() => {
              props.onCloseMenu();
              props.requestSignIn();
            }}
          />
        )}
        <ul className="top-links">
          <li>
            <NavigationButton route="/">
              <Home />
              Home
            </NavigationButton>
          </li>
          <li>
            <NavigationButton
              disabled={!props.signedIn}
              route={`/${props.widgets.profilePage}?accountId=${props.signedAccountId}`}
            >
              <UserCircle />
              Profile
            </NavigationButton>
          </li>
          <li>
            <NavigationButton route="/edit">
              <Code />
              Create
            </NavigationButton>
          </li>
          <li>
            <NavigationButton href="https://thewiki.near.page/near.social_docs">
              <Book />
              Documentation
            </NavigationButton>
          </li>
        </ul>
        <ul className="bottom-links">
          {props.widgetSrc?.edit && (
            <li>
              <Link to={`/edit/${props.widgetSrc?.edit}`}>
                <Fork />
                {props.widgetSrc.edit.startsWith(
                  `${props.signedAccountId}/widget/`
                )
                  ? "Edit widget"
                  : "Fork widget"}
              </Link>
            </li>
          )}
          {props.widgetSrc?.view && (
            <li>
              <Link
                to={`/${props.widgets.viewSource}?src=${props.widgetSrc?.view}`}
              >
                <Code />
                View source
              </Link>
            </li>
          )}
          {props.signedIn && (
            <li>
              <button onClick={() => props.logOut()} className="log-out-button">
                <LogOut />
                Sign Out
              </button>
            </li>
          )}
        </ul>
        <button className="close-button" onClick={props.onCloseMenu}>
          <Close />
        </button>
      </div>
      <div className="right-side" onClick={props.onCloseMenu} />
    </StyledMenu>
  );
}
