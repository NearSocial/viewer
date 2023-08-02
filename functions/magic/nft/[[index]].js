import { Buffer } from "node:buffer";

async function viewCall({ contractId, method, args }) {
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

async function nftToImageUrl({ contractId, tokenId }) {
  const [tokenMetadata, nftMetadata] = await Promise.all([
    viewCall({
      contractId,
      method: "nft_token",
      args: { token_id: tokenId },
    }),
    viewCall({
      contractId,
      method: "nft_metadata",
      args: {},
    }),
  ]);

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

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length < 5) {
    throw new Error("Invalid path");
  }
  const contractId = parts[3];
  const tokenId = parts[4];

  const imageUrl = await nftToImageUrl({ contractId, tokenId });

  return new Response(imageUrl);
}
