import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const StyledNavigationButton = styled.div`
  a {
    color: var(--slate-dark-11);
    font-size: 16px;
    padding: 10px;
    border-radius: 8px;
    font-weight: var(--font-weight-bold);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &.active {
      color: white;
      text-decoration: none;
    }
  }
  &.disabled {
    opacity: 0.5;
  }
`;

export function NavigationButton(props) {
  return (
    <StyledNavigationButton
      onMouseEnter={props.onMouseEnter}
      className={props.disabled ? "disabled" : ""}
    >
      {props.route ? (
        <NavLink
          onClick={(e) => {
            if (props.disabled) {
              e.preventDefault();
            }
          }}
          to={props.route}
          exact
          isActive={(match, location) => {
            if (
              location.pathname !== "/" &&
              props.route.includes(location.pathname)
            ) {
              return true;
            }
            if (props.homeRoute) {
              if (location.pathname === "/") {
                return true;
              }
              return location.pathname === `/${props.widgets?.default}`;
            }
          }}
        >
          {props.children}
        </NavLink>
      ) : (
        <a href={props.href} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      )}
    </StyledNavigationButton>
  );
}
