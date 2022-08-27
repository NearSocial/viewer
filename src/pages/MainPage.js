import React, { useCallback, useState } from "react";
import Widget from "../components/Widget/Widget";
import ls from "local-storage";
import { LsKey } from "../data/near";

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
  return (
    <div>
      <div className="container">
        <div className="row mb-3 min-vh-100">
          <div className="col-6">
            <h6>Editor</h6>
            <div className="mb-3">
              <button
                className="btn btn-secondary"
                onClick={() => setRenderCode(code)}
              >
                Render
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
