import React from "react";
import styled from "styled-components";
import { Widget } from "near-social-vm";
import { NavDropdownMenuLinkList } from "./NavDropdownMenuLinkList";

const StyledNavDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  background-color: #202425;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  visibility: hidden;

  &.show {
    visibility: visible;
    opacity: 1;
  }

  .container {
    padding: 25px 0;
    display: flex;
    align-items: stretch;
    .section {
      width: 50%;

      :nth-child(2) {
        border-left: 1px solid #313538;
        padding-left: 25px;
      }

      .section-title {
        color: #9ba1a6;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 12px;
      }
    }
  }
  .current-app-wrapper {
    margin-top: 24px;
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
      &:first-of-type {
        background-color: #4ecfcf;
        color: #11181c !important;
      }
    }
  }
`;

export function NavDropdownMenu(props) {
  return (
    <StyledNavDropdownMenu className={props.menuDropdown ? "show" : ""}>
      <div className="container">
        <div className="section">
          <div className="section-title">Current component</div>
          <div className="current-app-wrapper">
            <Widget
              src={props.widgets.componentSummary}
              props={{
                src: props.widgetSrc?.view,
                size: "medium",
                showTags: true,
              }}
            />
          </div>
        </div>
        {props.menuDropdown === "discover" ? (
          <div className="section">
            <div className="section-title">Discover</div>
            <NavDropdownMenuLinkList
              category="discover"
              onClick={props.onClickLink}
              {...props}
            />
          </div>
        ) : (
          <div className="section">
            <div className="section-title">Tools & Resources</div>
            <NavDropdownMenuLinkList
              category="tools"
              onClick={props.onClickLink}
            />
          </div>
        )}
      </div>
    </StyledNavDropdownMenu>
  );
}
