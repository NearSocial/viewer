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
    <StyledNavigation>
      <div className="container">
        {/* <Link
          to="/"
          className="logo-link"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Logotype />
        </Link>
        <div className="navigation-section">
          <NavigationButton route="/">Home</NavigationButton>
          <NavigationButton route="/edit">Editor</NavigationButton>
          <NavigationButton href={props.documentationHref}>
            Docs
            <ArrowUpRight />
          </NavigationButton>
        </div> */}
        <div className="user-section">
          {/* <StarButton {...props} /> */}

          <DevActionsDropdown {...props} />

          {!props.signedIn && (
            <SignInButton onSignIn={() => props.requestSignIn()} />
          )}
          {props.signedIn && (
            <>
              <NotificationWidget
                notificationButtonSrc={props.widgets.notificationButton}
              />
              <UserDropdown {...props} />
            </>
          )}
        </div>
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
      </div>
    </StyledNavigation>
  );
}

const StyledNavigation = styled.div`
  width: 100%;
  padding: 12px 0;

  .user-section {
    margin-right: auto;
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
      }
    }

    .arrow-up-right {
      margin-left: 4px;
    }
  }
`;
