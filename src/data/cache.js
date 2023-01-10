import { NearConfig } from "./near";
import { indexMatch, isObject, patternMatch } from "./utils";
import { openDB } from "idb";
import { singletonHook } from "react-singleton-hook";

const Action = {
  ViewCall: "ViewCall",
  Fetch: "Fetch",
  Block: "Block",
  LocalStorage: "LocalStorage",
};

const CacheStatus = {
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Done: "Done",
  Invalidated: "Invalidated",
};

const CacheSubscriptionTimeoutMs = 5000;
const CacheDebug = false;

function invalidateCallbacks(cached, isFinal) {
  if (cached.invalidationCallbacks?.length) {
    const callbacks = cached.invalidationCallbacks;
    cached.invalidationCallbacks = [];
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
      isFinal ? NearConfig.finalSynchronizationDelayMs + 50 : 50
    );
  }
}

const CacheDb = "cacheDb";
const CacheDbObject = "cache-v1";

class Cache {
  constructor() {
    this.dbPromise = openDB(CacheDb, 1, {
      upgrade(db) {
        db.createObjectStore(CacheDbObject);
      },
    });
    this.cache = {};
  }

  async innerGet(key) {
    return (await this.dbPromise).get(CacheDbObject, key);
  }

  async innerSet(key, val) {
    return (await this.dbPromise).put(CacheDbObject, val, key);
  }

  cachedPromise(key, promise, invalidate, forceCachedValue) {
    key = JSON.stringify(key);
    const cached = this.cache[key] || {
      status: CacheStatus.NotStarted,
      invalidationCallbacks: [],
      result: null,
    };
    this.cache[key] = cached;
    if (!isObject(invalidate)) {
      invalidate = {
        onInvalidate: invalidate,
      };
    }
    if (invalidate.onInvalidate) {
      cached.invalidationCallbacks.push(invalidate.onInvalidate);
    }
    if (!cached.subscription && invalidate.subscribe) {
      const makeTimer = () => {
        cached.subscription = setTimeout(() => {
          CacheDebug && console.log("Cached subscription invalidation", key);
          if (document.hidden) {
            makeTimer();
          } else {
            cached.subscription = null;
            cached.status = CacheStatus.Invalidated;
            invalidateCallbacks(cached, false);
          }
        }, CacheSubscriptionTimeoutMs);
      };
      makeTimer();
    }
    if (
      cached.status === CacheStatus.InProgress ||
      cached.status === CacheStatus.Done
    ) {
      return cached.result;
    }
    if (cached.status === CacheStatus.NotStarted) {
      this.innerGet(key).then((cachedResult) => {
        if (
          (cachedResult || forceCachedValue) &&
          cached.status === CacheStatus.InProgress
        ) {
          CacheDebug && console.log("Cached value", key, cachedResult);
          cached.result = cachedResult;
          invalidateCallbacks(cached, false);
        }
      });
    }
    cached.status = CacheStatus.InProgress;
    if (promise) {
      promise()
        .then((result) => {
          CacheDebug && console.log("Fetched result", key);
          cached.status = CacheStatus.Done;
          if (JSON.stringify(result) !== JSON.stringify(cached.result)) {
            cached.result = result;
            this.innerSet(key, result);
            CacheDebug && console.log("Replacing value", key, result);
            invalidateCallbacks(cached, false);
          }
        })
        .catch((e) => {
          console.error(e);
          cached.status = CacheStatus.Done;
          const result = undefined;
          if (JSON.stringify(result) !== JSON.stringify(cached.result)) {
            cached.result = result;
            this.innerSet(key, result);
            CacheDebug && console.log("Replacing value", key, result);
            invalidateCallbacks(cached, false);
          }
        });
    }
    CacheDebug && console.log("New cache request", key);
    return cached.result;
  }

  invalidateCache(data) {
    const affectedKeys = [];
    const indexUrl = `${NearConfig.apiUrl}/index`;
    Object.keys(this.cache).forEach((stringKey) => {
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
        (!key.blockId ||
          key.blockId === "optimistic" ||
          key.blockId === "final")
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
      // Trying to parse index
      if (key.action === Action.Fetch && key.url === indexUrl) {
        try {
          const { action, key: indexKey } = JSON.parse(key.options?.body);
          if (action && indexKey && indexMatch(action, indexKey, data)) {
            // console.log("Invalidating index", action, indexKey);
            affectedKeys.push([stringKey, true]);
          }
        } catch {
          // ignore
        }
      }
    });
    console.log("Cache invalidation", affectedKeys);
    affectedKeys.forEach(([stringKey, isFinal]) => {
      const cached = this.cache[stringKey];
      cached.status = CacheStatus.Invalidated;
      invalidateCallbacks(cached, isFinal);
    });
  }

  cachedBlock(near, blockId, invalidate) {
    return this.cachedPromise(
      {
        action: Action.Block,
        blockId,
      },
      () => near.block(blockId),
      invalidate
    );
  }

  cachedViewCall(near, contractId, methodName, args, blockId, invalidate) {
    return this.cachedPromise(
      {
        action: Action.ViewCall,
        contractId,
        methodName,
        args,
        blockId,
      },
      () => near.viewCall(contractId, methodName, args, blockId),
      invalidate
    );
  }

  async asyncFetch(url, options) {
    const blob = !!options?.blob;
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
      const body = await (ok && blob
        ? response.blob()
        : contentType && contentType.indexOf("application/json") !== -1
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

  cachedFetch(url, options, invalidate) {
    return this.cachedPromise(
      {
        action: Action.Fetch,
        url,
        options,
      },
      () => this.asyncFetch(url, options),
      invalidate
    );
  }

  socialGet(near, keys, recursive, blockId, options, invalidate) {
    if (!near) {
      return null;
    }
    keys = Array.isArray(keys) ? keys : [keys];
    keys = keys.map((key) => (recursive ? `${key}/**` : `${key}`));
    const args = {
      keys,
      options,
    };
    let data = this.cachedViewCall(
      near,
      NearConfig.contractName,
      "get",
      args,
      blockId,
      invalidate
    );
    if (data === null) {
      return null;
    }

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
  }

  socialIndex(action, key, options, invalidate) {
    const res = this.cachedFetch(
      `${NearConfig.apiUrl}/index`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          key,
          options,
        }),
      },
      invalidate
    );

    return res?.ok ? res.body : null;
  }

  localStorageGet(domain, key, invalidate) {
    return this.cachedPromise(
      {
        action: Action.LocalStorage,
        domain,
        key,
      },
      undefined,
      invalidate,
      true
    );
  }

  asyncLocalStorageGet(domain, key) {
    key = JSON.stringify({
      action: Action.LocalStorage,
      domain,
      key,
    });

    return this.innerGet(key);
  }

  localStorageSet(domain, key, value) {
    key = JSON.stringify({
      action: Action.LocalStorage,
      domain,
      key,
    });
    const cached = this.cache[key] || {
      status: CacheStatus.NotStarted,
      invalidationCallbacks: [],
      result: null,
    };
    this.cache[key] = cached;
    cached.status = CacheStatus.Done;
    if (JSON.stringify(value) !== JSON.stringify(cached.result)) {
      cached.result = value;
      this.innerSet(key, value);
      CacheDebug && console.log("Replacing value", key, value);
      invalidateCallbacks(cached, false);
    }
  }
}

const defaultCache = new Cache();
export const useCache = singletonHook(defaultCache, () => {
  return defaultCache;
});
