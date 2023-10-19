import { socialKeys } from "../../common";

const MinBlockHeight = 75942518;
const LIMIT = 50000;

export const generateSitemapSources = async (env, offset) => {
  const data = await socialKeys("*/widget/*", null, {
    return_type: "History",
  });
  const urls = Object.entries(data)
    .map(([accountId, widget]) =>
      Object.entries(widget.widget)
        .map(([widgetId, blockHeights]) =>
          blockHeights
            .filter((blockHeight) => blockHeight >= MinBlockHeight)
            .map(
              (blockHeight) =>
                `  <url>
    <loc>https://nearbuilders.org/mob.near/widget/WidgetSource?src=${accountId}/widget/${widgetId}&amp;blockHeight=${blockHeight}</loc>
    <changefreq>never</changefreq>
  </url>`
            )
        )
        .flat()
    )
    .flat();
  console.log("urls count", urls.length);
  return urls.slice(offset, offset + LIMIT).join("\n");
};

export async function onRequest({ env, request, next }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length !== 4) {
    return next();
  }
  const offset = parseInt(parts[3]);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapSources(env, offset)}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
      },
    }
  );
}
