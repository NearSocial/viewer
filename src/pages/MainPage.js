import React, { useCallback, useState } from "react";
import Widget from "../components/Widget/Widget";
import ls from "local-storage";
import { LsKey } from "../data/near";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";

const EditorCodeKey = LsKey + "editorCode:";

export default function MainPage(props) {
  const [code, setCode] = useState(ls.get(EditorCodeKey) || "");
  const [renderCode, setRenderCode] = useState(code);
  const updateCode = useCallback(
    (code) => {
      ls.set(EditorCodeKey, code);
      setCode(code);
    },
    [setCode]
  );
  const reformat = useCallback(
    (code) => {
      try {
        const formatedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });
        updateCode(formatedCode);
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
