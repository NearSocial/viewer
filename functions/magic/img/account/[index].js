import {
  DefaultProfileImage,
  internalImageToUrl,
  socialGet,
} from "../../../common";

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  if (parts.length !== 5) {
    return next();
  }
  const accountId = parts[4];
  const image = await socialGet(`${accountId}/profile/image/**`);

  const destinationURL = await internalImageToUrl(env, image);

  if (!destinationURL) {
    // return status 203, which means "non-authoritative information"
    return new Response(DefaultProfileImage, {
      status: 203,
    });
  }

  return new Response(destinationURL, {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
    },
  });
}
