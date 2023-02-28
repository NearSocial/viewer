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
import AddModal from "../components/Editor/AddModal";
import CreateModal from "../components/Editor/CreateModal";
import { SaveDraftModal } from "../components/SaveDraft";
import styled from "styled-components";
import VsCodeBanner from "../components/Editor/VsCodeBanner";

const TopMenu = styled.div`
  border-radius: 0.375rem;
  display: flex;
  color: #11181c;
  height: 40px;

  &&& > a.active {
    border: 1px solid #ced4da;
  }
  &&& > a {
    background: #fff;
    color: #11181c;
    padding-left: 6px;
    padding-right: 6px;
  }

  .draft {
    height: 24px;
    width: 50px;
    line-height: 24px;
    text-align: center;
    font-weight: bold;
    color: #ad5700;
    font-size: 12px;
    border-radius: 50px;
    background-color: #ffecbc;
    margin-right: 6px;
  }

  .dot {
    background: #f45858;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin: 7px 8px 0;
  }

  .close {
    width: 28px;
    height: 28px;
  }
`;

const StorageDomain = {
  page: "editor",
};

const StorageType = {
  Code: "code",
  Files: "files",
};

const Filetype = {
  Widget: "widget",
  Module: "module",
};

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
  const { widgetSrc } = useParams();
  const history = useHistory();
  const setWidgetSrc = props.setWidgetSrc;

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(undefined);
  const [path, setPath] = useState(undefined);
  const [files, setFiles] = useState(undefined);
  const [lastPath, setLastPath] = useState(undefined);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [renderCode, setRenderCode] = useState(code);
  const [widgetProps, setWidgetProps] = useState(
    ls.get(WidgetPropsKey) || "{}"
  );
  const [parsedWidgetProps, setParsedWidgetProps] = useState({});
  const [propsError, setPropsError] = useState(null);
  const [metadata, setMetadata] = useState(undefined);
  const [codeChangesPresent, setCodeChangesPresent] = useState(false);
  const [codeOnChain, setCodeOnChain] = useState(null);
  const [draftOnChain, setDraftOnChain] = useState(null);
  const [filesDetails, setFilesDetails] = useState(new Map());
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
    const widgetSrc = `${accountId}/widget/${widgetName}/**`;
    const fetchCodeAndDraftOnChain = () => {
      const widgetCode = cache.socialGet(
        near,
        widgetSrc,
        false,
        undefined,
        undefined,
        fetchCodeAndDraftOnChain
      );

      setCodeOnChain(widgetCode?.[""]);
      setDraftOnChain(widgetCode?.branch?.draft?.[""]);
    };
    fetchCodeAndDraftOnChain();
  }, [code]);

  useEffect(() => {
    let hasCodeChanged;
    if (draftOnChain) {
      hasCodeChanged = draftOnChain != code;
    } else if (codeOnChain) {
      hasCodeChanged = codeOnChain != code;
    } else {
      // no code on chain
      hasCodeChanged = true;
    }
    setCodeChangesPresent(hasCodeChanged);
  }, [code, codeOnChain, draftOnChain]);

  const checkDrafts = () => {
    files.forEach((f) => {
      const widgetSrc = `${accountId}/widget/${f.name}/**`;
      const fetchCodeAndDraftOnChain = () => {
        const widgetCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          fetchCodeAndDraftOnChain
        );

        const mainCode = widgetCode?.[""];
        const draft = widgetCode?.branch?.draft?.[""];
        const isDraft = (!draft && !mainCode) || draft;
        const path = f;

        setFilesDetails(
          filesDetails.set(f.name, {
            codeChangesPresent: filesDetails.get(f.name)?.codeChangesPresent,
            isDraft,
          })
        );
      };
      fetchCodeAndDraftOnChain();
    });
  };

  const checkHasCodeChange = () => {
    files.forEach((f) => {
      const widgetSrc = `${accountId}/widget/${f.name}/**`;
      const fetchCodeAndDraftOnChain = () => {
        const widgetCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          fetchCodeAndDraftOnChain
        );

        const mainCode = widgetCode?.[""];

        const draft = widgetCode?.branch?.draft?.[""];
        const path = f;

        cache
          .asyncLocalStorageGet(StorageDomain, {
            path,
            type: StorageType.Code,
          })
          .then(({ code }) => {
            let hasCodeChanged;
            if (draft) {
              hasCodeChanged = draft != code;
            } else if (mainCode) {
              hasCodeChanged = mainCode != code;
            } else {
              // no code on chain
              hasCodeChanged = true;
            }
            setFilesDetails(
              filesDetails.set(f.name, {
                codeChangesPresent: hasCodeChanged,
                isDraft: filesDetails.get(f.name)?.isDraft,
              })
            );
          });
      };
      fetchCodeAndDraftOnChain();
    });
  };

  const checkHasCodeChangeSingleFile = (code) => {
    console.log("Z2");
    const widgetSrc = `${accountId}/widget/${widgetName}/**`;
    const fetchCodeAndDraftOnChain = () => {
      const widgetCode = cache.socialGet(
        near,
        widgetSrc,
        false,
        undefined,
        undefined,
        fetchCodeAndDraftOnChain
      );

      const mainCode = widgetCode?.[""];
      const draft = widgetCode?.branch?.draft?.[""];
      let hasCodeChanged;
      if (draft) {
        hasCodeChanged = draft != code;
      } else if (mainCode) {
        hasCodeChanged = mainCode != code;
      } else {
        // no code on chain
        hasCodeChanged = true;
      }
      setFilesDetails(
        filesDetails.set(widgetName, {
          codeChangesPresent: hasCodeChanged,
          isDraft: filesDetails.get(widgetName)?.isDraft,
        })
      );
    };
    fetchCodeAndDraftOnChain();
  };

  useEffect(() => {
    if (!files) {
      return;
    }

    checkDrafts();
    checkHasCodeChange();
  }, [files]);

  useEffect(() => {
    checkHasCodeChangeSingleFile(code);
  }, [code]);

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
      setCodeChangesPresent();
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

  const toPath = useCallback((type, nameOrPath) => {
    const name =
      nameOrPath.indexOf("/") >= 0
        ? nameOrPath.split("/").slice(2).join("/")
        : nameOrPath;
    return { type, name };
  }, []);

  const openDraft = useCallback(
    (widgetName) => {
      if (!near) {
        return;
      }
      const widgetSrc = `${accountId}/widget/${widgetName}/branch/draft`;

      const c = () => {
        const draftCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          c
        );
        openFile(toPath(Filetype.Widget, widgetSrc), draftCode || code);
      };

      c();
    },
    [accountId, openFile, toPath, near, cache]
  );

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
          // const name = widgetSrc.split("/").slice(2).join("/");
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
      analytics("edit", {
        props: {
          widget: widgetSrc,
        },
      });
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

  const widgetName = path?.name?.split("/")[0];
  const widgetPathName = path?.name;
  // const isDraft = path?.name?.split("/")[2] === "draft";

  const widgetPath = `${accountId}/${path?.type}/${path?.name}`;
  const jpath = JSON.stringify(path);

  const createOpenDraftButton = (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        openDraft(widgetName);
      }}
    >
      Open a Draft Version
    </button>
  );

  const publishDraftAsMainButton = (
    <CommitButton
      className={`btn btn-primary`}
      disabled={!widgetName}
      near={near}
      data={{
        widget: {
          [widgetName]: {
            "": code,
            metadata,
            branch: {
              draft: null,
            },
          },
        },
      }}
    >
      Publish
    </CommitButton>
  );

  const saveDraftButton = (
    <button
      className="btn btn-outline-primary me-2"
      disabled={!widgetName}
      onClick={(e) => {
        e.preventDefault();
        setShowSaveDraftModal(true);
      }}
    >
      Save Version
    </button>
  );

  const publishButton = (
    <CommitButton
      className={`btn btn-primary`}
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
      Publish
    </CommitButton>
  );

  const renderPreviewButton = (
    <button
      className="btn btn-outline-primary"
      onClick={() => {
        setRenderCode(code);
        if (layout === Layout.Tabs) {
          setTab(Tab.Widget);
        }
      }}
    >
      Render Preview
    </button>
  );

  const openCreateButton = (
    <button
      className="btn btn-success ms-2"
      onClick={() => setShowAddModal(true)}
      style={{
        fontSize: "20px",
        height: "40px",
        lineHeight: "38px",
        paddingTop: "0",
        marginTop: "0",
      }}
    >
      <i className="bi bi-plus"></i>
    </button>
  );

  const renameButton = (
    <button
      className="btn btn-outline-success ms-2"
      style={{ height: "40px" }}
      onClick={() => {
        setShowRenameModal(true);
      }}
    >
      <i className="bi bi-pen"></i>
    </button>
  );

  const openInNewTabButton = (
    <a
      className="btn me-2 btn-outline-secondary"
      style={{ height: "38px" }}
      href={`#/${widgetPath}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Component
    </a>
  );

  const forkButton = (
    <button
      className="btn btn-outline-primary me-2"
      onClick={() => {
        const forkName = widgetName + "-fork";
        openFile(toPath(Filetype.Widget, forkName), code);
      }}
    >
      Fork
    </button>
  );

  const showEditor = !(files?.length === 1 && files[0]?.unnamed === true);

  return (
    <>
      <div
        className={`text-center d-flex justify-content-center min-vh-100 ${
          showEditor ? `visually-hidden` : ``
        }`}
      >
        <div
          className="container-fluid mt-5"
          style={{
            width: "460px",
          }}
        >
          <h4 style={{ lineHeight: "50px" }}>
            Welcome to the Component Sandbox!
          </h4>
          <p className="text-secondary">
            Use this sandbox to create, inspect, modify, and compose components
            to create new experiences on NEAR.
          </p>
          <div className="d-flex justify-content-center mt-5">
            <button
              className="btn btn-outline-success mb-3"
              style={{ width: "250px" }}
              onClick={() => (setShowAddModal(false), setShowOpenModal(true))}
            >
              Open Component
            </button>
          </div>
          <div className="w-100 text-center text-secondary mb-3">or</div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success mb-4"
              style={{ width: "250px" }}
              onClick={() => (setShowAddModal(false), setShowCreateModal(true))}
            >
              Create New Component
            </button>
          </div>
        </div>
      </div>
      <div className={showEditor ? `` : `visually-hidden`}>
        <VsCodeBanner />

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
          <AddModal
            show={showAddModal}
            onOpen={() => (setShowAddModal(false), setShowOpenModal(true))}
            onNew={() => (setShowAddModal(false), setShowCreateModal(true))}
            onHide={() => setShowAddModal(false)}
          />
          <CreateModal
            show={showCreateModal}
            onOpen={(newName) => loadFile(newName)}
            onNew={(newName) =>
              newName
                ? openFile(toPath(Filetype.Widget, newName), DefaultEditorCode)
                : createFile(Filetype.Widget)
            }
            onHide={() => setShowCreateModal(false)}
          />
          <SaveDraftModal
            show={showSaveDraftModal}
            onHide={() => setShowSaveDraftModal(false)}
            near={near}
            widgetPath={widgetPath}
            widgetName={widgetName}
            code={code}
          />
          <div className="">
            <div className="w-100 d-flex " style={{ flexWrap: "nowrap" }}>
              <div className="d-flex" style={{ flexWrap: "wrap" }}>
                <Nav
                  variant="pills mb-2 mt-2"
                  activeKey={jpath}
                  onSelect={(key) => openFile(JSON.parse(key))}
                >
                  {files?.map((p, idx) => {
                    if (p.unnamed) {
                      return;
                    }

                    const jp = JSON.stringify(p);
                    const widgetName = p?.name?.split("/")[0];
                    const { codeChangesPresent, isDraft } =
                      filesDetails.get(widgetName) || {};

                    return (
                      <Nav.Item key={jp}>
                        <TopMenu>
                          <Nav.Link
                            className="text-decoration-none d-flex "
                            eventKey={jp}
                          >
                            <div className="d-flex">
                              {/* X1 */}
                              {isDraft && <div className="draft">Draft</div>}
                              <div>{widgetName}</div>
                              {codeChangesPresent && (
                                <div className="dot"></div>
                              )}
                            </div>
                            <button
                              className={`close btn btn-lg border-0 py-0 px-1 ms-1 rounded-circle btn-outline-secondary`}
                              style={{
                                marginTop: "-3px",
                                marginBottom: "0px",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromFiles(p);
                                if (jp === jpath) {
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
                        </TopMenu>
                      </Nav.Item>
                    );
                  })}
                  <Nav.Item className="me-1">
                    {openCreateButton}
                    {renameButton}
                  </Nav.Item>
                </Nav>
              </div>
              <div
                className="d-flex ms-auto"
                style={{ minWidth: "280px", flexWrap: "wrap" }}
              >
                <Nav
                  variant="pills mb-2 mt-2 ms-auto"
                  activeKey={jpath}
                  onSelect={(key) => openFile(JSON.parse(key))}
                >
                  <Nav.Item className="">
                    {saveDraftButton}
                    {forkButton}

                    {filesDetails.get(widgetName)?.isDraft
                      ? publishDraftAsMainButton
                      : publishButton}
                  </Nav.Item>
                </Nav>
              </div>
            </div>

            {props.widgets.editorComponentSearch && (
              <div>
                {/* We use the component search widget as a VM entry point to add a TOS check wrapper.
                It does not need to be this component, just some <Widget /> on the page */}
                <Widget
                  src={props.tos.checkComponentPath}
                  props={{
                    logOut: props.logOut,
                    tosName: props.tos.contentComponentPath,
                    targetComponent: props.widgets.editorComponentSearch,
                    targetProps: useMemo(
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
                    ),
                  }}
                />
              </div>
            )}
          </div>
          <div className="d-flex align-content-start">
            <div className="flex-grow-1">
              <div className="row">
                <div className={layoutClass}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <ul
                        className={`nav nav-tabs`}
                        style={{
                          borderBottom: "0px",
                          marginTop: "9px",
                        }}
                      >
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              tab === Tab.Editor ? "active" : "text-secondary"
                            }`}
                            aria-current="page"
                            onClick={() => setTab(Tab.Editor)}
                          >
                            Component
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              tab === Tab.Props ? "active" : "text-secondary"
                            }`}
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
                                tab === Tab.Metadata
                                  ? "active"
                                  : "text-secondary"
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
                                tab === Tab.Widget ? "active" : "text-secondary"
                              }`}
                              aria-current="page"
                              onClick={() => {
                                setRenderCode(code);
                                setTab(Tab.Widget);
                              }}
                            >
                              Component Preview
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                    {layout === Layout.Tabs && (
                      <div className="ms-auto d-flex">
                        {path && accountId && openInNewTabButton}
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Layout selection"
                          style={{
                            height: "38px",
                          }}
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
                          <label
                            className="btn btn-outline-secondary"
                            htmlFor="layout-tabs"
                          >
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
                          <label
                            className="btn btn-outline-secondary"
                            htmlFor="layout-split"
                          >
                            <i className="bi bi-layout-split" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`${tab === Tab.Editor ? "" : "visually-hidden"}`}
                  >
                    <div
                      className="form-control mb-3"
                      style={{ height: "70vh", borderTopLeftRadius: "0px" }}
                    >
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
                    <div className="mb-3 d-flex gap-2 flex-wrap"></div>
                  </div>
                  <div
                    className={`${tab === Tab.Props ? "" : "visually-hidden"}`}
                  >
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
                    <div className=" mb-3">
                      ^^ Props for debugging (in JSON)
                    </div>
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
                        paddingTop: "20px",
                        padding: "20px",
                        border: "1px solid rgb(206, 212, 218)",
                        appearance: "none",
                        borderRadius: "0.375rem",
                        height: "70vh",
                      }}
                    >
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
                  <div style={{}}>
                    {tab === Tab.Widget || (
                      <div
                        style={{
                          height: "38px",
                          display: "flex",
                          marginBottom: "12px",
                          justifyContent: "end",
                        }}
                      >
                        {tab === Tab.Widget || (
                          <>
                            {renderCode && (
                              <div className="d-flex justify-content-end me-2">
                                {renderPreviewButton}
                              </div>
                            )}
                            {path && accountId && openInNewTabButton}
                            <div
                              className="btn-group"
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
                              <label
                                className="btn btn-outline-secondary"
                                htmlFor="layout-tabs"
                              >
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
                              <label
                                className="btn btn-outline-secondary"
                                htmlFor="layout-split"
                              >
                                <i className="bi bi-layout-split" />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <div
                      className="container"
                      style={
                        tab === Tab.Widget
                          ? {
                              border: "1px solid #ced4da",
                              appearance: "none",
                              borderRadius: "0.375rem",
                              height: "70vh",
                              maxWidth: "100%",
                              padding: "20px",
                            }
                          : {
                              padding: "20px",
                              border: "1px solid #ced4da",
                              appearance: "none",
                              borderRadius: "0.375rem",
                              height: "70vh",
                            }
                      }
                    >
                      <div className="h-100 row">
                        <div className="d-inline-block position-relative overflow-auto h-100">
                          <div
                            style={{
                              padding: 0,
                              margin: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {renderCode ? (
                              <Widget
                                key={`preview-${jpath}`}
                                code={renderCode}
                                props={parsedWidgetProps}
                              />
                            ) : (
                              renderPreviewButton
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    tab === Tab.Metadata ? layoutClass : "visually-hidden"
                  }`}
                >
                  <div className="container" style={{ marginTop: "50px" }}>
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
      </div>
    </>
  );
}
