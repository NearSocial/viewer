import React, { useCallback, useEffect, useState } from "react";
import {
  asyncCommitData,
  socialGet,
  Widget,
} from "../components/Widget/Widget";
import ls from "local-storage";
import { LsKey, useNear } from "../data/near";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { useHistory, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const EditorCodeKey = LsKey + "editorCode:";
const EditorLayoutKey = LsKey + "editorLayout:";
const WidgetNameKey = LsKey + "widgetName:";
const LastWidgetPathKey = LsKey + "widgetPath:";
const WidgetPropsKey = LsKey + "widgetProps:";

const DefaultEditorCode = "return <div>Hello World</div>;";

const Tab = {
  Editor: "Editor",
  Props: "Props",
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

  const [code, setCode] = useState(ls.get(EditorCodeKey) || DefaultEditorCode);
  const [widgetName, setWidgetName] = useState(ls.get(WidgetNameKey) || "");
  const [widgetPath, setWidgetPath] = useState(null);
  const [renderCode, setRenderCode] = useState(code);
  const [widgetProps, setWidgetProps] = useState(
    ls.get(WidgetPropsKey) || "{}"
  );
  const [parsedWidgetProps, setParsedWidgetProps] = useState({});
  const [propsError, setPropsError] = useState(null);
  const near = useNear();
  const accountId = near?.accountId;

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
    (code) => {
      ls.set(EditorCodeKey, code);
      setCode(code);
    },
    [setCode]
  );

  const updateWidgetName = useCallback(
    (name) => {
      ls.set(WidgetNameKey, name);
      setWidgetName(name);
      const widgetPath = `${accountId}/widget/${name}`;
      setWidgetPath(widgetPath);
      ls.set(LastWidgetPathKey, widgetPath);
      history.replace(`/edit/${widgetPath}`);
    },
    [history, accountId]
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

  useEffect(() => {
    if (!near) {
      return;
    }
    if (widgetSrc) {
      if (ls.get(LastWidgetPathKey) !== widgetSrc) {
        ls.set(LastWidgetPathKey, widgetSrc);
        if (widgetSrc === "new") {
          ls.set(WidgetNameKey, null);
          setWidgetName("");
          updateCode(DefaultEditorCode);
          setRenderCode(DefaultEditorCode);
        } else {
          socialGet(near, widgetSrc).then((code) => {
            if (code) {
              const widgetName = widgetSrc.split("/").slice(2).join("/");
              ls.set(WidgetNameKey, widgetName);
              setWidgetName(widgetName);
              updateCode(code);
              setRenderCode(code);
            }
          });
        }
      }
      setWidgetPath(widgetSrc);
    }
  }, [near, widgetSrc, updateCode]);

  const reformat = useCallback(
    (code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });
        updateCode(formattedCode);
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

  return (
    <div className="container">
      <div className="min-vh-100 d-flex align-content-start">
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
                <div className="input-group mb-3">
                  <span className="input-group-text" id="widget-path-prefix">
                    {accountId}/widget/
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="widget-name"
                    placeholder="MyWidget"
                    aria-describedby="widget-path-prefix"
                    value={widgetName}
                    onChange={(e) => updateWidgetName(e.target.value)}
                  />
                </div>
                <div className="form-control mb-3" style={{ height: "70vh" }}>
                  <Editor
                    value={code}
                    defaultLanguage="javascript"
                    onChange={(code) => updateCode(code)}
                    wrapperProps={{
                      onBlur: () => reformat(code),
                    }}
                  />
                </div>
                <div className="mb-3">
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
                  <button
                    className="btn btn-primary ms-2"
                    onClick={(e) => {
                      e.preventDefault();
                      updateWidgetName(widgetName);
                      asyncCommitData(near, {
                        widget: {
                          [widgetName]: code,
                        },
                      })
                        .then(console.log)
                        .catch(console.error);
                      return false;
                    }}
                  >
                    Save Widget
                  </button>
                  {widgetPath && (
                    <a
                      className="ms-2 btn btn-outline-primary"
                      href={`#/${widgetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Widget in a new tab
                    </a>
                  )}
                </div>
              </div>
              <div className={`${tab === Tab.Props ? "" : "visually-hidden"}`}>
                Props for debugging (JSON)
                <div className="form-control mb-3" style={{ height: "40vh" }}>
                  <Editor
                    value={widgetProps}
                    defaultLanguage="json"
                    onChange={(props) => setWidgetProps(props)}
                    wrapperProps={{
                      onBlur: () => reformatProps(widgetProps),
                    }}
                  />
                </div>
                {propsError && (
                  <pre className="alert alert-danger">{propsError}</pre>
                )}
              </div>
            </div>
            <div
              className={`${
                tab === Tab.Widget || layout === Layout.Split
                  ? layoutClass
                  : "visually-hidden"
              }`}
            >
              <div className="container">
                <div className="row">
                  <div className="d-inline-block position-relative overflow-hidden">
                    <Widget code={renderCode} props={parsedWidgetProps} />
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
