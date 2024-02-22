import React from "react";
import styled from "styled-components";
import { Widget } from "near-social-vm";

const StyledNotificationWidget = styled.div`
  margin-right: 7px;
  > div,
  a {
    width: 100%;
    height: 100%;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;

    i {
      font-size: 20px !important;
      color: var(--slate-dark-9);
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
