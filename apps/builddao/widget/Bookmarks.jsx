const { Post } = VM.require("buildhub.near/widget/components") || (() => <></>);

const accountId = props.accountId ?? context.accountId;

const bookmarks = Social.getr(`${accountId}/graph/bookmark`, "final", {
  withBlockHeight: true,
});

const StorageKey = "order";
const order = Storage.privateGet(StorageKey);
const apps = useMemo(() => {
  if (bookmarks === null || order === null) {
    return [];
  }
  const starredApps = new Map();
  const path = [];

  const buildSrc = (node) => {
    if (node.hasOwnProperty("")) {
      starredApps.set(path.join("/"), node[":block"]);
    }
    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === "object") {
        path.push(key);
        buildSrc(value);
        path.pop();
      }
    });
  };

  buildSrc(bookmarks ?? {}, [], starredApps);
  let apps = [...starredApps.entries()];
  apps.sort((a, b) => b[1] - a[1]);
  apps = apps.map((a) => a[0]);
  apps.sort((a, b) => (order?.[a] || 0) - (order?.[b] || 0));
  Storage.privateSet(
    StorageKey,
    Object.fromEntries(apps.map((a, i) => [a, i + 1]))
  );
  return apps;
}, [bookmarks, order]);

let transformedArray = apps.map((item) => {
  let splitParts = item.split("/");
  let accountId = splitParts[0];
  let lastPart = splitParts[splitParts.length - 1];
  let blockHeight = isNaN(lastPart) ? null : parseInt(lastPart);

  return { accountId, blockHeight };
});

let filteredArray = transformedArray.filter(
  (item) => item.blockHeight !== null
);

return (
  <>
    {(filteredArray ?? []).map((item) => (
      <Post
        accountId={item.accountId}
        blockHeight={item.blockHeight}
        noBorder={true}
        hideComments={true}
      />
    ))}
    {filteredArray.length === 0 && (
      <p className="fw-bold text-white">No Bookmarks Yet!</p>
    )}
  </>
);
