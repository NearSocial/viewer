const accountId = props.accountId ?? context.accountId;
const itemType = props.itemType;
const renderItem = props.renderItem;

if (!itemType) {
  return <p className="text-white">No graph item type passed.</p>;
}

const items = Social.getr(`${accountId}/graph/${itemType}`, "final", {
  withBlockHeight: true,
});

const StorageKey = "order";
const order = Storage.privateGet(StorageKey);
const graphItems = useMemo(() => {
  if (items === null || order === null) {
    return [];
  }
  const itemMap = new Map();
  const path = [];

  const buildSrc = (node) => {
    if (node.hasOwnProperty("")) {
      itemMap.set(path.join("/"), node[":block"]);
    }
    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === "object") {
        path.push(key);
        buildSrc(value);
        path.pop();
      }
    });
  };

  buildSrc(items ?? {}, [], itemMap);
  let entries = [...itemMap.entries()];
  entries.sort((a, b) => b[1] - a[1]);
  entries = entries.map((a) => a[0]);
  entries.sort((a, b) => (order?.[a] || 0) - (order?.[b] || 0));
  Storage.privateSet(
    StorageKey,
    Object.fromEntries(entries.map((a, i) => [a, i + 1])),
  );
  return entries;
}, [items, order]);

let transformedArray = graphItems.map((item) => {
  let splitParts = item.split("/");
  let accountId = splitParts[0];
  let lastPart = splitParts[splitParts.length - 1];
  let blockHeight = isNaN(lastPart) ? null : parseInt(lastPart);

  return { accountId, blockHeight };
});

let filteredArray = transformedArray.filter(
  (item) => item.blockHeight !== null,
);

return (
  <>
    {(filteredArray ?? []).map((item) => renderItem(item))}
    {filteredArray.length === 0 && (
      <p className="fw-bold text-white">No {itemType}s!</p>
    )}
  </>
);
