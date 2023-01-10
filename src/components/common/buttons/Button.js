import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  padding: 8px 16px;
  font-weight: var(--font-weight-bold);
  display: inline-block;
  height: 40px;
`;

export function Button(props) {
  return (
    <StyledButton
      className={props.className}
      onClick={props.onClick}
      title={props.title}
      disabled={props.disabled}
    >
      {props.children}
    </StyledButton>
  );
}
