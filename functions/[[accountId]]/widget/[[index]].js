import {
  socialGet,
  imageToUrl,
  wrapImage,
  DefaultProfileImage,
} from "../../common";

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
  const image = "https://nearbuilders.org/assets/logo.png";
  const title = "Build DAO";
  const description =
    "Support Systems for Open Web Developers";
  return {
    image,
    title,
    description,
  };
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
  data.description =
    profile?.description || `Profile of ${accountId} on Near Social`;
  data.image = await imageToUrl(env, profile?.image);
  data.authorImage = data.image || wrapImage(DefaultProfileImage);
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
  data.description =
    metadata?.description || `Component ${name} created by ${accountId}`;
  data.image = await imageToUrl(env, metadata?.image);
  data.title = `${name} by ${accountId} | Near Social`;
  data.accountName = name;
  data.accountId = accountId;
}

async function sourceData(env, url, data) {
  const key = url.searchParams.get("src");
  const parts = key.split("/");
  const accountId = parts[0];
  const blockHeight = url.searchParams.get("blockHeight");
  const [source, image] = await Promise.all([
    socialGet(key, blockHeight),
    socialGet(`${key}/metadata/image/**`),
  ]);

  data.raw = source;
  data.description = source || "The source code is not available.";
  data.image = null;
  data.authorImage = await imageToUrl(env, image);
  data.title = `Source code of ${key} at block height ${blockHeight} | Near Social`;
  data.accountId = accountId;
}

async function generateData(env, url) {
  const data = defaultData();
  try {
    if (
      url.pathname === "/mob.near/widget/MainPage.Post.Page" ||
      url.pathname === "/mob.near/widget/MainPage.N.Post.Page" ||
      url.pathname === "/near/widget/PostPage"
    ) {
      await postData(env, url, data, true);
    } else if (
      url.pathname === "/mob.near/widget/MainPage.Comment.Page" ||
      url.pathname === "/mob.near/widget/MainPage.N.Comment.Page"
    ) {
      await postData(env, url, data, false);
    } else if (url.pathname === "/mob.near/widget/ProfilePage") {
      await profileData(env, url, data);
    } else if (url.pathname === "/mob.near/widget/WidgetSource") {
      await sourceData(env, url, data);
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
  if (
    url.pathname.split("/").length < 4 ||
    url.pathname.endsWith(".bundle.js")
  ) {
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
