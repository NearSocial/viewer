import React from "react";
import styled from "styled-components";

const StyledNavDropdownButton = styled.button`
  color: var(--slate-dark-11);
  font-size: 16px;
  padding: 10px;
  font-weight: var(--font-weight-bold);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 0;

  &:hover,
  &.active {
    color: white;
    text-decoration: none;
  }
`;

export function NavDropdownButton(props) {
  return (
    <StyledNavDropdownButton onMouseEnter={props.onMouseEnter}>
      {props.children}
    </StyledNavDropdownButton>
  );
}
