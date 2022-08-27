import React, { useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { useNear } from "../../data/near";
import VM from "../../vm/vm";
import { Loading } from "../../data/utils";

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

  const near = useNear();
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!near) {
      return;
    }
    const code = parseCode(rawCode);
    console.log(code);
    setElement(<pre>{JSON.stringify(code, null, 2)}</pre>);
    new VM(near, gkey)
      .renderCode(code, codeProps || {})
      .then((element) => {
        setElement(element ?? "Failed");
      })
      .catch((e) => console.error(e.message));
  }, [near, gkey, rawCode, codeProps]);

  return element !== null && element !== undefined ? (
    <div className="position-relative overflow-hidden">{element}</div>
  ) : (
    Loading
  );
}
