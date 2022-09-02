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

export default function EditorPage(props) {
  const { widgetSrc } = useParams();
  const history = useHistory();

  const [code, setCode] = useState(ls.get(EditorCodeKey) || "");
  const [widgetName, setWidgetName] = useState(ls.get(WidgetNameKey) || "");
  const [widgetPath, setWidgetPath] = useState(null);
  const [renderCode, setRenderCode] = useState(code);
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
            <h6>Editor</h6>
            <div className="mb-3">
              <label htmlFor="widget-name">Widget Name</label>
              <input
                type="text"
                className="form-control"
                id="widget-name"
                placeholder="Example"
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
              className="form-control font-monospace h-50 mb-3"
              value={code}
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
          <div className="col-6">
            <h6>Widget</h6>
            <Widget code={renderCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
