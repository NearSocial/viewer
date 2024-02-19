import React, { useCallback, useEffect, useMemo, useState } from "react";
import ls from "local-storage";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { useHistory, useParams } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Widget,
  useCache,
  useNear,
  CommitButton,
  useAccountId,
} from "near-social-vm";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import RenameModal from "../components/Editor/RenameModal";
import OpenModal from "../components/Editor/OpenModal";
import {
  FileTab,
  Filetype,
  StorageDomain,
  StorageType,
  toPath,
} from "../components/Editor/FileTab";
import vmTypesDeclaration from "raw-loader!near-social-vm-types";
import styled from "styled-components";
import { useBosLoaderStore } from "../stores/bos-loader";

const LsKey = "social.near:v01:";
const EditorLayoutKey = LsKey + "editorLayout:";
const WidgetPropsKey = LsKey + "widgetProps:";
const EditorUncommittedPreviewsKey = LsKey + "editorUncommittedPreviews:";

const DefaultEditorCode = "return <div>Hello World</div>;";

const NavPill = styled.button`
  all: unset;

  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 8px;
  background: var(--bg-2, #23242b);

  color: var(--white-100, #fff);

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Container = styled.div`
  background: #0b0c14;
  color: #fff;

  min-height: 100%;
`;

const CustomSearch = styled.div`
  .form-control {
    background: #23242b;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  input::placeholder {
    color: #c7c7c7;
  }
`;

const Button = styled.button`
  all: unset;

  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  /* Other/Button_text */
  font-family: Satoshi, sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border-radius: 8px;
  background: #51b6ff;
  color: black;
