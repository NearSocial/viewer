import { socialKeys } from "../../common";

const MinBlockHeight = 75942518;

export const generateSitemapSources = async (env) => {
  const data = await socialKeys("*/widget/*", null, {
    return_type: "History",
  });
  return Object.entries(data)
    .map(([accountId, widget]) =>
      Object.entries(widget.widget)
        .map(([widgetId, blockHeights]) =>
          blockHeights
            .filter((blockHeight) => blockHeight >= MinBlockHeight)
            .map(
              (blockHeight) =>
                `  <url>
    <loc>https://near.social/mob.near/widget/WidgetSource?src=${accountId}/widget/${widgetId}&amp;blockHeight=${blockHeight}</loc>
    <changefreq>never</changefreq>
  </url>`
            )
        )
        .flat()
    )
    .flat()
    .join("\n");
};

export async function onRequest({ env }) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapSources(env)}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
      },
    }
  );
}
