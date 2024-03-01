const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/comment`, blockHeight) ?? "null");
const parentItem = content.item;
const highlight = !!props.highlight;
const raw = !!props.raw;
const groupId = props.groupId;
const groupIdLinkPart = groupId ? `&groupId=${groupId}` : "";
const permissions = props.permissions;

const extractNotifyAccountId = (item) => {
  if (!item || item.type !== "social" || !item.path) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path ? accountId : undefined;
};

const link = `/mob.near/widget/MainPage.N.Comment.Page?accountId=${accountId}&blockHeight=${blockHeight}${groupIdLinkPart}`;

const item = {
  type: "social",
  path: `${accountId}/post/comment`,
  blockHeight,
};

const StyledPost = styled.div`
  margin-bottom: 1rem;
  .post {
    border-radius: 16px;
    border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
    color: var(--font-muted-color, #b6b6b8);
    padding: 24px !important;
    background-color: var(--post-bg, #23242b);
    transition: all 300ms;

    &:hover {
      background-color: var(--post-bg-hover, #17181c) !important;
      .expand-post {
        background-image: linear-gradient(
          to bottom,
          var(--post-bg-hover-transparent, rgba(23, 24, 28, 0)),
          var(--post-bg-hover, #17181c) 25%
        ) !important;
      }
    }

    .post-header {
      span,
      .text-muted {
        color: var(--font-color, #fff) !important;
      }
    }

    .buttons {
      border-top: 1px solid #3c3d43;
      padding: 0.5rem;
    }

    .expand-post {
      background-image: linear-gradient(
        to bottom,
        var(--post-bg-transparent, rgba(35, 36, 43, 0)),
        var(--post-bg, rgba(35, 36, 43, 1)) 25%
      ) !important;
    }
  }

  .dropdown-menu {
    background-color: var(--post-bg, #000000) !important;
    color: var(--font-color, #fff) !important;

    li.dropdown-item {
      color: var(--font-color, #fff) !important;
      &:hover {
        a {
          color: var(--post-bg, #000000) !important;
        }
      }
    }

    .link-dark,
    .dropdown-item {
      color: var(--font-color, #fff) !important;

      &:hover {
        color: var(--post-bg, #000000) !important;

        span {
          color: var(--post-bg, #000000) !important;
        }
      }
    }
  }

  textarea {
    color: #b6b6b8 !important;
  }
`;

const Wrapper = styled.div`
  margin: 0 -12px;
  line-height: normal;

  .post {
    position: relative;
    padding: 12px;
    padding-bottom: 4px;
    display: flex;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: 16px !important;
    }
    @media (max-width: 767px) {
      font-size: 15px !important;
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: 15px !important;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    strong,
    b {
      font-weight: 500 !important;
    }
    ol,
    ul,
    dl {
      margin-bottom: 0.5rem;
      white-space: inherit;
    }
    p {
      margin-bottom: 0.5rem;
    }
    hr {
      display: none;
    }
    img {
      border-radius: var(--bs-border-radius-lg);
      max-height: 40em;
    }
    th {
      min-width: 5em;
    }

    .table > :not(caption) > * > * {
      padding: 0.3rem;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      .expand-post {
        background-image: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0),
          rgba(247.35, 247.35, 247.35, 1) 25%
        );
      }
    }

    .post-header {
      margin: 4px 0;
    }
  }

  .post:not(:last-child):before {
    content: "";
    position: absolute;
    left: 30px;
    top: 56px;
    bottom: 0;
    width: 2px;
    background-color: #ddd;
    z-index: -1;
  }

  .post:not(:first-child):after {
    content: "";
    position: absolute;
    left: 30px;
    top: 0;
    width: 2px;
    height: 8px;
    background-color: #ddd;
    z-index: -1;
  }

  .right {
    flex-grow: 1;
    min-width: 0;
  }

  .buttons-placeholder {
    padding-bottom: 10px;
  }

  .buttons {
    margin-top: 10px;
    margin-bottom: 6px;
    column-gap: 4px;
    color: #888;
  }

  .reposted {
    padding-top: 30px;
  }
`;

return (
  <>
    <StyledPost
      className={`post ${highlight ? "bg-warning bg-opacity-10" : ""}`}
    >
      <div className="right">
        <div className="mb-3">
          <Widget
            src="buildhub.near/widget/components.post.Header"
            props={{
              accountId,
              blockHeight,
              link,
              postType: "comment",
              flagItem: item,
            }}
          />
        </div>
        <Widget
          loading={
            <div
              className="overflow-hidden w-100 placeholder-glow"
              style={{ minHeight: "100px" }}
            />
          }
          src="mob.near/widget/MainPage.N.Post.Content"
          props={{ content, raw }}
        />
        {blockHeight !== "now" ? (
          <div className="buttons d-flex justify-content-between">
            {parentItem && (
              <div key="comment">
                <Widget
                  loading=""
                  src="mob.near/widget/N.CommentButton"
                  props={{
                    disabled: permissions.disableComment,
                    onClick: () =>
                      State.update({ showReply: !state.showReply }),
                  }}
                />
              </div>
            )}
            <Widget
              loading=""
              src="mob.near/widget/N.RepostButton"
              props={{
                item,
                disabled: true,
              }}
            />
            <Widget
              loading=""
              src="mob.near/widget/N.LikeButton"
              props={{
                notifyAccountId,
                item,
              }}
            />
            <Widget
              loading=""
              src="mob.near/widget/MainPage.N.Post.ShareButton"
              props={{ accountId, blockHeight, postType: "comment", groupId }}
            />
          </div>
        ) : (
          <div className="buttons-placeholder" />
        )}
      </div>
    </StyledPost>
    {state.showReply && (
      <div className="mb-2" key="reply">
        <Widget
          src="buildhub.near/widget/Comment.Compose"
          props={{
            initialText: `@${accountId}, `,
            notifyAccountId: extractNotifyAccountId(parentItem),
            item: parentItem,
            onComment: () => State.update({ showReply: false }),
          }}
        />
      </div>
    )}
  </>
);
