import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Parser } from "acorn";
import * as jsx from "acorn-jsx";
import { TGas, useNear } from "../../data/near";
import ConfirmTransactions from "../ConfirmTransactions";
import VM from "../../vm/vm";
import { ErrorFallback, Loading } from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import { useCache } from "../../data/cache";
import { CommitModal } from "../Commit";
import { useAccountId } from "../../data/account";
import Big from "big.js";

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
  const [transactions, setTransactions] = useState(null);
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
    setParsedCode(null);
    setElement(null);
    if (src) {
      const code = cache.socialGet(
        near,
        src.toString(),
        false,
        undefined,
        undefined,
        () => {
          setNonce(nonce + 1);
        }
      );
      setCode(code);
      if (code === undefined) {
        setElement(
          <div className="alert alert-danger">
            Source code for "{src}" is not found
          </div>
        );
      }
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
          Compilation error:
          <pre>{e.message}</pre>
          <pre>{e.stack}</pre>
        </div>
      );
      console.error(e);
    }
  }, [code]);

  const confirmTransactions = useCallback(
    (transactions) => {
      if (!near || !transactions || transactions.length === 0) {
        return null;
      }
      transactions = transactions.map((t) => ({
        contractName: t.contractName,
        methodName: t.methodName,
        args: t.args || {},
        deposit: t.deposit ? Big(t.deposit) : Big(0),
        gas: t.gas ? Big(t.gas) : TGas.mul(30),
      }));
      console.log("confirm txs", transactions);
      setTransactions(transactions);
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
      code: parsedCode.parsedCode,
      setReactState: setState,
      cache,
      refreshCache: () => {
        setCacheNonce((cacheNonce) => cacheNonce + 1);
      },
      confirmTransactions,
      depth,
      widgetSrc: src,
      requestCommit,
    });
    setVm(vm);
    return () => {
      vm.alive = false;
    };
  }, [src, near, parsedCode, depth, requestCommit, confirmTransactions]);

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
        {transactions && (
          <ConfirmTransactions
            transactions={transactions}
            onHide={() => setTransactions(null)}
          />
        )}
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
