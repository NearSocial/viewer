/**
 * This would be nice to be in the DAO SDK
 */
let daos;

const apikey = "c5d70a09-5740-489d-8c3b-36fbc3d40bff";

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

daos = fetch(forgeUrl(`https://api.pikespeak.ai/daos/all`, {}), {
  mode: "cors",
  headers: {
    "x-api-key": apikey,
    "cache-control": "max-age=86400", // 1 day
  },
});
if (daos === null) return "";
daos = daos?.body;

return { type: "daos", daos };
