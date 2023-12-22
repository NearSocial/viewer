const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

return (
  <Feed
    index={{
      action: "post",
      key: "main",
      options: {
        limit: 10,
        order: "desc",
        accountId: ["efiz.near"],
      },
    }}
    Item={(p) => {
      return (
        <Widget
          key={JSON.stringify(p)}
          src="embeds.near/widget/Post.Index"
          loading={<div style={{ height: "200px" }} />}
          props={{ accountId: p.accountId, blockHeight: p.blockHeight }}
        />
      );
    }}
  />
);
