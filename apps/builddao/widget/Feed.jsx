const { Feed } = VM.require("devs.near/widget/Module.Feed") || (() => <></>);
const { Post, ButtonLink } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
  ButtonLink: () => <></>,
};

const daoName = props.daoName || "Build DAO";
const feedLink = props.feedLink || "https://nearbuilders.org/feed";
const daoTag = props.daoTag || "build";

const feeds = props.feeds || {};

if (!feeds) {
  return "";
}

const tab = props.tab || Object.keys(feeds)[0];
if (Object.keys(feeds).includes(props.hashtag)) {
  tab = props.hashtag;
}
const [activeFeed, setActiveFeed] = useState(tab);

return (
  <>
    <Widget
      src="buildhub.near/widget/components.AsideWithMainContent"
      props={{
        sideContent: Object.keys(feeds || {}).map((route) => {
          const data = feeds[route];
          return (
            <ButtonLink
              id={route}
              variant={activeFeed === route ? "primary" : "outline"}
              href={`${props.pagePath}&tab=${route}`}
              className={
                "align-self-stretch flex-shrink-0 justify-content-start fw-medium"
              }
              style={{
                fontSize: "14px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <i className={`bi ${data.icon} `}></i>
              {data.label}
            </ButtonLink>
          );
        }),
        mainContent: (
          <>
            {context.accountId ? (
              activeFeed !== "bookmarks" ? (
                <Widget
                  src="buildhub.near/widget/Compose"
                  props={{
                    feed: feeds[activeFeed],
                    template: feeds[activeFeed].template,
                    requiredHashtags: [daoTag],
                  }}
                />
              ) : (
                <Widget src="buildhub.near/widget/Bookmarks" />
              )
            ) : (
              <Widget
                src="buildhub.near/widget/components.login-now"
                props={props}
              />
            )}
            {activeFeed !== "bookmarks" && (
              <Feed
                index={[
                  {
                    action: "hashtag",
                    key: feeds[activeFeed].hashtag, // resolution
                    options: {
                      limit: 10,
                      order: "desc",
                    },
                    cacheOptions: {
                      ignoreCache: true,
                    },
                    required: true,
                  },
                  // fix this
                  // {
                  //   action: "hashtag",
                  //   key: daoTag, // build
                  //   options: {
                  //     limit: 10,
                  //     order: "desc",
                  //   },
                  //   cacheOptions: {
                  //     ignoreCache: true,
                  //   },
                  //   required: true,
                  // },
                ]}
                Item={(p) => (
                  <Post
                    accountId={p.accountId}
                    blockHeight={p.blockHeight}
                    noBorder={true}
                    currentPath={`${props.pagePath}`}
                  />
                )}
              />
            )}
          </>
        ),
      }}
    />
  </>
);
