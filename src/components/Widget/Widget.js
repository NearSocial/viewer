import React, { useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { useNear } from "../../data/near";
import VM from "../../vm/vm";
import { ErrorFallback, Loading } from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";

// const Element = {
//   Text: "text",
//   Image: "image",
//   Widget: "widget",
//   Link: "link",
//   Markdown: "markdown",
// };

const AcornOptions = {
  ecmaVersion: 13,
  allowReturnOutsideFunction: true,
};

const parseCode = (code) => {
  return Parser.extend(jsx()).parse(code, AcornOptions);
};

export default function Widget(props) {
  const [gkey] = useState(uuid());
  const rawCode = props.code;
  const codeProps = props.props;
  const [state, setState] = useState(undefined);
  const [code, setCode] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(0);

  const near = useNear();
  const [element, setElement] = useState(null);

  useEffect(() => {
    try {
      const code = parseCode(rawCode);
      console.log(code);
      setCode(code);
    } catch (e) {
      setElement(
        <div>
          Compile error:
          <pre>{e.message}</pre>
          <pre>{e.stack}</pre>
        </div>
      );
      console.error(e);
    }
  }, [rawCode]);

  useEffect(() => {
    if (!near || !code) {
      return;
    }
    new VM(near, gkey)
      .renderCode(
        code,
        {
          props: codeProps || {},
          context: {
            accountId: near.accountId,
          },
        },
        state,
        setState,
        setNeedRefresh
      )
      .then((element) => {
        setElement(element ?? "Failed");
      })
      .catch((e) => {
        setElement(
          <div>
            Execution error:
            <pre>{e.message}</pre>
            <pre>{e.stack}</pre>
          </div>
        );
        console.error(e);
      });
    // `state` doesn't trigger rerender. Only an explicit update requires full rerender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, gkey, code, codeProps, state, needRefresh]);

  return element !== null && element !== undefined ? (
    <div className="position-relative overflow-hidden">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setElement(null);
        }}
        resetKeys={[element]}
      >
        {element}
      </ErrorBoundary>
    </div>
  ) : (
    Loading
  );
}
