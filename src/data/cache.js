import { NearConfig } from "./near";

const Action = {
  ViewCall: "ViewCall",
  Fetch: "Fetch",
  Block: "Block",
};

const globalCache = {};

const cachedPromise = async (key, promise) => {
  key = JSON.stringify(key);
  if (key in globalCache) {
    return await globalCache[key];
  }
  return await (globalCache[key] = promise());
};

export const cachedBlock = async (near, blockId) =>
  cachedPromise(
    {
      action: Action.Block,
      blockId,
    },
    () => near.block(blockId)
  );

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
