import { internalImageToUrl } from "../../../common";

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length !== 5 && parts.length !== 6) {
    return next();
  }
  const contractId = parts[4];
  const tokenId = parts[5];

  const destinationURL = await internalImageToUrl(env, {
    nft: {
      contractId,
      tokenId,
    },
  });

  return destinationURL
    ? new Response(destinationURL, {
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      })
    : new Response(null, {
        status: 404,
      });
}
