import { socialKeys } from "../../common";

export const generateSitemapProfiles = async (env) => {
  const data = await socialKeys("*/profile");
  const accountIds = Object.keys(data);
  return accountIds
    .map(
      (accountId) =>
        `  <url>
    <loc>https://nearbuilders.org/mob.near/widget/ProfilePage?accountId=${accountId}</loc>
    <changefreq>monthly</changefreq>
  </url>`
    )
    .join("\n");
};

export async function onRequest({ env }) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapProfiles(env)}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
      },
    }
  );
}
