import React from "react";
import styled from "styled-components";
import { Close } from "../../../icons/Close";
import { Components } from "../icons/Components";
import { Notebook } from "../icons/Notebook";
import { Education } from "../icons/Education";
import { Editor } from "../icons/Editor";
import { LogOut } from "../../../icons/LogOut";
import { Withdraw } from "../icons/Withdraw";
import { Community } from "../icons/Community";
import { Widget } from "near-social-vm";
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
      margin-bottom: 40px;
    }

    svg {
      width: 24px;
      height: 24px;
    }

    .nav-sign-in-btn {
      width: fit-content;
    }

    .profile-link {
      max-width: 100%;
      white-space: nowrap;
      margin: 50px 0;

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
      margin-top: 6px;
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
      color: #ecedee;
      font-weight: normal;

      svg {
        margin-right: 12px;
      }

      &.active,
      &:hover,
      &:focus {
        background-color: transparent;
        color: white;
        text-decoration: none;
      }
    }
  }

  .bottom-links {
    margin-top: auto;

    a,
    button {
      padding: 14px 0;
      color: #9ba1a6;
    }
  }

  .links-title {
    color: #9ba1a6;
    font-size: 10px;
    text-transform: uppercase;

    :last-of-type {
      margin-top: 30px;
    }
  }

  .log-out-button {
    background: none;
    border: none;
    color: var(--slate-dark-11);
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
    top: 8px;
    padding: 6px;

    svg {
      margin: 0;

      path {
        stroke: white;
      }
    }
  }

  .right-side {
    flex: 20;
    opacity: 0.8;
    background-color: var(--slate-dark-1);
  }
`;

export function MenuLeft(props) {
  return (
    <StyledMenu className={props.showMenu ? "show" : ""}>
      <div className="left-side">
        <button className="close-button" onClick={props.onCloseMenu}>
          <Close />
        </button>
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
                style: { width: "48px", height: "48px" },
              }}
            />
            {props.widgets.profileName && (
              <div className="profile-name">
                <Widget src={props.widgets.profileName} />
              </div>
            )}
            <div className="profile-username">@{props.signedAccountId}</div>
          </Link>
        ) : (
          <SignInButton
            onSignIn={() => {
              props.onCloseMenu();
              props.requestSignIn();
            }}
          />
        )}
        <div className="links-title">Discover</div>
        <ul className="top-links">
          <li>
            <NavigationButton route="/calebjacob.near/widget/ComponentsPage">
              <Components />
              Components
            </NavigationButton>
          </li>
          <li>
            <NavigationButton route="/calebjacob.near/widget/PeoplePage">
              <Community />
              Community
            </NavigationButton>
          </li>
        </ul>
        <div className="links-title">Develop</div>
        <ul className="top-links">
          <li>
            <NavigationButton route="/edit">
              <Editor />
              Editor
            </NavigationButton>
          </li>
          <li>
            <NavigationButton href="https://thewiki.near.page/near.social_docs">
              <Notebook />
              Documentation
            </NavigationButton>
          </li>
          <li>
            <NavigationButton href="https://thewiki.near.page/near.social_tutorial">
              <Education />
              Toturials
            </NavigationButton>
          </li>
        </ul>
        <ul className="bottom-links">
          {props.signedIn && (
            <li>
              <button className="log-out-button">
                <Withdraw />
                Withdraw {props.availableStorage.div(1000).toFixed(2)}kb
              </button>
              <button onClick={() => props.logOut()} className="log-out-button">
                <LogOut />
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="right-side" onClick={props.onCloseMenu} />
    </StyledMenu>
  );
}
