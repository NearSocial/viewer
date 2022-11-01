import React, { useCallback, useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { useNear } from "../../data/near";
import ConfirmTransaction from "../ConfirmTransaction";
import VM from "../../vm/vm";
import { ErrorFallback, Loading } from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import { socialGet } from "../../data/cache";
import { asyncCommitData } from "../../data/commitData";

const AcornOptions = {
  ecmaVersion: 13,
  allowReturnOutsideFunction: true,
};

const ParsedCodeCache = {};
const JsxParser = Parser.extend(jsx());

const parseCode = (code) => {
  if (code in ParsedCodeCache) {
    return ParsedCodeCache[code];
  }
  return (ParsedCodeCache[code] = JsxParser.parse(code, AcornOptions));
};

export function Widget(props) {
  const [gkey] = useState(uuid());
  const src = props.src;
  const rawCode = props.code;
  const codeProps = props.props;
  const depth = props.depth || 0;

  const [code, setCode] = useState(null);
  const [state, setState] = useState(undefined);
  const [cache, setCache] = useState({});
  const [parsedCode, setParsedCode] = useState(null);
  const [context, setContext] = useState({});
  const [vm, setVm] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const near = useNear();
  const [element, setElement] = useState(null);
  const [confirmElement, setConfirmElement] = useState(null);

  useEffect(() => {
    if (!near) {
      return;
    }
    setVm(null);
    if (src) {
      setCode(null);
      socialGet(near, src.toString())
        .then(setCode)
        .catch(() => setCode(null));
    } else {
      setCode(rawCode);
    }
  }, [near, src, rawCode]);

  useEffect(() => {
    if (!code) {
      return;
    }
    try {
      const parsedCode = parseCode(code);
      setParsedCode(parsedCode);
    } catch (e) {
      setElement(
        <div className="alert alert-danger">
          Compile error:
          <pre>{e.message}</pre>
          <pre>{e.stack}</pre>
        </div>
      );
      console.error(e);
    }
  }, [code]);

  const confirmTransaction = useCallback(
    (transaction) => {
      if (!near) {
        return null;
      }
      console.log("confirm");
      setTransaction(transaction);
    },
    [near]
  );

  useEffect(() => {
    if (!near || !parsedCode) {
      return;
    }
    setState(undefined);
    setVm((prev) => {
      if (prev) {
        prev.alive = false;
      }
      return new VM(
        near,
        gkey,
        parsedCode,
        setState,
        setCache,
        confirmTransaction,
        depth
      );
    });
  }, [near, gkey, parsedCode, depth]);

  useEffect(() => {
    if (!near) {
      return;
    }
    setContext({
      accountId: near.accountId,
    });
  }, [near]);

  useEffect(() => {
    if (!vm) {
      return;
    }
    try {
      setElement(
        vm.renderCode({
          props: codeProps || {},
          context,
          state,
          cache,
        }) ?? "Execution failed"
      );
    } catch (e) {
      setElement(
        <div className="alert alert-danger">
          Execution error:
          <pre>{e.message}</pre>
          <pre>{e.stack}</pre>
        </div>
      );
      console.error(e);
    }
  }, [vm, codeProps, context, state, cache]);

  return element !== null && element !== undefined ? (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setElement(null);
      }}
      resetKeys={[element]}
    >
      <>
        {element}
        {
          <ConfirmTransaction
            near={near}
            transaction={transaction}
            onHide={() => setTransaction(null)}
          />
        }
      </>
    </ErrorBoundary>
  ) : (
    Loading
  );
}
