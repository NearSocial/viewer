import React from "react";
import styled from "styled-components";
import VsCodeIcon from "../../images/vs_code_icon.svg";

const Wrapper = styled("div")`
  background-color: var(--slate-dark-3);
  padding: 8px 0;
`;

const Text = styled("div")`
  color: var(--slate-dark-11);
  margin-left: 24px;
`;

const VsCodeLink = styled("a")`
  text-decoration: underline;
  color: var(--blue-light-9);
  font-weight: 600;
`;

export default function VsCodeBanner({ accountId }) {
  let ideLink = "vscode:extension/near-protocol.near-discovery-ide";
  if (accountId) {
    ideLink += `?account_id=${accountId}`;
  }
  return (
    <Wrapper className="d-flex align-center justify-content-center">
      <img src={VsCodeIcon} />
      <Text>
        Prefer to work locally?&nbsp;
        <VsCodeLink href={ideLink} target="_blank" rel="noopener noreferrer">
          Download our VSCode Extension.
        </VsCodeLink>
      </Text>
    </Wrapper>
  );
}
