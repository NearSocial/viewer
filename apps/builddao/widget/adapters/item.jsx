/**
 * generalized graph item fetcher,
 * Social adapter (getr(`${accountId}/graph/${item}`, "final")
 */

const accountId = props.accountId ?? context.accountId;
const item = props.item;
const renderItem = props.renderItem;

if (!item) {
  return <p className="text-white">No item prop passed</p>;
}

const items = Social.getr(`${accountId}/graph/${item}`, "final", {
  withBlockHeight: true,
});

const StorageKey = "order";
const order = Storage.privateGet(StorageKey);
const apps = useMemo(() => {
  if (items === null || order === null) {
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

  buildSrc(items ?? {}, [], starredApps);
  let apps = [...starredApps.entries()];
  apps.sort((a, b) => b[1] - a[1]);
  apps = apps.map((a) => a[0]);
  apps.sort((a, b) => (order?.[a] || 0) - (order?.[b] || 0));
  Storage.privateSet(
    StorageKey,
    Object.fromEntries(apps.map((a, i) => [a, i + 1]))
  );
  return apps;
}, [items, order]);

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
    {(filteredArray ?? []).map((item) => renderItem(item))}
    {filteredArray.length === 0 && (
      <p className="fw-bold text-white">No items!</p>
    )}
  </>
);
