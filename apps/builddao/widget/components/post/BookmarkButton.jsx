const item = props.item;

if (!item) {
  return "";
}

useEffect(() => {
  State.update({ hasBookmark: null });
}, [item]);

const bookmarks = Social.index("bookmark", item);

const dataLoading = bookmarks === null;

const bookmarksByUsers = {};

(bookmarks || []).forEach((bookmark) => {
  if (bookmark.value.type === "bookmark") {
    bookmarksByUsers[bookmark.accountId] = bookmark;
  } else if (bookmark.value.type === "unbookmark") {
    delete bookmarksByUsers[bookmark.accountId];
  }
});
if (state.hasBookmark === true) {
  bookmarksByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasBookmark === false) {
  delete bookmarksByUsers[context.accountId];
}

const accountsWithBookmarks = Object.keys(bookmarksByUsers);
const likeCount = accountsWithBookmarks.length;
const hasBookmark = context.accountId && !!bookmarksByUsers[context.accountId];

const bookmarkSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16671 1.66667H15.8334C16.2936 1.66667 16.6667 2.03977 16.6667 2.50001V18.4528C16.6667 18.6828 16.4801 18.8695 16.25 18.8695C16.1718 18.8695 16.095 18.8473 16.0287 18.8058L10 15.0261L3.97137 18.8058C3.7764 18.928 3.51926 18.8691 3.39702 18.6741C3.35543 18.6078 3.33337 18.5311 3.33337 18.4528V2.50001C3.33337 2.03977 3.70647 1.66667 4.16671 1.66667ZM15 3.33334H5.00004V16.1937L10 13.0589L15 16.1937V3.33334Z"
      fill="currentColor"
    />
  </svg>
);

const bookmarkFillSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="#FFAF51"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16671 1.66675H15.8334C16.2936 1.66675 16.6667 2.03985 16.6667 2.50008V18.4528C16.6667 18.6829 16.4801 18.8696 16.25 18.8696C16.1718 18.8696 16.095 18.8474 16.0287 18.8058L10 15.0262L3.97137 18.8058C3.7764 18.9281 3.51926 18.8692 3.39702 18.6742C3.35543 18.6078 3.33337 18.5312 3.33337 18.4528V2.50008C3.33337 2.03985 3.70647 1.66675 4.16671 1.66675ZM15 3.33341H5.00004V16.1937L10 13.059L15 16.1937V3.33341Z"
      fill="#FFAF51"
    />
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

const likeClick = () => {
  if (state.loading || dataLoading || !context.accountId) {
    return;
  }
  State.update({
    loading: true,
  });
  const data = {
    index: {
      bookmark: JSON.stringify({
        key: item,
        value: {
          type: hasBookmark ? "unbookmark" : "bookmark",
        },
      }),
    },
  };

  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasBookmark: !hasBookmark }),
    onCancel: () => State.update({ loading: false }),
  });
};

const title = hasBookmark ? "Unbookmark" : "Bookmark";

return (
  <div className="d-inline-flex align-items-center">
    <BookmarkButton
      disabled={state.loading || dataLoading || !context.accountId}
      title={title}
      onClick={likeClick}
    >
      <span
        className={`icon ${state.loading ? "loading " : ""}${
          hasBookmark ? "bookmarked" : ""
        }`}
      >
        {hasBookmark ? bookmarkFillSvg : bookmarkSvg}
      </span>
    </BookmarkButton>
  </div>
);
