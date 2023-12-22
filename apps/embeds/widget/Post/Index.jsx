const accountId = props.accountId;
if (!accountId) {
  return "No accountId";
}
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const pinned = !!props.pinned;
const hideMenu = !!props.hideMenu;
const hideButtons = !!props.hideButtons;
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/main`, blockHeight) ?? "null");
const subscribe = !!props.subscribe;
const raw = !!props.raw;
const groupId = props.groupId ?? content.groupId;
const indexKey = props.indexKey;
const permissions = props.permissions;
const fullPostLink = props.fullPostLink;

const notifyAccountId = accountId;
const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const link =
  props.link ??
  props.fullPostLink ??
  `/mob.near/widget/MainPage.N.Post.Page?accountId=${accountId}&blockHeight=${blockHeight}`;

const Wrapper = styled.div`
  margin: 0 -12px;
  line-height: normal;
  
  .post {
    position: relative;
    padding: 12px;
    padding-bottom: 4px;
    display: flex;
    h1, h2, h3, h4, h5, h6 {
      font-size: 16px !important;
    }
    @media(max-width: 767px) {
      font-size: 15px !important;
      h1, h2, h3, h4, h5, h6 {
        font-size: 15px !important;
      }
    }

    h1, h2, h3, h4, h5, h6, strong, b {
      font-weight: 500 !important;
    }
    ol, ul, dl {
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

    .table>:not(caption)>*>* {
      padding: .3rem;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      .expand-post {
        background-image : linear-gradient(to bottom, 
                      rgba(0,0,0, 0), 
                      rgba(247.35,247.35,247.35, 1) 25%);
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
  
  .left {
    margin-right: 12px;
    min-width: 40px;
    width: 40px;
    overflow: hidden;
  }
  .right {
    margin-top: -4px;
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

const contentWidget = (
  <Widget
    key="content"
    loading={
      <div
        className="overflow-hidden w-100 placeholder-glow"
        style={{ minHeight: "100px" }}
      />
    }
    src="embeds.near/widget/Post.Content"
    props={{
      content,
      raw,
      truncateContent: props.truncateContent,
      noEmbed: props.noEmbed,
    }}
  />
);

return (
  <Wrapper
    style={
      props.hideComments || props.noBorder
        ? undefined
        : {
            borderBottom: "1px solid #eee",
          }
    }
  >
    <div className={`post ${props.reposted ? "reposted" : ""}`}>
      <div className="left">
        <Widget
          loading=""
          src="mob.near/widget/MainPage.N.Post.Left"
          props={{ accountId, groupId }}
        />
      </div>
      <div className="right">
        <Widget
          loading={<div className="post-header" />}
          src="mob.near/widget/MainPage.N.Post.Header"
          props={{
            accountId,
            blockHeight,
            pinned,
            hideMenu,
            link,
            postType: "post",
            flagItem: item,
          }}
        />
        {fullPostLink ? (
          <a
            key="full-post-link"
            target="_blank"
            href={fullPostLink}
            className="text-decoration-none link-dark"
          >
            {contentWidget}
          </a>
        ) : (
          contentWidget
        )}
        {props.customButtons ? (
          props.customButtons
        ) : !pinned && !hideButtons && blockHeight !== "now" ? (
          <div className="buttons d-flex justify-content-between">
            <Widget
              loading=""
              src="mob.near/widget/N.CommentButton"
              props={{
                disabled: permissions.disableComment,
                onClick: () => State.update({ showReply: !state.showReply }),
              }}
            />
            <Widget
              loading=""
              src="mob.near/widget/N.RepostButton"
              props={{
                disable: permissions.disableRepost,
                notifyAccountId,
                item,
                // indexKey,
                // groupId,
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
              props={{ accountId, blockHeight, postType: "post", groupId }}
            />
          </div>
        ) : (
          <div className="buttons-placeholder" />
        )}
      </div>
    </div>
    {state.showReply && (
      <div className="border-top">
        <Widget
          loading=""
          src="mob.near/widget/MainPage.N.Comment.Compose"
          props={{
            notifyAccountId,
            item,
            onComment: () => State.update({ showReply: false }),
          }}
        />
      </div>
    )}
    {props.customComments
      ? props.customComments
      : !props.hideComments && (
          <Widget
            key="comments"
            loading={false}
            src="mob.near/widget/MainPage.N.Comment.Feed"
            props={{
              item,
              highlightComment: props.highlightComment,
              limit: props.commentsLimit,
              subscribe,
              raw,
              accounts: props.commentAccounts,
              groupId,
              permissions,
            }}
          />
        )}
  </Wrapper>
);