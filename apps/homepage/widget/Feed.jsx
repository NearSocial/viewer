const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

return (
  <Feed
    index={[
      {
        action: "post",
        key: "main",
        options: {
          limit: 10,
          order: "desc",
          accountId: props.accounts,
        },
        cacheOptions: {
          ignoreCache: true,
        },
      },
      {
        action: "repost",
        key: "main",
        options: {
          limit: 10,
          order: "desc",
          accountId: props.accounts,
        },
        cacheOptions: {
          ignoreCache: true,
        },
      },
    ]}
    Item={(p) => (
      <Widget
        loading={<div className="w-100" style={{ height: "200px" }} />}
        src="mob.near/widget/MainPage.N.Post"
        props={{ accountId: p.accountId, blockHeight: p.blockHeight }}
      />
    )}
  />
);
