import React, { useCallback, useEffect, useMemo, useState } from "react";
import ls from "local-storage";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { useHistory, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
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
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";

const LsKey = "social.near:v01:";
const EditorLayoutKey = LsKey + "editorLayout:";
const WidgetPropsKey = LsKey + "widgetProps:";

const DefaultEditorCode = "return <div>Hello World</div>;";

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
  useHashRouterLegacy();
  const { widgetSrc } = useParams();
  const history = useHistory();
  const setWidgetSrc = props.setWidgetSrc;

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(undefined);
  const [path, setPath] = useState(undefined);
  const [files, setFiles] = useState(undefined);
  const [lastPath, setLastPath] = useState(undefined);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [allSaved, setAllSaved] = useState({});

  const [renderCode, setRenderCode] = useState(code);
  const [widgetProps, setWidgetProps] = useState(
    ls.get(WidgetPropsKey) || "{}"
  );
  const [parsedWidgetProps, setParsedWidgetProps] = useState({});
  const [propsError, setPropsError] = useState(null);
  const [metadata, setMetadata] = useState(undefined);
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const [tab, setTab] = useState(Tab.Editor);
  const [layout, setLayoutState] = useState(
    ls.get(EditorLayoutKey) || Layout.Tabs
  );

  const setLayout = useCallback(
    (layout) => {
      ls.set(EditorLayoutKey, layout);
      setLayoutState(layout);
    },
    [setLayoutState]
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
        }
      );
      setCode(code);
    },
    [cache, setCode]
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
        files.filter((file) => JSON.stringify(file) !== path)
      );
      setLastPath(path);
    },
    [setFiles, setLastPath]
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
    [setFiles, setLastPath]
  );

  useEffect(() => {
    if (files && lastPath) {
      cache.localStorageSet(
        StorageDomain,
        {
          type: StorageType.Files,
        },
        { files, lastPath }
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
    [updateCode, addToFiles]
  );

  const updateSaved = useCallback((jp, saved) => {
    setAllSaved((allSaved) => {
      return Object.assign({}, allSaved, { [jp]: saved });
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
          c
        );
        if (code) {
          const name = widgetSrc.split("/").slice(2).join("/");
          openFile(toPath(Filetype.Widget, widgetSrc), code);
        }
      };

      c();
    },
    [accountId, openFile, toPath, near, cache]
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
    [toPath, files]
  );

  const createFile = useCallback(
    (type) => {
      const path = generateNewName(type);
      openFile(path, DefaultEditorCode);
    },
    [generateNewName, openFile]
  );

  const renameFile = useCallback(
    (newName, code) => {
      const newPath = toPath(path.type, newName);
      const jNewPath = JSON.stringify(newPath);
      const jPath = JSON.stringify(path);
      setFiles((files) => {
        const newFiles = files.filter(
          (file) => JSON.stringify(file) !== jNewPath
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
    [path, toPath, updateCode]
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
    [updateCode]
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
    [setWidgetProps]
  );

  const closeCommitted = useCallback(
    (path, allSaved) => {
      setFiles((files) => {
        files = files.filter((file) => !allSaved[JSON.stringify(file)]);
        if (allSaved[JSON.stringify(path)]) {
          if (files.length > 0) {
            openFile(files[files.length - 1], undefined);
          } else {
            createFile(Filetype.Widget);
          }
        }
        return files;
      });
    },
    [openFile, createFile]
  );

  const layoutClass = layout === Layout.Split ? "col-lg-6" : "";

  const onLayoutChange = useCallback(
    (e) => {
      const layout = e.target.value;
      if (layout === Layout.Split && tab === Tab.Widget) {
        setTab(Tab.Editor);
      }
      setLayout(layout);
    },
    [setLayout, tab, setTab]
  );

  const widgetName = path?.name;

  const commitButton = (
    <CommitButton
      className="btn btn-primary"
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

  return (
    <div className="container-fluid mt-1">
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
      <div className="mb-3">
        <Nav
          variant="pills mb-1"
          activeKey={jpath}
          onSelect={(key) => openFile(JSON.parse(key))}
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
            <Nav.Link
              className="text-decoration-none"
              onClick={() => setShowOpenModal(true)}
            >
              <i className="bi bi-file-earmark-plus"></i> Add
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="text-decoration-none"
              onClick={() => closeCommitted(path, allSaved)}
            >
              <i className="bi bi-x-lg"></i> Close unchanged
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {props.widgets.editorComponentSearch && (
          <div>
            <Widget
              src={props.widgets.editorComponentSearch}
              props={useMemo(
                () => ({
                  extraButtons: ({ widgetName, widgetPath, onHide }) => (
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Tooltip>
                          Open "{widgetName}" component in the editor
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
                [loadFile]
              )}
            />
          </div>
        )}
      </div>
      <div className="d-flex align-content-start">
        <div className="me-2">
          <div
            className="btn-group-vertical"
            role="group"
            aria-label="Layout selection"
          >
            <input
              type="radio"
              className="btn-check"
              name="layout-radio"
              id="layout-tabs"
              autoComplete="off"
              checked={layout === Layout.Tabs}
              onChange={onLayoutChange}
              value={Layout.Tabs}
              title={"Set layout to Tabs mode"}
            />
            <label className="btn btn-outline-secondary" htmlFor="layout-tabs">
              <i className="bi bi-square" />
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
              <i className="bi bi-layout-split" />
            </label>
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="row">
            <div className={layoutClass}>
              <ul className={`nav nav-tabs mb-2`}>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === Tab.Editor ? "active" : ""}`}
                    aria-current="page"
                    onClick={() => setTab(Tab.Editor)}
                  >
                    Editor
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === Tab.Props ? "active" : ""}`}
                    aria-current="page"
                    onClick={() => setTab(Tab.Props)}
                  >
                    Props
                  </button>
                </li>
                {props.widgets.widgetMetadataEditor && (
                  <li className="nav-item">
                    <button
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
                      className={`nav-link ${
                        tab === Tab.Widget ? "active" : ""
                      }`}
                      aria-current="page"
                      onClick={() => {
                        setRenderCode(code);
                        setTab(Tab.Widget);
                      }}
                    >
                      Widget Preview
                    </button>
                  </li>
                )}
              </ul>

              <div className={`${tab === Tab.Editor ? "" : "visually-hidden"}`}>
                <div className="form-control mb-3" style={{ height: "70vh" }}>
                  <Editor
                    value={code}
                    path={widgetPath}
                    defaultLanguage="javascript"
                    onChange={(code) => updateCode(path, code)}
                    wrapperProps={{
                      onBlur: () => reformat(path, code),
                    }}
                  />
                </div>
                <div className="mb-3 d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setRenderCode(code);
                      if (layout === Layout.Tabs) {
                        setTab(Tab.Widget);
                      }
                    }}
                  >
                    Render preview
                  </button>
                  {!path?.unnamed && commitButton}
                  <button
                    className={`btn ${
                      path?.unnamed ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => {
                      setShowRenameModal(true);
                    }}
                  >
                    Rename {path?.type}
                  </button>
                  {path && accountId && (
                    <a
                      className="btn btn-outline-primary"
                      href={`/${widgetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Component in a new tab
                    </a>
                  )}
                </div>
              </div>
              <div className={`${tab === Tab.Props ? "" : "visually-hidden"}`}>
                <div className="form-control" style={{ height: "70vh" }}>
                  <Editor
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
                <div className="mb-3">
                  <Widget
                    src={props.widgets.widgetMetadataEditor}
                    key={`metadata-editor-${jpath}`}
                    props={useMemo(
                      () => ({
                        widgetPath,
                        onChange: setMetadata,
                      }),
                      [widgetPath]
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
              <div className="container">
                <div className="row">
                  <div className="d-inline-block position-relative overflow-hidden">
                    {renderCode ? (
                      <Widget
                        key={`preview-${jpath}`}
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
                  <div className="d-inline-block position-relative overflow-hidden">
                    <Widget
                      key={`metadata-${jpath}`}
                      src={props.widgets.widgetMetadata}
                      props={useMemo(
                        () => ({ metadata, accountId, widgetName }),
                        [metadata, accountId, widgetName]
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
