import React, { useCallback, useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { StorageCostPerByte, TGas, useNear } from "../../data/near";
import VM from "../../vm/vm";
import {
  bigMax,
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

const AcornOptions = {
  ecmaVersion: 13,
  allowReturnOutsideFunction: true,
};

const parseCode = (code) => {
  return Parser.extend(jsx()).parse(code, AcornOptions);
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
    [near.accountId]: data,
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

export const socialGet = async (near, key, recursive) => {
  if (!near) {
    return null;
  }
  key = recursive ? `${key}/**` : `${key}`;
  let data = await near.contract.get({
    keys: [key],
  });

  const parts = key.split("/");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === "*" || part === "**") {
      break;
    }
    data = data?.[part];
  }

  return data;
};

export function Widget(props) {
  const [gkey] = useState(uuid());
  const src = props.src;
  const rawCode = props.code;
  const codeProps = props.props;

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
    if (src) {
      socialGet(near, src.toString()).then(setCode);
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
      // console.log(parsedCode);
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
    setVm(new VM(near, gkey, parsedCode, setState, setCache, commitData));
  }, [near, gkey, parsedCode, commitData]);

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
    <div className="d-inline-block position-relative overflow-hidden">
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
