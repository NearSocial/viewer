import Big from "big.js";
import {
  BridgeTokenStorageDeposit,
  NearConfig,
  TokenStorageDeposit,
} from "./near";
import React from "react";
import Timer from "react-compound-timer";

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

const isArray = function (a) {
  return Array.isArray(a);
};

const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== "function";
};

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
  balance ? (
    <>
      {bigToString(balance.div(OneNear))}{" "}
      <span className="text-secondary">NEAR</span>
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

export const formatTimer = () => (
  <React.Fragment>
    <Timer.Days
      formatValue={(v) => (v > 1 ? `${v} days ` : v ? `1 day ` : "")}
    />
    <Timer.Hours />:
    <Timer.Minutes formatValue={(v) => `${v}`.padStart(2, "0")} />
    :
    <Timer.Seconds formatValue={(v) => `${v}`.padStart(2, "0")} />
  </React.Fragment>
);

export const isBridgeToken = (tokenAccountId) => {
  return tokenAccountId.endsWith(".bridge.near");
};

export const tokenStorageDeposit = async (tokenAccountId) => {
  return isBridgeToken(tokenAccountId)
    ? BridgeTokenStorageDeposit
    : TokenStorageDeposit;
};
