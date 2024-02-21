import React, { useRef } from "react";
import styled from "styled-components";
import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import { NotificationWidget } from "../NotificationWidget";
import Feedback from "./Feedback";
import { DevActionsDropdown } from "./DevActionsDropdown";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const feedbackLinks = [
  {
    label: "Issue Report",
    url: "https://www.potlock.org/feedback",
  },
  {
    label: "Docs",
    url: "https://www.potlock.org/docs",
  },
  {
    label: "Chat",
    url: "https://www.potlock.org/community",
  },
  {
    label: "Tutorial",
    url: "https://www.potlock.org/tutorial",
  },
];

export function DesktopNavigation(props) {
  const tooltipRef = useRef();
  return (
    <>
      <Nav>
        {props.signedIn ? (
          <UserDropdown {...props} />
        ) : (
          <SignInButton onSignIn={() => props.requestSignIn()} />
        )}
        {/* <DevActionsDropdown {...props} /> */}
      </Nav>
      <Tooltip
        anchorSelect="#feedback-btn"
        place={"top"}
        clickable
        openOnClick={true}
        ref={tooltipRef}
        className="feedback-container"
      >
        {feedbackLinks.map((link) => (
          <a
            href={link.url}
            target="_blank"
            key={link.label}
            onClick={() => tooltipRef.current.close()}
          >
            {link.label}
          </a>
        ))}
      </Tooltip>
      <Feedback tooltipRef={tooltipRef} />
    </>
  );
}
const Nav = styled.div`
  display: flex;
  height: 110px;
  gap: 1rem;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  margin-right: 64px;
  @media screen and (max-width: 768px) {
    height: 96px;
    margin-right: 8px;
  }
`;
const StyledNavigation = styled.div`
  width: 100%;
  padding: 12px 0;

  .user-section {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    > button {
      font-size: 14px;
    }
  }
  .container {
    display: flex;
    align-items: center;
    flex-wrap: wrap-reverse;
    gap: 3rem;
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
      .nav-sign-in-btn {
        margin-left: 10px;
        transition: all 300ms ease-in-out;
        /* animation: gelatine infinite ease-in-out 5s both; */
        transition: all 300ms ease;
        :hover {
          filter: drop-shadow(0 0 1px var(--slate-dark-6))
            drop-shadow(0 0 5px var(--slate-dark-6))
            drop-shadow(0 0 16px var(--slate-dark-6));
        }
      }
    }

    .arrow-up-right {
      margin-left: 4px;
    }
  }
`;
