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

function imageToUrl(image) {
  if (image?.url) {
    return `https://i.near.social/large/${image.url}`;
  }
  // TODO: Add NFT image support
  return null;
}

async function postData(url, parts, data) {
  const accountId = url.searchParams.get("accountId");
  const blockHeight = url.searchParams.get("blockHeight");
  const [content, name, authorImage] = await Promise.all([
    socialGet(`${accountId}/post/main`, blockHeight, true),
    socialGet(`${accountId}/profile/name`),
    socialGet(`${accountId}/profile/image/**`),
  ]);

  data.raw = content;
  data.description = content?.text || "";
  data.image = imageToUrl(content?.image);
  data.authorImage = imageToUrl(authorImage);
  data.title = `Post by ${name} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function generateData(url) {
  const data = defaultData();
  const parts = url.pathname.split("/");
  try {
    if (url.pathname === "/mob.near/widget/MainPage.Post.Page") {
      await postData(url, parts, data);
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
