import React from "react";
import styled from "styled-components";
import { Widget } from "../Widget/Widget";

const StyledNotificationWidget = styled.div`
  margin: 0 15px;
  background-color: var(--slate-dark-5);
  height: 40px;
  width: 40px;
  border-radius: 50%;

  > div,
  a {
    width: 100%;
    height: 100%;
  }

  a {
    color: var(--slate-dark-11) !important;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 18px !important;
    }
  }

  :hover {
    a,
    i {
      color: white;
    }
  }
`;

export function NotificationWidget({ notificationButtonSrc }) {
  return (
    <StyledNotificationWidget className="nav-notification-widget">
      <Widget src={notificationButtonSrc} />
    </StyledNotificationWidget>
  );
}
