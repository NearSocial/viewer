if (!props.index) {
  return "props.index is not defined";
}
const indices = JSON.parse(
  JSON.stringify(Array.isArray(props.index) ? props.index : [props.index])
);
const requiredIndices = indices.filter((index) => index.required);

const filter = props.filter;

const renderItem =
  props.renderItem ??
  ((item) => (
    <div key={JSON.stringify(item)}>
      #{item.blockHeight}: {JSON.stringify(item)}
    </div>
  ));
const cachedRenderItem = (item, i) => {
  const key = JSON.stringify(item);

  if (!(key in state.cachedItems)) {
    state.cachedItems[key] = renderItem(item, i);
    State.update();
  }
  return state.cachedItems[key];
};

const initialRenderLimit = props.initialRenderLimit ?? 10;
const addDisplayCount = props.nextLimit ?? initialRenderLimit;
const reverse = !!props.reverse;

const computeFetchFrom = (items, limit, desc) => {
  if (!items || items.length < limit) {
    return false;
  }
  const blockHeight = items[items.length - 1].blockHeight;
  return desc ? blockHeight - 1 : blockHeight + 1;
};

function mergeItems(iIndex, oldItems, newItems, desc) {
  const itemMap = new Map();

  const generateKey = (item) => ({
    accountId: item.accountId,
    blockHeight: item.blockHeight,
  });

  // Add old items to the map
  oldItems.forEach((item) => {
    const key = generateKey(item);
    itemMap.set(key, item);
  });

  newItems.forEach((item) => {
    const key = generateKey(item);
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        ...item,
        index: iIndex,
      });
    }
  });

  // Convert the Map values to an array
  let mergedItems = Array.from(itemMap.values());

  // Sort items by blockHeight, ascending or descending based on the `desc` flag
  mergedItems.sort((a, b) =>
    desc ? b.blockHeight - a.blockHeight : a.blockHeight - b.blockHeight
  );

  return mergedItems;
}

const jIndices = JSON.stringify(indices);
if (jIndices !== state.jIndices) {
  State.update({
    jIndices,
    feeds: indices.map(() => ({})),
    items: [],
    displayCount: initialRenderLimit,
    cachedItems: {},
  });
}

let stateChanged = false;
for (let iIndex = 0; iIndex < indices.length; ++iIndex) {
  const index = indices[iIndex];
  const feed = state.feeds[iIndex];
  let feedChanged = false;
  index.options = index.options || {};
  index.options.limit = Math.min(
    Math.max(initialRenderLimit + addDisplayCount * 2, index.options.limit),
    100
  );
  const desc = index.options.order === "desc";

  const initialItems = Social.index(
    index.action,
    index.key,
    index.options,
    index.cacheOptions
  );
  if (initialItems === null) {
    continue;
  }

  const jInitialItems = JSON.stringify(initialItems);
  const nextFetchFrom = computeFetchFrom(
    initialItems,
    index.options.limit,
    desc
  );
  if (feed.jInitialItems !== jInitialItems) {
    feed.jInitialItems = jInitialItems;
    feedChanged = true;
    if (nextFetchFrom !== feed.initialNextFetchFrom) {
      feed.fetchFrom = false;
      feed.items = mergeItems(iIndex, [], initialItems, desc);
      feed.initialNextFetchFrom = nextFetchFrom;
      feed.nextFetchFrom = nextFetchFrom;
    } else {
      feed.items = mergeItems(iIndex, feed.items, initialItems, desc);
    }
  }

  feed.usedCount = 0;

  if (feedChanged) {
    state.feeds[iIndex] = feed;
    stateChanged = true;
  }
}

let itemsByRequiredIndex = [];
let commonUniqueIdentifiers = [];

// If there are required indices, filter mergedItems to include only items that appear in all required feeds
if (requiredIndices.length > 0) {
  for (let iIndex = 0; iIndex < indices.length; ++iIndex) {
    const index = indices[iIndex];
    if (index.required) {
      const feed = state.feeds[iIndex];
      if (!feed.items) {
        continue;
      } else {
        itemsByRequiredIndex.push(
          feed.items.map((item) =>
            JSON.stringify({
              blockHeight: item.blockHeight,
              accountId: item.accountId,
            })
          )
        );
      }
    } else {
      continue;
    }
  }
  // Compute the intersection of uniqueIdentifiers across all required indices
  commonUniqueIdentifiers =
    itemsByRequiredIndex.length &&
    itemsByRequiredIndex.reduce((a, b) => a.filter((c) => b.includes(c)));
}

