import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoBlack from "../icons/logo-black.svg";
import CodeSmall from "../icons/code-small.svg";
import { AvatarPlaceholder } from "../icons/AvatarPlaceholder";
import { Widget } from "near-social-vm";

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #eceef0;
  z-index: 1000;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .nav-notification-widget {
    margin: 0;
  }

  .mobile-nav-profile-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    outline: none;
    border: 0;
    border-radius: 50%;

    img,
    svg {
      border-radius: 50% !important;
    }
  }

  .mobile-nav-develop-btn {
    background: none;
    border: none;
    padding: 0;
    outline: none;
  }
`;

export function TopNavigation(props) {
  return (
    <StyledNavigation>
      <button
        onClick={() => props.onClickShowMenu("left")}
        className="mobile-nav-profile-btn"
      >
        {props.signedIn ? (
          <Widget
            src={props.widgets.profileImage}
            props={{
              accountId: props.signedAccountId,
              className: "d-inline-block",
              style: { width: "32px", height: "32px" },
            }}
          />
        ) : (
          <AvatarPlaceholder />
        )}
      </button>
      <Link to="/" className="logo-link">
        <img src={LogoBlack} />
      </Link>
      <button
        className="mobile-nav-develop-btn"
        onClick={() => props.onClickShowMenu("right")}
      >
        <img src={CodeSmall} />
      </button>
    </StyledNavigation>
  );
}
