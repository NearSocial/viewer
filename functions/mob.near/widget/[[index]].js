class MetaTitleInjector {
  constructor({ title }) {
    this.title = title;
  }

  element(element) {
    element.setAttribute("content", this.title);
  }
}

class MetaImageInjector {
  constructor({ image }) {
    this.image = image;
  }

  element(element) {
    if (this.image) {
      element.setAttribute("content", this.image);
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

function wrapImage(url) {
  return url ? `https://i.near.social/large/${url}` : null;
}

async function internalImageToUrl(image) {
  if (image?.url) {
    return image.url;
  } else if (image?.ipfs_cid) {
    return `https://ipfs.near.social/ipfs/${image.ipfs_cid}`;
  } else if (image?.nft) {
    try {
      const { contractId, tokenId } = image.nft;
      const request = await fetch(
        `https://near.social/magic/nft/${contractId}/${tokenId}`
      );
      return request.text();
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function imageToUrl(image) {
  return wrapImage(await internalImageToUrl(image));
}

async function postData(url, parts, data, isPost) {
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
  data.image = await imageToUrl(content?.image);
  if (!data.image) {
    data.authorImage = await imageToUrl(authorImage);
  }
  data.title = isPost
    ? `Post by ${name ?? accountId} | Near Social`
    : `Comment by ${name ?? accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function profileData(url, parts, data) {
  const accountId = url.searchParams.get("accountId");
  const profile = await socialGet(`${accountId}/profile/**`);

  const name = profile?.name;
  data.raw = profile;
  data.description = profile?.description || "";
  data.image = await imageToUrl(profile?.image);
  data.authorImage = data.image;
  data.title = name
    ? `${name} (${accountId}) | Near Social`
    : `${accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function generateData(url) {
  const data = defaultData();
  const parts = url.pathname.split("/");
  try {
    if (url.pathname === "/mob.near/widget/MainPage.Post.Page") {
      await postData(url, parts, data, true);
    } else if (url.pathname === "/mob.near/widget/MainPage.Comment.Page") {
      await postData(url, parts, data, false);
    } else if (url.pathname === "/mob.near/widget/ProfilePage") {
      await profileData(url, parts, data);
    }
  } catch (e) {
    console.error(e);
  }
  data.shortDescription = data.description.slice(0, 250);

  return data;
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.pathname.split("/").length < 4) {
    return next();
  }
  const data = await generateData(url);
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