// Construct merged feed and compute usage per feed.

const filteredItems = [];
while (filteredItems.length < state.displayCount) {
  let bestItem = null;
  for (let iIndex = 0; iIndex < indices.length; ++iIndex) {
    const index = indices[iIndex];
    const feed = state.feeds[iIndex];
    const desc = index.options.order === "desc";
    if (!feed.items) {
      continue;
    }
    const item = feed.items[feed.usedCount];
    if (!item) {
      continue;
    }
    if (
      bestItem === null ||
      (desc
        ? item.blockHeight > bestItem.blockHeight
        : item.blockHeight < bestItem.blockHeight)
    ) {
      bestItem = item;
    }
  }
  if (!bestItem) {
    break;
  }
  state.feeds[bestItem.index].usedCount++;
  if (filter) {
    if (filter.ignore) {
      if (bestItem.accountId in filter.ignore) {
        continue;
      }
    }
  }

  if (requiredIndices.length > 0) {
    const uniqueIdentifier = JSON.stringify({
      blockHeight: bestItem.blockHeight,
      accountId: bestItem.accountId,
    });

    if (!commonUniqueIdentifiers.includes(uniqueIdentifier)) {
      continue;
    }
  }
  // remove duplicate posts
  const existingItemIndex = filteredItems.findIndex(
    (item) =>
      item.blockHeight === bestItem.blockHeight &&
      item.accountId === bestItem.accountId
  );

  if (existingItemIndex === -1) {
    filteredItems.push(bestItem);
  }
}

// Fetch new items for feeds that don't have enough items.
for (let iIndex = 0; iIndex < indices.length; ++iIndex) {
  const index = indices[iIndex];
  const feed = state.feeds[iIndex];
  const desc = index.options.order === "desc";
  let feedChanged = false;

  if (
    (feed.items.length || 0) - feed.usedCount < addDisplayCount * 2 &&
    !feed.fetchFrom &&
    feed.nextFetchFrom &&
    feed.nextFetchFrom !== feed.fetchFrom
  ) {
    feed.fetchFrom = feed.nextFetchFrom;
    feedChanged = true;
  }

  if (feed.fetchFrom) {
    const limit = addDisplayCount;
    const newItems = Social.index(
      index.action,
      index.key,
      Object.assign({}, index.options, {
        from: feed.fetchFrom,
        subscribe: undefined,
        limit,
      })
    );
    if (newItems !== null) {
      feed.items = mergeItems(iIndex, feed.items, newItems, desc);
      feed.fetchFrom = false;
      feed.nextFetchFrom = computeFetchFrom(newItems, limit, desc);
      feedChanged = true;
    }
  }

  if (feedChanged) {
    state.feeds[iIndex] = feed;
    stateChanged = true;
  }
}

if (stateChanged) {
  State.update();
}

const makeMoreItems = () => {
  State.update({
    displayCount: state.displayCount + addDisplayCount,
  });
};

const loader = (
  <div className="loader" key={"loader"}>
    <span
      className="spinner-grow spinner-grow-sm me-1"
      role="status"
      aria-hidden="true"
    />
    Loading ...
  </div>
);

const fetchMore =
  props.manual &&
  (state.feeds.some((f) => !!f.fetchFrom) &&
  filteredItems.length < state.displayCount
    ? loader
    : state.displayCount < filteredItems.length && (
        <div key={"loader more"}>
          <a href="javascript:void" onClick={(e) => makeMoreItems()}>
            {props.loadMoreText ?? "Load more..."}
          </a>
        </div>
      ));

const items = filteredItems ? filteredItems.slice(0, state.displayCount) : [];
if (reverse) {
  items.reverse();
}

const renderedItems = items.map(cachedRenderItem);
const Layout = props.Layout;

return props.manual ? (
  <>
    {reverse && fetchMore}
    {renderedItems}
    {!reverse && fetchMore}
  </>
) : (
  <InfiniteScroll
    pageStart={0}
    loadMore={makeMoreItems}
    hasMore={state.displayCount <= filteredItems.length}
    loader={loader}
  >
    {Layout ? <Layout>{renderedItems}</Layout> : <>{renderedItems}</>}
  </InfiniteScroll>
);
