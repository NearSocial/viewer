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
  try {
    return Parser.extend(jsx()).parse(code, AcornOptions);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default function Widget(props) {
  const [gkey] = useState(uuid());
  const rawCode = props.code;
  const codeProps = props.props;
  const [state, setState] = useState({});
  const [code, setCode] = useState(null);

  const near = useNear();
  const [element, setElement] = useState(null);

  useEffect(() => {
    const code = parseCode(rawCode);
    console.log(code);
    setCode(code);
  }, [rawCode]);

  useEffect(() => {
    if (!near) {
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
          state,
        },
        setState
      )
      .then((element) => {
        setElement(element ?? "Failed");
      })
      .catch((e) => console.error(e.message));
  }, [near, gkey, code, codeProps, state]);

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
