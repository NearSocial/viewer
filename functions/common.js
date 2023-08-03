import { Buffer } from "node:buffer";

export async function socialIndex(action, key, options) {
  const request = await fetch("https://api.near.social/index", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      key,
      options,
    }),
  });
  return await request.json();
}

export async function socialKeys(keys, blockHeight, options) {
  const request = await fetch("https://api.near.social/keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keys: [keys],
      blockHeight,
      options,
    }),
  });
  return await request.json();
}

export async function socialGet(keys, blockHeight, parse) {
  const request = await fetch("https://api.near.social/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keys: [keys],
      blockHeight,
    }),
  });
  let data = await request.json();
  const parts = keys.split("/");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === "*" || part === "**") {
      break;
    }
    data = data?.[part];
  }
  if (parse) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return data;
}

export async function viewCall({ contractId, method, args }) {
  const res = await fetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "call_function",
        finality: "final",
        account_id: contractId,
        method_name: method,
        args_base64: btoa(JSON.stringify(args)),
      },
    }),
  });
  const json = await res.json();
  const result = Buffer.from(json.result.result).toString("utf-8");
  return JSON.parse(result);
}
