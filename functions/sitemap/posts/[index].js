import { socialIndex } from "../../common";

const Limit = 50000;

export const generateSitemapPosts = async (env, offset) => {
  const posts = await socialIndex("post", "main", {
    from: offset,
    limit: Limit,
  });
  return posts
    .map(
      (post) =>
        `  <url>
    <loc>https://near.social/mob.near/widget/MainPage.Post.Page?accountId=${post.accountId}&blockHeight=${post.blockHeight}</loc>
    <changefreq>never</changefreq>
  </url>`
    )
    .join("\n");
};

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length !== 4) {
    return next();
  }
  const offset = parseInt(parts[3]);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapPosts(env, offset)}
</urlset>`);
}
