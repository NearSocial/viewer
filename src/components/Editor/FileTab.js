import { Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useAccountId, useCache, useNear } from "near-social-vm";

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

  return (
    <Nav.Item>
      <Nav.Link className="text-decoration-none" eventKey={jp}>
        {p.name}
        {saved && (
          <sup key="unsaved">
            <i className="bi bi-asterisk text-secondary" title="Unsaved"></i>
          </sup>
        )}
        <button
          className={`btn btn-sm border-0 py-0 px-1 ms-1 rounded-circle ${
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
          <i className="bi bi-x"></i>
        </button>
      </Nav.Link>
    </Nav.Item>
  );
}
