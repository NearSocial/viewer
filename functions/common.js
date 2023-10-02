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

export async function nftToImageUrl({ contractId, tokenId }) {
  const [token, nftMetadata] = await Promise.all([
    tokenId
      ? viewCall({
          contractId,
          method: "nft_token",
          args: { token_id: tokenId },
        })
      : Promise.resolve(null),
    viewCall({
      contractId,
      method: "nft_metadata",
      args: {},
    }),
  ]);

  if (!tokenId) {
    return nftMetadata.icon;
  }

  const tokenMetadata = token?.metadata || {};
  const tokenMedia = tokenMetadata.media || "";

  let imageUrl =
    tokenMedia.startsWith("https://") ||
    tokenMedia.startsWith("http://") ||
    tokenMedia.startsWith("data:image")
      ? tokenMedia
      : nftMetadata.base_uri
      ? `${nftMetadata.base_uri}/${tokenMedia}`
      : tokenMedia.startsWith("Qm") || tokenMedia.startsWith("ba")
      ? `https://ipfs.near.social/ipfs/${tokenMedia}`
      : tokenMedia;

  if (!tokenMedia && tokenMetadata.reference) {
    const metadataUrl =
      nftMetadata.base_uri === "https://arweave.net" &&
      !tokenMetadata.reference.startsWith("https://")
        ? `${nftMetadata.base_uri}/${tokenMetadata.reference}`
        : tokenMetadata.reference.startsWith("https://") ||
          tokenMetadata.reference.startsWith("http://")
        ? tokenMetadata.reference
        : tokenMetadata.reference.startsWith("ar://")
        ? `https://arweave.net/${tokenMetadata.reference.split("//")[1]}`
        : null;
    if (metadataUrl) {
      const res = await fetch(metadataUrl);
      const json = await res.json();
      imageUrl = json.media;
    }
  }

  return imageUrl;
}

export function wrapImage(url) {
  return url ? `https://i.near.social/large/${url}` : null;
}

export async function internalImageToUrl(env, image) {
  if (image?.url) {
    return image.url;
  } else if (image?.ipfs_cid) {
    return `https://ipfs.near.social/ipfs/${image.ipfs_cid}`;
  } else if (image?.nft) {
    try {
      const { contractId, tokenId } = image.nft;
      const NftKV = env.NftKV;
      const path = tokenId ? `${contractId}/${tokenId}` : contractId;

      let imageUrl = await NftKV.get(path);
      if (!imageUrl) {
        imageUrl = await nftToImageUrl({ contractId, tokenId });
        if (imageUrl) {
          await NftKV.put(path, imageUrl);
        }
      }
      return imageUrl;
    } catch (e) {
      console.log(e);
    }
  }
  return null;
}

export async function imageToUrl(env, image) {
  return wrapImage(await internalImageToUrl(env, image));
}

export const DefaultProfileImage =
  "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm";
