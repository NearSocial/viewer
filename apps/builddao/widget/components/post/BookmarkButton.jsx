const item = props.item;

if (!item) {
  return "";
}

useEffect(() => {
  State.update({ hasBookmark: null });
}, [item]);

const bookmarks = Social.index("bookmark", item);

const dataLoading = bookmarks === null;

const bookmarksByUser = {};

(bookmarks || []).forEach((bookmark) => {
  if (bookmark.value.type === "bookmark") {
    bookmarksByUser[bookmark.accountId] = bookmark;
  } else if (bookmark.value.type === "unbookmark") {
    delete bookmarksByUser[bookmark.accountId];
  }
});

if (state.hasBookmark === true) {
  bookmarksByUser[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasBookmark === false) {
  delete bookmarksByUser[context.accountId];
}

const accountsWithBookmarks = Object.keys(bookmarksByUser);
const bookmarkCount = accountsWithBookmarks.length;
const hasBookmark = context.accountId && !!bookmarksByUser[context.accountId];

const bookmarkSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-bookmark"
    viewBox="0 0 16 16"
  >
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
  </svg>
);

const bookmarkFillSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-bookmark-fill"
    viewBox="0 0 16 16"
  >
    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
  </svg>
);

const BookmarkButton = styled.div`
  line-height: 20px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: left;
  background: inherit;
  color: inherit;
  font-size: 16px;
  .icon {
    position: relative;
    &:before {
      margin: -8px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  .count {
    margin-left: 8px;
  }

  &:not([disabled]) {
    cursor: pointer;
  }

  &:not([disabled]):hover {
    opacity: 1 !important;
    color: #ffaf51;

    .icon:before {
      background: rgba(255, 175, 81, 0.1);
    }
  }
  .bookmarked {
    color: #ffaf51;
  }

  .loading {
    @keyframes scaleAnimation {
      0%,
      100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.2) rotate(-15deg);
      }
      50% {
        transform: scale(1) rotate(0deg);
      }
      75% {
        transform: scale(1.2) rotate(15deg);
      }
    }

    transform-origin: center;
    animation: scaleAnimation 1s ease-in-out infinite;
  }
`;

const bookmarkClick = () => {
  if (state.loading || dataLoading || !context.accountId) {
    return;
  }
  State.update({
    loading: true,
  });
  const type = hasBookmark ? "unbookmark" : "bookmark";
  const data = {
    index: {
      bookmark: JSON.stringify({
        key: item,
        value: {
          type,
        },
      }),
    },
  };

  if (item.type === "social" && typeof item.path === "string") {
    const keys = item.path.split("/");
    keys.push(item.blockHeight);
    if (keys.length > 0) {
      data.graph = {
        bookmark: {},
      };
      let root = data.graph.bookmark;
      keys.slice(0, -1).forEach((key) => {
        root = root[key] = {};
      });
      root[keys[keys.length - 1]] = hasBookmark ? null : "";
    }
  }

  if (!hasBookmark && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type,
        item,
      },
    });
  }

  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasBookmark: !hasBookmark }),
    onCancel: () => State.update({ loading: false }),
  });
};

const title = hasBookmark
  ? props.titleUnbookmark ?? "Unbookmark"
  : props.titleBookmark ?? "Bookmark";

const inner = (
  <div className="d-inline-flex align-items-center">
    <BookmarkButton
      disabled={state.loading || dataLoading || !context.accountId}
      title={!props.tooltip ? title : undefined}
      onClick={bookmarkClick}
    >
      <span
        className={`icon ${state.loading ? "loading " : ""}${
          hasBookmark ? "bookmarked" : ""
        }`}
      >
        {hasBookmark ? bookmarkFillSvg : bookmarkSvg}
      </span>
      {bookmarkCount > 0 && (
        <span className={`count ${hasBookmark ? "bookmarked" : ""}`}>
          <Widget
            loading={bookmarkCount || ""}
            src="mob.near/widget/N.Overlay.Faces"
            props={{ accounts: bookmarksByUser, limit: 10 }}
          />
        </span>
      )}
    </BookmarkButton>
  </div>
);

return props.tooltip ? (
  <OverlayTrigger
    placement={props.overlayPlacement ?? "auto"}
    overlay={<Tooltip>{title}</Tooltip>}
  >
    {inner}
  </OverlayTrigger>
) : (
  inner
);
