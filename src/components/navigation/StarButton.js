import React from "react";
import { Widget } from "near-social-vm";
import styled from "styled-components";

const Wrapper = styled.div`
  color: var(--slate-dark-11);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--slate-dark-5);
  border-radius: 50px;
  outline: none;
  border: 0;
  padding: 0 10px;
  margin-right: 15px;
  height: 40px;

  &:after {
    display: none;
  }
`;

export function StarButton(props) {
  const widgetSrc = props.widgetSrc?.edit;
  if (widgetSrc && props.widgets.starButton) {
    return (
      <Wrapper>
        <Widget
          src={props.widgets.starButton}
          props={{
            item: {
              type: "social",
              path: widgetSrc,
            },
            notifyAccountId: widgetSrc.split("/")[0],
            tooltip: false,
            titleStar: `Bookmark this app`,
            titleUnstar: `Remove from bookmarks`,
          }}
        />
      </Wrapper>
    );
  } else {
    return null;
  }
}
