import React from "react";
import styled from "styled-components";
const Feedback = ({ tooltipRef }) => {
  return (
    <Container
      id="feedback-btn"
      onClick={() =>
        tooltipRef.current.isOpen ? tooltipRef.current.close() : ""
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        width="10"
        viewBox="0 0 320 512"
      >
        {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
        <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
      </svg>
    </Container>
  );
};

const Container = styled.a`
  position: fixed;
  bottom: 3rem;
  left: 0;
  right: 1rem;
  z-index: 1000;
  width: 40px;
  height: 40px;
  cursor: pointer;
  padding: 0.6rem;
  border: 1px solid #313538;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-left: auto;
  background: white;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0, 0);
    border-radius: 50%;
    transform-origin: top left;
    background: #313538;
    z-index: -1;
    transition: transform 0.25s ease;
  }
  &:hover {
    background: transparent;
  }
  &:hover::after {
    transform: scale(1, 1);
  }
  svg {
    height: 100%;
    width: fit-content;
    transition: fill 0.25s ease;
  }
  &:hover svg {
    fill: white;
  }
`;

export default Feedback;
