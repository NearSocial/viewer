import { socialIndex } from "../../common";

const Limit = 50000;

export const generateSitemapPosts = async (env, offset) => {
  const posts = await socialIndex("post", "main", {});
  const urls = posts.map(
    (post) =>
      `  <url>
    <loc>https://nearbuilders.org/mob.near/widget/MainPage.N.Post.Page?accountId=${post.accountId}&amp;blockHeight=${post.blockHeight}</loc>
    <changefreq>monthly</changefreq>
  </url>`
  );
  console.log("urls count", urls.length);
  return urls.slice(offset, offset + Limit).join("\n");
};

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length !== 4) {
    return next();
  }
  const offset = parseInt(parts[3]);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapPosts(env, offset)}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
      },
    }
  );
}
