import { NearConfig } from "./near";
import { patternMatch } from "./utils";
import { openDB } from "idb";
import { singletonHook } from "react-singleton-hook";

const Action = {
  ViewCall: "ViewCall",
  Fetch: "Fetch",
  Block: "Block",
  Index: "Index",
};

const CacheStatus = {
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Done: "Done",
};

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

  cachedPromise(key, promise, onInvalidate) {
    key = JSON.stringify(key);
    const cached = this.cache[key] || {
      status: CacheStatus.NotStarted,
      invalidationCallbacks: [],
      result: null,
    };
    this.cache[key] = cached;
    if (onInvalidate) {
      cached.invalidationCallbacks.push(onInvalidate);
    }
    if (cached.status !== CacheStatus.NotStarted) {
      return cached.result;
    }
    cached.status = CacheStatus.InProgress;
    this.innerGet(key).then((cachedResult) => {
      if (cachedResult && cached.status === CacheStatus.InProgress) {
        CacheDebug && console.log("Cached value", key, cachedResult);
        cached.result = cachedResult;
        cached.status = CacheStatus.InProgress;
        invalidateCallbacks(cached, false);
      }
    });
    promise().then((result) => {
      CacheDebug && console.log("Fetched result", key);
      cached.status = CacheStatus.Done;
      if (JSON.stringify(result) !== JSON.stringify(cached.result)) {
        cached.result = result;
        this.innerSet(key, result);
        CacheDebug && console.log("Replacing value", key, result);
        invalidateCallbacks(cached, false);
      }
    });
    CacheDebug && console.log("New cache request", key);
    return null;
  }

  invalidateCache(data) {
    const affectedKeys = [];
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
    });
    console.log("Cache invalidation", affectedKeys);
    affectedKeys.forEach(([stringKey, isFinal]) => {
      const cached = this.cache[stringKey];
      cached.status = CacheStatus.NotStarted;
      invalidateCallbacks(cached, isFinal);
    });
  }

  cachedBlock(near, blockId, onInvalidate) {
    return this.cachedPromise(
      {
        action: Action.Block,
        blockId,
      },
      () => near.block(blockId),
      onInvalidate
    );
  }

  cachedViewCall(near, contractId, methodName, args, blockId, onInvalidate) {
    return this.cachedPromise(
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
  }

  cachedFetch(url, options, onInvalidate) {
    return this.cachedPromise(
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
  }

  socialGet(near, keys, recursive, blockId, options, onInvalidate) {
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
      onInvalidate
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

  socialIndex(action, key, options, onInvalidate) {
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
      onInvalidate
    );

    return res?.ok ? res.body : null;
  }
}

const defaultCache = new Cache();
export const useCache = singletonHook(defaultCache, () => {
  return defaultCache;
});
