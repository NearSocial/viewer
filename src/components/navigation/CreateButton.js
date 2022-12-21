import React from "react";
import { Link } from "react-router-dom";
import { Glitter } from "../icons/Glitter";
import styled from "styled-components";

const StyledButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  padding: 8px 16px;
  font-weight: 600;
  display: inline-block;
  height: 40px;
  background-color: var(--blue-light-9);
  border-color: var(--blue-light-9);
  color: white;

  svg {
    margin-right: 6px;
  }

  :hover {
    text-decoration: none;
    color: white;
  }
`;

export function CreateButton(props) {
  return (
    <StyledButton className='nav-create-btn' to='/edit/new'>
      <Glitter />
      Create
    </StyledButton>
  );
}