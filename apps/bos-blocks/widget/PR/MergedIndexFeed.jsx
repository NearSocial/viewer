if (!props.index) {
  return "props.index is not defined";
}
const indices = JSON.parse(
  JSON.stringify(Array.isArray(props.index) ? props.index : [props.index])
);

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

const mergeItems = (iIndex, oldItems, newItems, desc) => {
  const index = indices[iIndex];
  const items = [
    ...new Set(
      [
        ...newItems.map((item) => ({
          ...item,
          action: index.action,
          key: index.key,
          index: iIndex,
        })),
        ...oldItems,
      ].map((i) => JSON.stringify(i))
    ),
  ].map((i) => JSON.parse(i));
  items.sort((a, b) => a.blockHeight - b.blockHeight);
  if (desc) {
    items.reverse();
  }
  return items;
};

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
  filteredItems.push(bestItem);
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