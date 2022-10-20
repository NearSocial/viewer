import React, { useCallback, useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { NearConfig, StorageCostPerByte, TGas, useNear } from "../../data/near";
import VM from "../../vm/vm";
import {
  bigMax,
  convertToStringLeaves,
  ErrorFallback,
  estimateDataSize,
  extractKeys,
  Loading,
  removeDuplicates,
} from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import Big from "big.js";

const MinStorageBalance = StorageCostPerByte.mul(2000);
const InitialAccountStorageBalance = StorageCostPerByte.mul(500);
const ExtraStorageBalance = StorageCostPerByte.mul(500);

const Action = {
  ViewCall: "ViewCall",
  Fetch: "Fetch",
};

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

const fetchPreviousData = async (near, data) => {
  const keys = extractKeys(data);
  return await near.contract.get({
    keys,
  });
};

export const asyncCommitData = async (near, data, forceRewrite) => {
  const accountId = near.accountId;
  if (!accountId) {
    alert("You're not logged in, bro");
    return;
  }
  console.log("Committing data", data);
  const storageBalance = await near.contract.storage_balance_of({
    account_id: accountId,
  });
  const availableStorage = Big(storageBalance?.available || "0");
  data = {
    [near.accountId]: convertToStringLeaves(data),
  };
  let previousData = {};
  if (!forceRewrite) {
    previousData = await fetchPreviousData(near, data);
    data = removeDuplicates(data, previousData);
  }
  // console.log(data, previousData, estimateDataSize(data, previousData));
  // return;
  if (!data) {
    return;
  }
  const expectedDataBalance = StorageCostPerByte.mul(
    estimateDataSize(data, previousData)
  )
    .add(storageBalance ? Big(0) : InitialAccountStorageBalance)
    .add(ExtraStorageBalance);
  const deposit = bigMax(
    expectedDataBalance.sub(availableStorage),
    storageBalance ? Big(1) : MinStorageBalance
  );

  return await near.contract.set(
    {
      data,
    },
    TGas.mul(100).toFixed(0),
    deposit.toFixed(0)
  );
};

const globalCache = {};

const cachedPromise = async (key, promise) => {
  key = JSON.stringify(key);
  if (key in globalCache) {
    return await globalCache[key];
  }
  return await (globalCache[key] = promise());
};

export const cachedViewCall = async (
  near,
  contractId,
  methodName,
  args,
  blockId
) =>
  cachedPromise(
    {
      action: Action.ViewCall,
      contractId,
      methodName,
      args,
      blockId,
    },
    () => near.viewCall(contractId, methodName, args, blockId)
  );

export const cachedFetch = async (url, options) =>
  cachedPromise(
    {
      action: Action.Fetch,
      url,
      options,
    },
    async () => {
      options = {
        method: options?.method,
        headers: options?.headers,
        body: options?.body,
      };
      try {
        const response = await fetch(url, options);
        const status = response.status;
        const ok = response.ok;
        const contentType = response.headers.get("content-type");
        const body = await (ok &&
        contentType &&
        contentType.indexOf("application/json") !== -1
          ? response.json()
          : response.text());
        return {
          ok,
          status,
          contentType,
          body,
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        };
      }
    }
  );

export const socialGet = async (near, keys, recursive, blockId, options) => {
  if (!near) {
    return null;
  }
  keys = Array.isArray(keys) ? keys : [keys];
  keys = keys.map((key) => (recursive ? `${key}/**` : `${key}`));
  const args = {
    keys,
    options,
  };
  let data = await cachedViewCall(
    near,
    NearConfig.contractName,
    "get",
    args,
    blockId
  );

  if (keys.length === 1) {
    const parts = keys[0].split("/");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === "*" || part === "**") {
        break;
      }
      data = data?.[part];
    }
  }

  return data;
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

  const near = useNear();
  const [element, setElement] = useState(null);

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

  const commitData = useCallback(
    (data) => {
      if (!near) {
        return null;
      }
      asyncCommitData(near, data)
        .then(() => {})
        .catch(() => {});
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
        commitData,
        depth
      );
    });
  }, [near, gkey, parsedCode, commitData, depth]);

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
      {element}
    </ErrorBoundary>
  ) : (
    Loading
  );
}
