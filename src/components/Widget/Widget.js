import React, { useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { useNear } from "../../data/near";
import VM from "../../vm/vm";

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
    new VM(near)
      .renderCode(code, codeProps || {})
      .then((element) => {
        setElement(element ?? "Failed");
      })
      .catch((e) => console.error(e.message));
  }, [near, rawCode, codeProps]);

  return element || "Loading";

  // if (typeof src === "string") {
  //   return src;
  // } else if (Array.isArray(src)) {
  //   return src.map((w, index) => (
  //     <Widget key={`${gkey}-w-${index}`} {...props} src={w} />
  //   ));
  // }
  // let element = null;
  // if (src.element === Element.Text) {
  //   element = <span>{src.content}</span>;
  // } else if (src.element === Element.Image) {
  //   element = <img src={src.content} alt={src.alt} />;
  // } else if (src.element === Element.Widget) {
  //   element = <Widget src={src.content} />;
  // } else {
  //   element = <div>Unknown element</div>;
  // }
}
