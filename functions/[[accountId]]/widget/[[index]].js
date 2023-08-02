import { Buffer } from "node:buffer";

class MetaTitleInjector {
  constructor({ title }) {
    this.title = title;
  }

  element(element) {
    element.setAttribute("content", this.title);
  }
}

class MetaImageInjector {
  constructor({ image, authorImage }) {
    this.image = image;
    this.authorImage = authorImage;
  }

  element(element) {
    if (this.image) {
      element.setAttribute("content", this.image);
    } else if (this.authorImage) {
      element.setAttribute("content", this.authorImage);
    }
  }
}

class MetaTwitterCardInjector {
  constructor({ image }) {
    this.image = image;
  }

  element(element) {
    if (!this.image) {
      element.setAttribute("content", "summary");
    }
  }
}

class MetaDescriptionInjector {
  constructor({ shortDescription }) {
    this.shortDescription = shortDescription;
  }

  element(element) {
    element.setAttribute(
      "content",
      this.shortDescription?.replaceAll("\n", " ")
    );
  }
}

class TitleInjector {
  constructor({ title }) {
    this.title = title;
  }

  element(element) {
    element.setInnerContent(this.title);
  }
}

class NoscriptDescriptionInjector {
  constructor({ description }) {
    this.description = description;
  }

  element(element) {
    element.setInnerContent(this.description);
  }
}

function defaultData() {
  const image = "https://near.social/assets/logo.png";
  const title = "Near Social";
  const description = "Social data protocol built on NEAR";
  return {
    image,
    title,
    description,
  };
}

async function socialGet(keys, blockHeight, parse) {
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
  const [token, nftMetadata] = await Promise.all([
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

function wrapImage(url) {
  return url ? `https://i.near.social/large/${url}` : null;
}

async function internalImageToUrl(env, image) {
  if (image?.url) {
    return image.url;
  } else if (image?.ipfs_cid) {
    return `https://ipfs.near.social/ipfs/${image.ipfs_cid}`;
  } else if (image?.nft) {
    try {
      const { contractId, tokenId } = image.nft;
      const NftKV = env.NftKV;

      let imageUrl = await NftKV.get(`${contractId}/${tokenId}`);
      if (!imageUrl) {
        imageUrl = await nftToImageUrl({ contractId, tokenId });
        if (imageUrl) {
          await NftKV.put(`${contractId}/${tokenId}`, imageUrl);
        }
      }
      return imageUrl;
    } catch (e) {
      console.log(e);
    }
  }
  return null;
}

async function imageToUrl(env, image) {
  return wrapImage(await internalImageToUrl(env, image));
}

async function postData(env, url, data, isPost) {
  const accountId = url.searchParams.get("accountId");
  const blockHeight = url.searchParams.get("blockHeight");
  const [content, name, authorImage] = await Promise.all([
    socialGet(
      `${accountId}/post/${isPost ? "main" : "comment"}`,
      blockHeight,
      true
    ),
    socialGet(`${accountId}/profile/name`),
    socialGet(`${accountId}/profile/image/**`),
  ]);

  data.raw = content;
  data.description = content?.text || "";
  data.image = await imageToUrl(env, content?.image);
  if (!data.image) {
    data.authorImage = await imageToUrl(env, authorImage);
  }
  data.title = isPost
    ? `Post by ${name ?? accountId} | Near Social`
    : `Comment by ${name ?? accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function profileData(env, url, data) {
  const accountId = url.searchParams.get("accountId");
  const profile = await socialGet(`${accountId}/profile/**`);

  const name = profile?.name;
  data.raw = profile;
  data.description = profile?.description || "";
  data.image = await imageToUrl(env, profile?.image);
  data.authorImage =
    data.image ||
    wrapImage(
      "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm"
    );
  data.title = name
    ? `${name} (${accountId}) | Near Social`
    : `${accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function widgetData(env, url, data) {
  const parts = url.pathname.split("/");
  const accountId = parts[1];
  const widgetId = parts[3];
  const metadata = await socialGet(
    `${accountId}/widget/${widgetId}/metadata/**`
  );

  const name = metadata?.name || widgetId;
  data.raw = metadata;
  data.description = metadata?.description || "";
  data.image = await imageToUrl(env, metadata?.image);
  data.title = `${name} by ${accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function generateData(env, url) {
  const data = defaultData();
  try {
    if (url.pathname === "/mob.near/widget/MainPage.Post.Page") {
      await postData(env, url, data, true);
    } else if (url.pathname === "/mob.near/widget/MainPage.Comment.Page") {
      await postData(env, url, data, false);
    } else if (url.pathname === "/mob.near/widget/ProfilePage") {
      await profileData(env, url, data);
    } else {
      await widgetData(env, url, data);
    }
  } catch (e) {
    console.error(e);
  }
  data.shortDescription = data.description.slice(0, 250);

  return data;
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (url.pathname.split("/").length < 4) {
    return next();
  }
  const data = await generateData(env, url);
  return (
    new HTMLRewriter()
      .on('meta[property="og:title"]', new MetaTitleInjector(data))
      .on('meta[property="og:image"]', new MetaImageInjector(data))
      .on('meta[name="twitter:card"]', new MetaTwitterCardInjector(data))
      .on('meta[property="og:description"]', new MetaDescriptionInjector(data))
      .on('meta[name="description"]', new MetaDescriptionInjector(data))
      // .on("head", new MetaTagInjector(data))
      .on("title", new TitleInjector(data))
      .on("noscript", new NoscriptDescriptionInjector(data))
      .transform(await next())
  );
}
