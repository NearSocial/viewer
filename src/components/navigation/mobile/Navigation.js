import React from "react";
import styled from "styled-components";
import { MobileMenuButton } from "./MobileMenuButton";
import { NearSocialLogo } from "../../icons/NearSocialLogo";

const StyledNavigation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-1);
  z-index: 1000;
  padding: 16px 14px;
  display: flex;
  align-items: center;
  transition: 350ms;

  &.hide {
    transform: translateY(-100%);
  }

  > svg {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }
`;

export function Navigation(props) {
  return (
    <StyledNavigation className={props.showMenu ? "hide" : ""}>
      <MobileMenuButton onClick={props.onClickShowMenu} />
      <NearSocialLogo />
    </StyledNavigation>
  );
}
