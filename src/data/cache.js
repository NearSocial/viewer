import { NearConfig } from "./near";
import { patternMatch } from "./utils";

const Action = {
  ViewCall: "ViewCall",
  Fetch: "Fetch",
  Block: "Block",
};

const globalCache = {};
const invalidationCallbacks = {};

const cachedPromise = async (key, promise, onInvalidate) => {
  key = JSON.stringify(key);
  if (onInvalidate) {
    invalidationCallbacks[key] = invalidationCallbacks[key] || [];
    invalidationCallbacks[key].push(onInvalidate);
  }
  if (key in globalCache) {
    return await globalCache[key];
  }
  return await (globalCache[key] = promise());
};

export const invalidateCache = (data) => {
  const affectedKeys = [];
  Object.keys(globalCache).forEach((stringKey) => {
    let key;
    try {
      key = JSON.parse(stringKey);
    } catch (e) {
      console.error("Key deserialization failed", stringKey);
      return;
    }
    if (
      key.action === Action.ViewCall &&
      key.contractId === NearConfig.contractName &&
      (!key.blockId || key.blockId === "optimistic" || key.blockId === "final")
    ) {
      try {
        const keys = key.args?.keys;
        if (
          keys.some((pattern) => patternMatch(key.methodName, pattern, data))
        ) {
          affectedKeys.push([stringKey, key.blockId === "final"]);
        }
      } catch {
        // ignore
      }
    }
  });
  console.log("Cache invalidation", affectedKeys);
  affectedKeys.forEach(([stringKey, isFinal]) => {
    delete globalCache[stringKey];
    const callbacks = invalidationCallbacks[stringKey];
    delete invalidationCallbacks[stringKey];
    if (callbacks) {
      setTimeout(
        () => {
          callbacks.forEach((cb) => {
            try {
              cb();
            } catch {
              // ignore
            }
          });
        },
        isFinal ? 1550 : 50
      );
    }
  });
};

export const cachedBlock = async (near, blockId, onInvalidate) =>
  cachedPromise(
    {
      action: Action.Block,
      blockId,
    },
    () => near.block(blockId),
    onInvalidate
  );

export const cachedViewCall = async (
  near,
  contractId,
  methodName,
  args,
  blockId,
  onInvalidate
) =>
  cachedPromise(
    {
      action: Action.ViewCall,
      contractId,
      methodName,
      args,
      blockId,
    },
    () => near.viewCall(contractId, methodName, args, blockId),
    onInvalidate
  );

export const cachedFetch = async (url, options, onInvalidate) =>
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
    },
    onInvalidate
  );

export const socialGet = async (
  near,
  keys,
  recursive,
  blockId,
  options,
  onInvalidate
) => {
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
    blockId,
    onInvalidate
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
