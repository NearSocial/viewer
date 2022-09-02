import React, { useCallback, useEffect, useState } from "react";
import { Parser } from "acorn";
import uuid from "react-uuid";
import * as jsx from "acorn-jsx";
import { StorageCostPerByte, TGas, useNear } from "../../data/near";
import VM from "../../vm/vm";
import { ErrorFallback, Loading } from "../../data/utils";
import { ErrorBoundary } from "react-error-boundary";
import Big from "big.js";

const MinStorageBalance = StorageCostPerByte.mul(5000);
const AdditionalStorageBalance = StorageCostPerByte.mul(20000);

const AcornOptions = {
  ecmaVersion: 13,
  allowReturnOutsideFunction: true,
};

const parseCode = (code) => {
  return Parser.extend(jsx()).parse(code, AcornOptions);
};

export const asyncCommitData = async (near, data) => {
  const accountId = near.accountId;
  if (!accountId) {
    alert("You're not logged in, bro");
    return;
  }
  console.log("Committing data", data);
  const storageBalance = await near.contract.storage_balance_of({
    account_id: accountId,
  });
  const deposit = Big(storageBalance?.available || "0").gte(MinStorageBalance)
    ? Big(1)
    : AdditionalStorageBalance;

  return await near.contract.set(
    {
      data: {
        [near.accountId]: data,
      },
    },
    TGas.mul(100).toFixed(0),
    deposit.toFixed(0)
  );
};

export const socialGet = async (near, key, recursive) => {
  if (!near) {
    return null;
  }
  let data = await near.contract.get({
    keys: [recursive ? `${key}/**` : key],
  });

  key.split("/").forEach((part) => {
    data = data?.[part];
  });

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
      console.log(parsedCode);
      setParsedCode(parsedCode);
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
        <div>
          Execution error:
          <pre>{e.message}</pre>
          <pre>{e.stack}</pre>
        </div>
      );
      console.error(e);
    }
  }, [vm, codeProps, context, state, cache]);

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
