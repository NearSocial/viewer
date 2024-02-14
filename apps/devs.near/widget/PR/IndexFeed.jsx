const index = JSON.parse(JSON.stringify(props.index));
if (!index) {
  return "props.index is not defined";
}

const filter = props.filter;

const renderItem =
  props.renderItem ??
  ((item, i) => (
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

index.options = index.options || {};
const initialRenderLimit =
  props.initialRenderLimit ?? index.options.limit ?? 10;
const addDisplayCount = props.nextLimit ?? initialRenderLimit;

index.options.limit = Math.min(
  Math.max(initialRenderLimit + addDisplayCount * 2, index.options.limit ?? 0),
  100
);
const reverse = !!props.reverse;

const initialItems = Social.index(index.action, index.key, index.options);
if (initialItems === null) {
  return "";
}

const computeFetchFrom = (items, limit) => {
  if (!items || items.length < limit) {
    return false;
  }
  const blockHeight = items[items.length - 1].blockHeight;
  return index.options.order === "desc" ? blockHeight - 1 : blockHeight + 1;
};

const mergeItems = (newItems) => {
  const items = [
    ...new Set([...newItems, ...state.items].map((i) => JSON.stringify(i))),
  ].map((i) => JSON.parse(i));
  items.sort((a, b) => a.blockHeight - b.blockHeight);
  if (index.options.order === "desc") {
    items.reverse();
  }
  return items;
};

const jInitialItems = JSON.stringify(initialItems);
if (state.jInitialItems !== jInitialItems) {
  const jIndex = JSON.stringify(index);
  const nextFetchFrom = computeFetchFrom(initialItems, index.options.limit);
  if (jIndex !== state.jIndex || nextFetchFrom !== state.initialNextFetchFrom) {
    State.update({
      jIndex,
      jInitialItems,
      items: initialItems,
      fetchFrom: false,
      initialNextFetchFrom: nextFetchFrom,
      nextFetchFrom,
      displayCount: initialRenderLimit,
      cachedItems: {},
    });
  } else {
    State.update({
      jInitialItems,
      items: mergeItems(initialItems),
    });
  }
}

if (state.fetchFrom) {
  const limit = addDisplayCount;
  const newItems = Social.index(
    index.action,
    index.key,
    Object.assign({}, index.options, {
      from: state.fetchFrom,
      subscribe: undefined,
      limit,
    })
  );
  if (newItems !== null) {
    State.update({
      items: mergeItems(newItems),
      fetchFrom: false,
      nextFetchFrom: computeFetchFrom(newItems, limit),
    });
  }
}

const filteredItems = state.items;
if (filter) {
  if (filter.ignore) {
    filteredItems = filteredItems.filter(
      (item) => !(item.accountId in filter.ignore)
    );
  }
}

const maybeFetchMore = () => {
  if (
    filteredItems.length - state.displayCount < addDisplayCount * 2 &&
    !state.fetchFrom &&
    state.nextFetchFrom &&
    state.nextFetchFrom !== state.fetchFrom
  ) {
    State.update({
      fetchFrom: state.nextFetchFrom,
    });
  }
};

maybeFetchMore();

const makeMoreItems = () => {
  State.update({
    displayCount: state.displayCount + addDisplayCount,
  });
  maybeFetchMore();
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
  !props.hideFetchMore &&
  (state.fetchFrom && filteredItems.length < state.displayCount
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
    hasMore={state.displayCount < filteredItems.length}
    loader={
      <div className="loader">
        <span
          className="spinner-grow spinner-grow-sm me-1"
          role="status"
          aria-hidden="true"
        />
        Loading ...
      </div>
    }
  >
    {props.headerElement}
    {Layout ? <Layout>{renderedItems}</Layout> : <>{renderedItems}</>}
    {props.footerElement}
  </InfiniteScroll>
);