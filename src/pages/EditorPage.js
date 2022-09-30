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
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const EditorCodeKey = LsKey + "editorCode:";
const WidgetNameKey = LsKey + "widgetName:";
const LastWidgetPathKey = LsKey + "widgetPath:";
const WidgetPropsKey = LsKey + "widgetProps:";

const DefaultEditorCode = "return <div>Hello World</div>;";

export default function EditorPage(props) {
  const { widgetSrc } = useParams();
  const history = useHistory();
  const setForkSrc = props.setForkSrc;

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

  useEffect(() => {
    setForkSrc(null);
  }, [setForkSrc]);

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

  return (
    <div>
      <div className="container">
        <div className="row mb-3 min-vh-100">
          <div className="col-md-6">
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
            <div className="form-control mb-3 overflow-auto code-editor">
              <Editor
                className="font-monospace"
                textareaClassName="outline-none"
                value={code}
                highlight={(code) => highlight(code, languages.js)}
                onValueChange={(code) => updateCode(code)}
                onBlur={() => reformat(code)}
                style={{
                  fontSize: 14,
                }}
              />
            </div>
            <div className="mb-3">
              <button
                className="btn btn-success"
                onClick={() => setRenderCode(code)}
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
            <div className="mb-3">
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
          </div>
          <div className="col-md-6 mb-3">
            <h5>Widget</h5>
            <Widget code={renderCode} props={parsedWidgetProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
