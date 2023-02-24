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
  transform: translateX(100%);

  &.show {
    transform: translateX(0);
  }

  .left-side {
    flex: 80;
    background-color: var(--slate-dark-1);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 25px;
    overflow-x: auto;

    .header {
      margin-top: -11px;
      color: #9ba1a6;
      font-weight: 500;
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

  .current-app-wrapper {
    margin-top: 40px;
    > div {
      > div {
        margin-bottom: 20px;
        :first-of-type {
          margin-bottom: 5px;
        }
        > div {
          :first-of-type {
            border: 0;
          }
        }
      }
    }
    h1 {
      color: #ecedee;
    }

    li {
      border-color: #3a3f42;
    }

    a,
    button {
      border-radius: 50px;
      background-color: #2b2f31;
      color: #ffffff !important;
      border: 0;
    }

    a {
      flex: 50;
      justify-content: center;

      &:first-of-type {
        background-color: #4ecfcf;
        flex: 100%;
        padding: 20px;
        color: #11181c !important;
      }
    }

    button {
      display none;
    }
  }
`;

export function MenuRight(props) {
  return (
    <StyledMenu className={props.showMenu ? "show" : ""}>
      <div className="right-side" onClick={props.onCloseMenu} />
      <div className="left-side">
        <div className="header">Current Component</div>
        <button className="close-button" onClick={props.onCloseMenu}>
          <Close />
        </button>
        <div className="current-app-wrapper">
          <Widget
            src="calebjacob.near/widget/ComponentSummary"
            props={{
              src: props.widgetSrc?.view,
              size: "medium",
              showTags: true,
            }}
          />
        </div>
      </div>
    </StyledMenu>
  );
}
