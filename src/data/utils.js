import Big from "big.js";
import { NearConfig, TGas } from "./near";
import React from "react";
import { useLocation } from "react-router-dom";
import equal from "deep-equal";
import { ethers } from "ethers";

const MinAccountIdLen = 2;
const MaxAccountIdLen = 64;
const ValidAccountRe = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
export const OneNear = Big(10).pow(24);
const AccountSafetyMargin = OneNear.div(2);

export const Loading = (
  <span
    className="spinner-grow spinner-grow-sm me-1"
    role="status"
    aria-hidden="true"
  />
);

export const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export function isValidAccountId(accountId) {
  return (
    accountId &&
    accountId.length >= MinAccountIdLen &&
    accountId.length <= MaxAccountIdLen &&
    accountId.match(ValidAccountRe)
  );
}

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

export const isArray = (a) => Array.isArray(a);

export const isObject = (o) =>
  o === Object(o) && !isArray(o) && typeof o !== "function";

export const isString = (s) => typeof s === "string";

export const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

export const bigMin = (a, b) => {
  if (a && b) {
    return a.lt(b) ? a : b;
  }
  return a || b;
};

export const bigMax = (a, b) => {
  if (a && b) {
    return a.gt(b) ? a : b;
  }
  return a || b;
};

export const bigToString = (b, p, len) => {
  if (b === null) {
    return "???";
  }
  let s = b.toFixed();
  let pos = s.indexOf(".");
  p = p || 6;
  len = len || 7;
  if (pos > 0) {
    let ap = Math.min(p, Math.max(len - pos, 0));
    if (ap > 0) {
      ap += 1;
    }
    if (pos + ap < s.length) {
      s = s.substring(0, pos + ap);
    }
  } else {
    pos = s.length;
  }
  for (let i = pos - 4; i >= 0; i -= 3) {
    s = s.slice(0, i + 1) + "," + s.slice(i + 1);
  }

  if (s === "0.000000" && p === 6 && len === 7) {
    return "<0.000001";
  }

  return s;
};

export const displayNear = (balance) =>
  !balance ? (
    "???"
  ) : balance.eq(1) ? (
    <>
      1 <span className="text-secondary">yoctoNEAR</span>
    </>
  ) : (
    <>
      {bigToString(balance.div(OneNear))}{" "}
      <span className="text-secondary">NEAR</span>
    </>
  );

export const displayGas = (gas) =>
  gas ? (
    <>
      {bigToString(gas.div(TGas))} <span className="text-secondary">TGas</span>
    </>
  ) : (
    "???"
  );

export const dateToString = (d) => {
  return d.toLocaleString("en-us", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const displayTime = (d) => {
  return d.toLocaleString();
};

export const availableNearBalance = (account) => {
  if (account && !account.loading && account.state) {
    let balance = Big(account.state.amount).sub(
      Big(account.state.storage_usage).mul(Big(NearConfig.storageCostPerByte))
    );
    if (balance.gt(AccountSafetyMargin)) {
      return balance.sub(AccountSafetyMargin);
    }
  }
  return Big(0);
};

export const isoDate = (d) =>
  d ? new Date(d).toISOString().substring(0, 10) : "";

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ipfsUpload = async (f) => {
  const res = await fetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: f,
  });
  return (await res.json()).cid;
};

export const ipfsUrl = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const EstimatedKeyValueSize = 40 * 3 + 8 + 12;
const EstimatedNodeSize = 40 * 2 + 8 + 10;

export const estimateDataSize = (data, prevData) =>
  isObject(data)
    ? Object.entries(data).reduce(
        (s, [key, value]) => {
          const prevValue = isObject(prevData) ? prevData[key] : undefined;
          return (
            s +
            (prevValue !== undefined
              ? estimateDataSize(value, prevValue)
              : key.length * 2 +
                estimateDataSize(value, undefined) +
                EstimatedKeyValueSize)
          );
        },
        isObject(prevData) ? 0 : EstimatedNodeSize
      )
    : (data?.length || 8) - (isString(prevData) ? prevData.length : 0);

export const extractKeys = (data, prefix = "") =>
  Object.entries(data)
    .map(([key, value]) =>
      isObject(value)
        ? extractKeys(value, `${prefix}${key}/`)
        : `${prefix}${key}`
    )
    .flat();

