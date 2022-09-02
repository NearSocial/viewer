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

const EditorCodeKey = LsKey + "editorCode:";
const WidgetNameKey = LsKey + "widgetName:";
const LastWidgetPathKey = LsKey + "widgetPath:";
const WidgetPropsKey = LsKey + "widgetProps:";

export default function EditorPage(props) {
  const { widgetSrc } = useParams();
  const history = useHistory();

  const [code, setCode] = useState(ls.get(EditorCodeKey) || "");
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

  return (
    <div>
      <div className="container">
        <div className="row mb-3 min-vh-100">
          <div className="col-6">
            <h5>Editor</h5>
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
            <div className="mb-3">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setRenderCode(code)}
              >
                Render
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => reformat(code)}
              >
                Format
              </button>
            </div>
            <textarea
              className="form-control font-monospace mb-3"
              value={code}
              rows={20}
              onChange={(e) => updateCode(e.target.value)}
            />
            <div className="mb-3">
              <button
                className="btn btn-primary"
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
                  href={`/${widgetPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Widget
                </a>
              )}
            </div>
          </div>
          <div className="col-6 mb-3">
            <div>
              Props for debugging (JSON)
              <textarea
                className="form-control font-monospace mb-3"
                value={widgetProps}
                rows={5}
                onChange={(e) => setWidgetProps(e.target.value)}
              />
              {propsError && (
                <pre className="alert alert-danger">{propsError}</pre>
              )}
            </div>
            <h5>Widget</h5>
            <Widget code={renderCode} props={parsedWidgetProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
