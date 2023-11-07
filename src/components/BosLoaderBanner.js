import styled from "styled-components";
import Draggable from "react-draggable";

import { useFlags } from "../hooks/useFlags";
import { useBosLoaderStore } from "../stores/bos-loader";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Button = styled.button`
  all: unset;
  display: block;
  height: 16px;
  line-height: 16px;
  color: #664d04;

  border-radius: 100rem;

  &:active,
  &:hover {
    outline: none;
    border: none;
  }
`;

const Floating = styled.div`
  position: fixed;
  top: 7rem;
  right: 1rem;
  width: max-content;

  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  border-radius: 50rem;
  padding: 8px 16px;
  text-align: center;

  background: #fff2cd;
  color: #664d04;

  @media screen and (max-width: 800px) {
    top: 4rem;
    right: 0.5rem;
  }
`;

const Container = styled.a`
  color: inherit;
  &:hover {
    text-decoration: none;
  }
`;

export function BosLoaderBanner() {
  const redirectMapStore = useBosLoaderStore();
  const [flags, setFlags] = useFlags();

  function closeBanner() {
    if (flags?.bosLoaderUrl) {
      setFlags({ bosLoaderUrl: undefined });
    }
  }

  function onRefresh() {
    window.location.reload();
  }

  if (!redirectMapStore.loaderUrl) return null;

  return (
    <Draggable position={null}>
      <Floating>
        <OverlayTrigger
          key={"bos-loader"}
          placement={"bottom"}
          overlay={
            <Tooltip>
              {redirectMapStore.failedToLoad
                ? "Check console.log. CORS errors may be misleading"
                : redirectMapStore.loaderUrl}
            </Tooltip>
          }
        >
          <Container href={"/flags"}>
            {redirectMapStore.failedToLoad
              ? "BOS Loader fetch error"
              : "Loading components"}
          </Container>
        </OverlayTrigger>
        <Button type="button" onClick={closeBanner}>
          <i className="bi bi-x" />
        </Button>
        <Button type="button" onClick={onRefresh}>
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Floating>
    </Draggable>
  );
}