export const removeDuplicates = (data, prevData) => {
  const obj = Object.entries(data).reduce((obj, [key, value]) => {
    const prevValue = isObject(prevData) ? prevData[key] : undefined;
    if (isObject(value)) {
      const newValue = isObject(prevValue)
        ? removeDuplicates(value, prevValue)
        : value;
      if (newValue !== undefined) {
        obj[key] = newValue;
      }
    } else if (value !== prevValue) {
      obj[key] = value;
    }

    return obj;
  }, {});
  return Object.keys(obj).length ? obj : undefined;
};

const stringify = (s) => (isString(s) || s === null ? s : JSON.stringify(s));

export const convertToStringLeaves = (data) => {
  return isObject(data)
    ? Object.entries(data).reduce((obj, [key, value]) => {
        obj[stringify(key)] = convertToStringLeaves(value);
        return obj;
      }, {})
    : stringify(data);
};

const matchGet = (obj, keys) => {
  const matchKey = keys[0];
  let isRecursiveMatch = matchKey === "**";
  if (isRecursiveMatch) {
    return keys.length === 1;
  }
  const values =
    matchKey === "*" || isRecursiveMatch
      ? Object.values(obj)
      : matchKey in obj
      ? [obj[matchKey]]
      : [];

  return values.some((value) =>
    isObject(value)
      ? keys.length > 1
        ? matchGet(value, keys.slice(1))
        : value[""] !== undefined
      : keys.length === 1
  );
};

const matchKeys = (obj, keys) => {
  const matchKey = keys[0];
  const values =
    matchKey === "*"
      ? Object.values(obj)
      : matchKey in obj
      ? [obj[matchKey]]
      : [];

  return values.some(
    (value) =>
      keys.length === 1 || (isObject(value) && matchKeys(value, keys.slice(1)))
  );
};

export const patternMatch = (method, pattern, data) => {
  const path = pattern.split("/");
  return method === "get"
    ? matchGet(data, path)
    : method === "keys" && matchKeys(data, path);
};

export const indexMatch = (action, key, data) => {
  return Object.values(data).some((value) => {
    const indexValue = value?.index?.[action];
    try {
      return (
        indexValue &&
        JSON.stringify(JSON.parse(indexValue).key) === JSON.stringify(key)
      );
    } catch {
      return false;
    }
  });
};

const KnownSecondLevelKeys = {
  graph: true,
  post: true,
  index: true,
  settings: true,
};

export const computeWritePermission = (previousPermissions, data) => {
  const permissions = isObject(previousPermissions)
    ? JSON.parse(JSON.stringify(previousPermissions))
    : {};

  if (isObject(data)) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in KnownSecondLevelKeys) {
        if (isObject(value)) {
          const subPermissions = (permissions[key] = permissions[key] || {});
          Object.keys(value).forEach((key) => {
            subPermissions[key] = true;
          });
        } else {
          permissions[key] = true;
        }
      } else {
        permissions[key] = true;
      }
    });
  }

  // console.log(
  //   JSON.stringify(previousPermissions),
  //   JSON.stringify(data),
  //   JSON.stringify(permissions)
  // );
  return permissions;
};

function isGetter(obj, prop) {
  return !!Object.getOwnPropertyDescriptor(obj, prop)["get"];
}

export const deepFreeze = (obj) => {
  Object.keys(obj).forEach((prop) => {
    if (
      !isGetter(obj, prop) &&
      typeof obj[prop] === "object" &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
};

export const ReactKey = "$$typeof";
export const isReactObject = (o) =>
  o !== null && typeof o === "object" && !!o[ReactKey];

export const deepCopy = (o) => {
  if (Array.isArray(o)) {
    return o.map((v) => deepCopy(v));
  } else if (o instanceof Map) {
    return new Map(
      [...o.entries()].map(([k, v]) => [deepCopy(k), deepCopy(v)])
    );
  } else if (o instanceof Set) {
    return new Set([...o].map((v) => deepCopy(v)));
  } else if (Buffer.isBuffer(o)) {
    return Buffer.from(o);
  } else if (o instanceof URL) {
    return new URL(o);
  } else if (o instanceof File) {
    return new File([o], o.name, { type: o.type });
  } else if (o instanceof Blob) {
    return new Blob([o], { type: o.type });
  } else if (o instanceof Uint8Array || o instanceof ArrayBuffer) {
    return o.slice(0);
  } else if (o instanceof ethers.BigNumber) {
    return o;
  } else if (isObject(o)) {
    if (isReactObject(o)) {
      return o;
    }
    return Object.fromEntries(
      Object.entries(o).map(([key, value]) => [key, deepCopy(value)])
    );
  } else if (o === undefined || typeof o === "function") {
    return o;
  } else {
    return JSON.parse(JSON.stringify(o));
  }
};

export const deepEqual = equal;
