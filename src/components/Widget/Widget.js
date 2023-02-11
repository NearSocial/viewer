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
import {
  deepEqual,
  ErrorFallback,
  isObject,
  isString,
  Loading,
} from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import { useCache } from "../../data/cache";
import { CommitModal } from "../Commit";
import { useAccountId } from "../../data/account";
import Big from "big.js";
import uuid from "react-uuid";
import { isFunction } from "react-bootstrap-typeahead/types/utils";

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

const computeSrcOrCode = (src, code, configs) => {
  let srcOrCode = src ? { src } : code ? { code } : null;
  for (const config of configs || []) {
    if (srcOrCode?.src) {
      const src = srcOrCode.src;
      let value = isObject(config?.redirectMap) && config.redirectMap[src];
      if (!value) {
        try {
          value = isFunction(config?.redirect) && config.redirect(src);
        } catch {}
      }
      if (isString(value)) {
        srcOrCode = { src: value };
      } else if (isString(value?.code)) {
        return { code: value.code };
      }
    }
  }
  return srcOrCode;
};

export function Widget(props) {
  const propsSrc = props.src;
  const propsCode = props.code;
  const propsProps = props.props;
  const depth = props.depth || 0;
  const propsConfig = props.config;

  const [nonce, setNonce] = useState(0);
  const [code, setCode] = useState(null);
  const [src, setSrc] = useState(null);
  const [state, setState] = useState(undefined);
  const [cacheNonce, setCacheNonce] = useState(0);
  const [parsedCode, setParsedCode] = useState(null);
  const [context, setContext] = useState({});
  const [vm, setVm] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [commitRequest, setCommitRequest] = useState(null);
  const [prevVmInput, setPrevVmInput] = useState(null);
  const [configs, setConfigs] = useState(null);
  const [srcOrCode, setSrcOrCode] = useState(null);

  const cache = useCache();
  const near = useNear();
  const accountId = useAccountId();
  const [element, setElement] = useState(null);

  useEffect(() => {
    const newConfigs = propsConfig
      ? Array.isArray(propsConfig)
        ? propsConfig
        : [propsConfig]
      : [];
    if (!deepEqual(newConfigs, configs)) {
      setConfigs(newConfigs);
    }
  }, [propsConfig, configs]);

  useEffect(() => {
    const computedSrcOrCode = computeSrcOrCode(propsSrc, propsCode, configs);
    if (!deepEqual(computedSrcOrCode, srcOrCode)) {
      setSrcOrCode(computedSrcOrCode);
    }
  }, [propsSrc, propsCode, configs, srcOrCode]);

  useEffect(() => {
    if (!near) {
      return;
    }
    if (srcOrCode?.src) {
      const src = srcOrCode.src;
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
      setSrc(src);
    } else if (srcOrCode?.code) {
      setCode(srcOrCode.code);
      setSrc(null);
    }
  }, [near, srcOrCode, nonce]);

  useEffect(() => {
    setVm(null);
    setElement(null);
    if (!code) {
      if (code === undefined) {
        setElement(
          <div className="alert alert-danger">
            Source code for "{src}" is not found
          </div>
        );
      }
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
  }, [code, src]);

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
      if (!near) {
        return null;
      }
      console.log("commit requested", commitRequest);
      setCommitRequest(commitRequest);
    },
    [near]
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
      version: uuid(),
      widgetConfigs: configs,
    });
    setVm(vm);
    return () => {
      vm.alive = false;
    };
  }, [
    src,
    near,
    parsedCode,
    depth,
    requestCommit,
    confirmTransactions,
    configs,
  ]);

  useEffect(() => {
    if (!near) {
      return;
    }
    setContext({
      loading: false,
      accountId: accountId ?? null,
      widgetSrc: src,
    });
  }, [near, accountId, src]);

  useLayoutEffect(() => {
    if (!vm) {
      return;
    }
    const vmInput = {
      props: propsProps || {},
      context,
      state,
      cacheNonce,
      version: vm.version,
    };
    if (deepEqual(vmInput, prevVmInput)) {
      return;
    }
    setPrevVmInput(vmInput);
    try {
      setElement(vm.renderCode(vmInput) ?? "Execution failed");
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
  }, [vm, propsProps, context, state, cacheNonce, prevVmInput]);

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
