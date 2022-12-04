import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { useAccountId, useNear } from "../../data/near";
import ConfirmTransaction from "../ConfirmTransaction";
import VM from "../../vm/vm";
import { ErrorFallback, Loading } from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import { socialGet, useCache } from "../../data/cache";
import { CommitModal } from "../Commit";

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

  const [nonce, setNonce] = useState(0);
  const [code, setCode] = useState(null);
  const [state, setState] = useState(undefined);
  const [cacheNonce, setCacheNonce] = useState(0);
  const [parsedCode, setParsedCode] = useState(null);
  const [context, setContext] = useState({});
  const [vm, setVm] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [commitRequest, setCommitRequest] = useState(null);

  const cache = useCache();
  const near = useNear();
  const accountId = useAccountId();
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!near) {
      return;
    }
    setVm(null);
    if (src) {
      setCode(null);
      setCode(
        cache.socialGet(
          near,
          src.toString(),
          false,
          undefined,
          undefined,
          () => {
            setNonce(nonce + 1);
          }
        )
      );
    } else {
      setCode(rawCode);
    }
  }, [near, src, nonce, rawCode]);

  useEffect(() => {
    if (!code) {
      return;
    }
    try {
      const parsedCode = parseCode(code);
      setParsedCode({ parsedCode });
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
      console.log("confirm", transaction);
      setTransaction(transaction);
    },
    [near]
  );

  const requestCommit = useCallback(
    (commitRequest) => {
      if (!near || !accountId) {
        return null;
      }
      console.log("commit requested", commitRequest);
      setCommitRequest(commitRequest);
    },
    [near, accountId]
  );

  useEffect(() => {
    if (!near || !parsedCode) {
      return;
    }
    setState(undefined);
    const vm = new VM({
      near,
      gkey,
      code: parsedCode.parsedCode,
      setReactState: setState,
      cache,
      refreshCache: () => {
        setCacheNonce((cacheNonce) => cacheNonce + 1);
      },
      confirmTransaction,
      depth,
      widgetSrc: src,
      requestCommit,
    });
    setVm(vm);
    return () => {
      vm.alive = false;
    };
  }, [src, near, gkey, parsedCode, depth, requestCommit, confirmTransaction]);

  useEffect(() => {
    if (!near) {
      return;
    }
    setContext({
      loading: accountId === undefined,
      accountId,
    });
  }, [near, accountId]);

  useLayoutEffect(() => {
    if (!vm) {
      return;
    }
    try {
      setElement(
        vm.renderCode({
          props: codeProps || {},
          context,
          state,
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
  }, [vm, codeProps, context, state, cacheNonce]);

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
        <ConfirmTransaction
          transaction={transaction}
          onHide={() => setTransaction(null)}
        />
        {commitRequest && (
          <CommitModal
            show={true}
            widgetSrc={src}
            data={commitRequest.data}
            force={commitRequest.force}
            onHide={() => setCommitRequest(null)}
            onCommit={commitRequest.onCommit}
            onCancel={commitRequest.onCancel}
          />
        )}
      </>
    </ErrorBoundary>
  ) : (
    Loading
  );
}
