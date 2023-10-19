import { socialKeys } from "../../common";

export const generateSitemapWidgets = async (env) => {
  const data = await socialKeys("*/widget/*/metadata");
  return Object.entries(data)
    .map(([accountId, widget]) =>
      Object.keys(widget.widget).map(
        (widgetId) =>
          `  <url>
    <loc>https://nearbuilders.org/${accountId}/widget/${widgetId}</loc>
    <changefreq>monthly</changefreq>
  </url>`
      )
    )
    .flat()
    .join("\n");
};

export async function onRequest({ env }) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await generateSitemapWidgets(env)}
</urlset>`,
    {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
      },
    }
  );
}