`;

const Tab = {
  Editor: "Editor",
  Props: "Props",
  Metadata: "Metadata",
  Widget: "Widget",
};

const Layout = {
  Tabs: "Tabs",
  Split: "Split",
};

export default function EditorPage(props) {
  const { widgetSrc } = useParams();
  const history = useHistory();
  const redirectMapStore = useBosLoaderStore();
  const setWidgetSrc = props.setWidgetSrc;

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(undefined);
  const [path, setPath] = useState(undefined);
  const [files, setFiles] = useState(undefined);
  const [lastPath, setLastPath] = useState(undefined);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [allSaved, setAllSaved] = useState({});
  const [uncommittedPreviews, setUncommittedPreviews] = useState(
    ls.get(EditorUncommittedPreviewsKey) ?? false,
  );
  const [widgetConfig, setWidgetConfig] = useState(undefined);

  const [renderCode, setRenderCode] = useState(code);
  const [widgetProps, setWidgetProps] = useState(
    ls.get(WidgetPropsKey) || "{}",
  );
  const [parsedWidgetProps, setParsedWidgetProps] = useState({});
  const [propsError, setPropsError] = useState(null);
  const [metadata, setMetadata] = useState(undefined);
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const [tab, setTab] = useState(Tab.Editor);
  const [layout, setLayoutState] = useState(
    ls.get(EditorLayoutKey) || Layout.Tabs,
  );
  const [previewKey, setPreviewKey] = useState("");

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        vmTypesDeclaration,
      );
    }
  }, [monaco]);

  const setLayout = useCallback(
    (layout) => {
      ls.set(EditorLayoutKey, layout);
      setLayoutState(layout);
    },
    [setLayoutState],
  );

  useEffect(() => {
    setWidgetSrc({
      edit: null,
      view: widgetSrc,
    });
  }, [widgetSrc, setWidgetSrc]);

  const updateCode = useCallback(
    (path, code) => {
      cache.localStorageSet(
        StorageDomain,
        {
          path,
          type: StorageType.Code,
        },
        {
          code,
          time: Date.now(),
        },
      );
      setCode(code);
    },
    [cache, setCode],
  );

  useEffect(() => {
    ls.set(WidgetPropsKey, widgetProps);
    try {
      const parsedWidgetProps = JSON.parse(widgetProps);
      setParsedWidgetProps(parsedWidgetProps);
      setPropsError(null);
    } catch (e) {
      setParsedWidgetProps({});
      setPropsError(e.message);
    }
  }, [widgetProps]);

  const removeFromFiles = useCallback(
    (path) => {
      path = JSON.stringify(path);
      setFiles((files) =>
        files.filter((file) => JSON.stringify(file) !== path),
      );
      setLastPath(path);
    },
    [setFiles, setLastPath],
  );

  const addToFiles = useCallback(
    (path) => {
      const jpath = JSON.stringify(path);
      setFiles((files) => {
        const newFiles = [...files];
        if (!files.find((file) => JSON.stringify(file) === jpath)) {
          newFiles.push(path);
        }
        return newFiles;
      });
      setLastPath(path);
    },
    [setFiles, setLastPath],
  );

  useEffect(() => {
    if (files && lastPath) {
      cache.localStorageSet(
        StorageDomain,
        {
          type: StorageType.Files,
        },
        { files, lastPath },
      );
    }
  }, [files, lastPath, cache]);

  const openFile = useCallback(
    (path, code) => {
      setPath(path);
      addToFiles(path);
      setMetadata(undefined);
      setRenderCode(null);
      if (code !== undefined) {
        updateCode(path, code);
      } else {
        setLoading(true);
        cache
          .asyncLocalStorageGet(StorageDomain, {
            path,
            type: StorageType.Code,
          })
          .then(({ code }) => {
            updateCode(path, code);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [updateCode, addToFiles],
  );

  const updateSaved = useCallback((jp, saved, localCode) => {
    setAllSaved((allSaved) => {
      return Object.assign({}, allSaved, { [jp]: saved || localCode });
    });
  }, []);

  const loadFile = useCallback(
    (nameOrPath) => {
      if (!near) {
        return;
      }
      const widgetSrc =
        nameOrPath.indexOf("/") >= 0
          ? nameOrPath
          : `${accountId}/widget/${nameOrPath}`;
      const c = () => {
        const code = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          c,
        );
        if (code) {
          // const name = widgetSrc.split("/").slice(2).join("/");
          openFile(toPath(Filetype.Widget, widgetSrc), code);
        }
      };

      c();
    },
    [accountId, openFile, toPath, near, cache],
  );

  const generateNewName = useCallback(
    (type) => {
      for (let i = 0; ; i++) {
        const name = `Draft-${i}`;
        const path = toPath(type, name);
        path.unnamed = true;
        const jPath = JSON.stringify(path);
        if (!files?.find((file) => JSON.stringify(file) === jPath)) {
          return path;
        }
      }
    },
    [toPath, files],
  );

  const createFile = useCallback(
    (type) => {
      const path = generateNewName(type);
      openFile(path, DefaultEditorCode);
    },
    [generateNewName, openFile],
  );

  const renameFile = useCallback(
    (newName, code) => {
      const newPath = toPath(path.type, newName);
      const jNewPath = JSON.stringify(newPath);
      const jPath = JSON.stringify(path);
      setFiles((files) => {
        const newFiles = files.filter(
          (file) => JSON.stringify(file) !== jNewPath,
        );
        const i = newFiles.findIndex((file) => JSON.stringify(file) === jPath);
        if (i >= 0) {
          newFiles[i] = newPath;
        }
        return newFiles;
      });
      setLastPath(newPath);
      setPath(newPath);
      updateCode(newPath, code);
    },
    [path, toPath, updateCode],
  );

  useEffect(() => {
    cache
      .asyncLocalStorageGet(StorageDomain, { type: StorageType.Files })
      .then((value) => {
        const { files, lastPath } = value || {};
        setFiles(files || []);
        setLastPath(lastPath);
      });
  }, [cache]);

  useEffect(() => {
    if (!near || !files) {
      return;
    }
    if (widgetSrc) {
      if (widgetSrc === "new") {
        createFile(Filetype.Widget);
      } else {
        loadFile(widgetSrc);
      }
      history.replace(`/edit/`);
    } else if (path === undefined) {
      if (files.length === 0) {
        createFile(Filetype.Widget);
      } else {
        openFile(lastPath, undefined);
      }
    }
  }, [near, createFile, lastPath, files, path, widgetSrc, openFile, loadFile]);

  const reformat = useCallback(
    (path, code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });
        updateCode(path, formattedCode);
      } catch (e) {
        console.log(e);
      }
    },
    [updateCode],
  );

  const reformatProps = useCallback(
    (props) => {
      try {
        const formattedProps = JSON.stringify(JSON.parse(props), null, 2);
        setWidgetProps(formattedProps);
      } catch (e) {
        console.log(e);
      }
    },
    [setWidgetProps],
  );

  const closeCommitted = useCallback(
    (path, allSaved) => {
      setFiles((files) => {
        files = files.filter((file) => allSaved[JSON.stringify(file)] !== true);
        if (allSaved[JSON.stringify(path)] === true) {
          if (files.length > 0) {
            openFile(files[files.length - 1], undefined);
          } else {
            createFile(Filetype.Widget);
          }
        }
        return files;
      });
    },
    [openFile, createFile],
  );

  const layoutClass = layout === Layout.Split ? "w-50" : "";

  const onLayoutChange = useCallback(
    (e) => {
      const layout = e.target.value;
      if (layout === Layout.Split && tab === Tab.Widget) {
        setTab(Tab.Editor);
      }
      setLayout(layout);
    },
    [setLayout, tab, setTab],
  );

  const pathToSrc = useCallback(
    (path) => {
      return `${accountId}/${path?.type}/${path?.name}`;
    },
    [accountId],
  );

  const generateWidgetConfig = useCallback(
    (uncommittedPreviews) => {
      return uncommittedPreviews
        ? {
            redirectMap: Object.fromEntries(
              Object.entries(allSaved)
                .filter(([jpath, code]) => code !== true)
                .map(([jpath, code]) => {
                  const path = JSON.parse(jpath);
                  return [
                    pathToSrc(path),
                    {
                      code,
                    },
                  ];
                }),
            ),
          }
        : undefined;
    },
    [allSaved, pathToSrc],
  );

  const widgetName = path?.name;

  const commitButton = (
    <CommitButton
      style={{
        all: "unset",
        backgroundColor: "#51b6ff",
        color: "black",
        padding: "10px 20px",
        borderRadius: 8,
        fontFamily: "Satoshi, sans-serif",
        fontWeight: "500",
        fontSize: "0.875rem",
      }}
      className="ms-3"
      disabled={!widgetName}
      near={near}
      data={{
        widget: {
          [widgetName]: {
            "": code,
            metadata,
          },
        },
      }}
    >
      Save Widget
    </CommitButton>
  );

  const widgetPath = `${accountId}/${path?.type}/${path?.name}`;
  const jpath = JSON.stringify(path);

  const renderPreview = (code) => {
    setWidgetConfig(generateWidgetConfig(uncommittedPreviews));
    setRenderCode(code);
    setPreviewKey(`preview-${Date.now()}`);
  };

  return (
    <Container>
      <RenameModal
        key={`rename-modal-${jpath}`}
        show={showRenameModal}
        name={path?.name}
        onRename={(newName) => renameFile(newName, code)}
        onHide={() => setShowRenameModal(false)}
      />
      <OpenModal
        show={showOpenModal}
        onOpen={(newName) => loadFile(newName)}
        onNew={(newName) =>
          newName
            ? openFile(toPath(Filetype.Widget, newName), DefaultEditorCode)
            : createFile(Filetype.Widget)
        }
        onHide={() => setShowOpenModal(false)}
      />
      <div
        className="d-flex flex-column-reverse gap-3 mt-2 mt-md-0 flex-md-row-reverse justify-content-between align-items-center"
        style={{
          padding: "0.75rem 3rem",
          borderBottom:
            "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))",
        }}
      >
        <Nav
          variant="pills"
          activeKey={jpath}
          onSelect={(key) => openFile(JSON.parse(key))}
          className="gap-3"
        >
          {files?.map((p, idx) => {
            const jp = JSON.stringify(p);
            const active = jp === jpath;
            return (
              <FileTab
                key={jp}
                {...{
                  p,
                  jp,
                  idx,
                  active,
                  openFile,
                  createFile,
                  removeFromFiles,
                  files,
                  code: jp === jpath ? code : undefined,
                  updateSaved,
                }}
              />
            );
          })}
          <Nav.Item>
            <NavPill
              className="text-decoration-none d-flex align-items-center gap-2"
              onClick={() => setShowOpenModal(true)}
            >
              <i
                className="bi bi-file-earmark-plus"
                style={{ fontSize: "0.75rem" }}
              ></i>{" "}
              Add
            </NavPill>
          </Nav.Item>
          <Nav.Item>
            <NavPill
              className="text-decoration-none"
              onClick={() => closeCommitted(path, allSaved)}
            >
              <i className="bi bi-x"></i> Close unchanged
            </NavPill>
          </Nav.Item>
        </Nav>
        {props.widgets.editorComponentSearch && (
          <CustomSearch style={{ marginBottom: "-0.5rem" }}>
            <Widget
              src={props.widgets.editorComponentSearch}
              props={useMemo(
                () => ({
                  extraButtons: ({ widgetName, widgetPath, onHide }) => (
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Tooltip>
                          {`Open "${widgetName}" component in the editor`}
                        </Tooltip>
                      }
                    >
                      <button
                        className="btn btn-outline-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          loadFile(widgetPath);
                          onHide && onHide();
                        }}
                      >
                        Open
                      </button>
                    </OverlayTrigger>
                  ),
                }),
                [loadFile],
              )}
            />
          </CustomSearch>
        )}
      </div>
      <div className="d-flex align-content-start">
        <div
          style={{
            margin: "4rem 1rem",
          }}
        >
          <div
            className="btn-group-vertical"
            role="group"
            aria-label="Layout selection"
          >
            <input
              type="radio"
              className="btn-check p-3"
              name="layout-radio"
              id="layout-tabs"
              autoComplete="off"
              checked={layout === Layout.Tabs}
              onChange={onLayoutChange}
              value={Layout.Tabs}
              title={"Set layout to Tabs mode"}
            />
            <label className="btn btn-outline-secondary" htmlFor="layout-tabs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM18 7V9H6V7H18Z"
                  fill="white"
                />
              </svg>
            </label>

            <input
              type="radio"
              className="btn-check"
              name="layout-radio"
              id="layout-split"
              autoComplete="off"
              checked={layout === Layout.Split}
              value={Layout.Split}
              title={"Set layout to Split mode"}
              onChange={onLayoutChange}
            />
            <label className="btn btn-outline-secondary" htmlFor="layout-split">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 5H5V19H11V5ZM13 5V19H19V5H13ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z"
                  fill="white"
                />
              </svg>
            </label>
          </div>
        </div>
        <div className="flex-grow-1">
          <div
            // className="row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: `${layout === Layout.Split ? "row" : "column"}`,
              borderLeft:
                "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))",
              height: "100%",
            }}
          >
            <div
              className={layoutClass}
              style={{
                paddingTop: "1rem",
                borderRight:
                  "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))",
              }}
            >
              <ul
                className={`nav nav-tabs`}
                style={{ margin: "0 0 0 1.5rem", border: 0 }}
              >
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === Tab.Editor ? "active" : ""}`}
                    style={{
                      background: `${
                        tab === Tab.Editor ? "#23242b" : "#0b0c14"
                      }`,
                      color: "white",
                      border: "none",
                    }}
                    aria-current="page"
                    onClick={() => setTab(Tab.Editor)}
                  >
                    Editor
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === Tab.Props ? "active" : ""}`}
                    style={{
                      background: `${
                        tab === Tab.Props ? "#23242b" : "#0b0c14"
                      }`,
                      color: "white",
                      border: "none",
                    }}
                    aria-current="page"
                    onClick={() => setTab(Tab.Props)}
                  >
                    Props
                  </button>
                </li>
                {props.widgets.widgetMetadataEditor && (
                  <li className="nav-item">
                    <button
                      style={{
                        background: `${
                          tab === Tab.Metadata ? "#23242b" : "#0b0c14"
                        }`,
                        color: "white",
                        border: "none",
                      }}
                      className={`nav-link ${
                        tab === Tab.Metadata ? "active" : ""
                      }`}
                      aria-current="page"
                      onClick={() => setTab(Tab.Metadata)}
                    >
                      Metadata
                    </button>
                  </li>
                )}
                {layout === Layout.Tabs && (
                  <li className="nav-item">
                    <button
                      style={{
                        background: `${
                          tab === Tab.Widget ? "#23242b" : "#0b0c14"
                        }`,
                        color: "white",
                        border: "none",
                      }}
                      className={`nav-link ${
                        tab === Tab.Widget ? "active" : ""
                      }`}
                      aria-current="page"
                      onClick={() => {
                        renderPreview(code);
                        setTab(Tab.Widget);
                      }}
                    >
                      Widget Preview
                    </button>
                  </li>
                )}
              </ul>

              <div className={`${tab === Tab.Editor ? "" : "visually-hidden"}`}>
                <div className="mb-3" style={{ height: "70vh" }}>
                  <Editor
                    theme="vs-dark"
                    value={code}
                    path={widgetPath}
                    defaultLanguage="javascript"
                    onChange={(code) => updateCode(path, code)}
                    wrapperProps={{
                      onBlur: () => reformat(path, code),
                    }}
                  />
                </div>
                <div className="ms-4 mb-3 d-flex gap-3 flex-wrap">
                  <Button
                    // className="btn btn-success"
                    onClick={() => {
                      renderPreview(code);
                      if (layout === Layout.Tabs) {
                        setTab(Tab.Widget);
                      }
                    }}
                  >
                    Render Preview
                  </Button>
                  {!path?.unnamed && commitButton}
                  <Button
                    style={{
                      color: "white",
                      background: "#0b0c14",
                      border: "1px solid white",
                    }}
                    // className={`btn ${
                    //   path?.unnamed ? "btn-primary" : "btn-secondary"
                    // }`}
                    onClick={() => {
                      setShowRenameModal(true);
                    }}
                  >
                    Rename {path?.type}
                  </Button>
                  {/* {path && accountId && (
                    <a
                      key="open-comp"
                      className="btn btn-outline-primary"
                      href={`/${widgetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Component in a new tab
                    </a>
                  )} */}
                  {/* <button
                    type="button"
                    onClick={() => {
                      const v = !uncommittedPreviews;
                      ls.set(EditorUncommittedPreviewsKey, v);
                      setUncommittedPreviews(v);
                      setWidgetConfig(generateWidgetConfig(v));
                    }}
                    className={`btn btn-outline-secondary ${
                      uncommittedPreviews ? "active" : ""
                    }`}
                    data-toggle="button"
                    aria-pressed={uncommittedPreviews}
                    title="When enabled, the preview uses uncommitted code from all opened files"
                  >
                    <i className="bi bi-asterisk"></i> Multi-file previews (
                    {uncommittedPreviews ? "ON" : "OFF"})
                  </button> */}
                </div>
              </div>
              <div className={`${tab === Tab.Props ? "" : "visually-hidden"}`}>
                <div className="mb-3" style={{ height: "70vh" }}>
                  <Editor
                    theme="vs-dark"
                    value={widgetProps}
                    defaultLanguage="json"
                    onChange={(props) => setWidgetProps(props)}
                    wrapperProps={{
                      onBlur: () => reformatProps(widgetProps),
                    }}
                  />
                </div>
                <div className=" mb-3">^^ Props for debugging (in JSON)</div>
                {propsError && (
                  <pre className="alert alert-danger">{propsError}</pre>
                )}
              </div>
              <div
                className={`${
                  tab === Tab.Metadata && props.widgets.widgetMetadataEditor
                    ? ""
                    : "visually-hidden"
                }`}
              >
                <div
                  className="mb-3"
                  style={{
                    background: "#23242b",
                    padding: 24,
                    color: "#000",
                  }}
                >
                  <Widget
                    src={props.widgets.widgetMetadataEditor}
                    key={`metadata-editor-${jpath}`}
                    config={{
                      redirectMap: redirectMapStore.redirectMap,
                    }}
                    props={useMemo(
                      () => ({
                        widgetPath,
                        onChange: setMetadata,
                      }),
                      [widgetPath],
                    )}
                  />
                </div>
                <div className="mb-3">{commitButton}</div>
              </div>
            </div>
            <div
              className={`${
                tab === Tab.Widget ||
                (layout === Layout.Split && tab !== Tab.Metadata)
                  ? layoutClass
                  : "visually-hidden"
              }`}
            >
              <div className="container mt-4">
                <div className="row">
                  <div className="position-relative">
                    {renderCode ? (
                      <Widget
                        key={`${previewKey}-${jpath}`}
                        config={widgetConfig}
                        code={renderCode}
                        props={parsedWidgetProps}
                      />
                    ) : (
                      'Click "Render preview" button to render the widget'
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                tab === Tab.Metadata ? layoutClass : "visually-hidden"
              }`}
            >
              <div className="container">
                <div className="row">
                  <div className="position-relative mt-4">
                    <Widget
                      key={`metadata-${jpath}`}
                      src={props.widgets.widgetMetadata}
                      config={{
                        redirectMap: redirectMapStore.redirectMap,
                      }}
                      props={useMemo(
                        () => ({ metadata, accountId, widgetName }),
                        [metadata, accountId, widgetName],
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
