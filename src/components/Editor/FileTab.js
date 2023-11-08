import { Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useAccountId, useCache, useNear } from "near-social-vm";
import styled from "styled-components";

export const Filetype = {
  Widget: "widget",
  Module: "module",
};

export const StorageDomain = {
  page: "editor",
};

export const StorageType = {
  Code: "code",
  Files: "files",
};

export function toPath(type, nameOrPath) {
  const name =
    nameOrPath.indexOf("/") >= 0
      ? nameOrPath.split("/").slice(2).join("/")
      : nameOrPath;
  return { type, name };
}

export function FileTab(props) {
  const {
    files,
    p,
    active,
    idx,
    removeFromFiles,
    openFile,
    createFile,
    code,
    updateSaved,
  } = props;
  const cache = useCache();
  const near = useNear();
  const accountId = useAccountId();
  const [localCode, setLocalCode] = useState(null);
  const [chainCode, setChainCode] = useState(null);
  const [saved, setSaved] = useState(false);

  const jp = JSON.stringify(p);

  useEffect(() => {
    if (code !== undefined) {
      setLocalCode(code);
      return;
    }
    cache
      .asyncLocalStorageGet(StorageDomain, {
        path: p,
        type: StorageType.Code,
      })
      .then(({ code }) => {
        setLocalCode(code);
      });
  }, [code, cache, p]);

  useEffect(() => {
    const widgetSrc = `${accountId}/${p?.type}/${p?.name}`;
    const c = () => {
      const code = cache.socialGet(
        near,
        widgetSrc,
        false,
        undefined,
        undefined,
        c
      );
      setChainCode(code);
    };
    c();
  }, [cache, near, p, accountId]);

  useEffect(() => {
    const unsaved = localCode !== chainCode;
    setSaved(unsaved);
  }, [localCode, chainCode]);

  useEffect(() => {
    updateSaved && updateSaved(jp, !saved, localCode);
  }, [saved, updateSaved, localCode]);

  const Button = styled.button`
    all: unset;

    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    color: var(--black-100, #000);
    /* Other/Button_text */
    font-family: Satoshi;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    border-radius: 8px;
    background: var(--Blue, #51b6ff);

    ${active && "box-shadow:0px 0px 0px 2px #fff inset;"}
  `;

  const CloseButton = styled.button`
    all: unset;
    padding: 4px;
    font-size: 12px;

    height: 8px;
    width: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #000;
    border-radius: 50%;
    transition: all 300ms;

    &:hover {
      background-color: #fff;
    }
  `;

  return (
    <Nav.Link
      className="text-decoration-none d-flex align-items-center"
      style={{ all: "unset" }}
      eventKey={jp}
    >
      <Button>
        {p.name}
        {saved && (
          <sup key="unsaved">
            <i
              className="bi bi-asterisk"
              style={{ fontSize: "0.5rem" }}
              title="Unsaved"
            ></i>
          </sup>
        )}
        <CloseButton
          className={`ms-1 ${
            active ? "btn-outline-light" : "btn-outline-secondary"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFromFiles(p);
            if (active) {
              if (files.length > 1) {
                openFile(files[idx - 1] || files[idx + 1]);
              } else {
                createFile(Filetype.Widget);
              }
            }
          }}
        >
          <i className="bi bi-x text-black"></i>
        </CloseButton>
      </Button>
    </Nav.Link>
  );
}
