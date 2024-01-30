const { Feed } = VM.require("devs.near/widget/Feed") || {
  Feed: () => <></>,
};
const { Post } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
};

const { name, template, requiredHashtags, customActions } = props;

return (
  <div key={name}>
    {!context.accountId ? ( // if not logged in
      <Widget src="buildhub.near/widget/components.login-now" props={props} />
    ) : (
      <Widget
        src="buildhub.near/widget/Compose"
        props={{
          draftKey: name,
          template: template,
          requiredHashtags: requiredHashtags,
        }}
      />
    )}
    <Feed
      index={(requiredHashtags || []).map((it) => ({
        action: "hashtag",
        key: it,
        options: {
          limit: 10,
          order: "desc",
        },
        cacheOptions: {
          ignoreCache: true,
        },
        required: true,
      }))}
      Item={(p) => (
        <Post
          accountId={p.accountId}
          blockHeight={p.blockHeight}
          noBorder={true}
          currentPath={`/buildhub.near/widget/app?page=feed`}
          customActions={customActions}
          feedType={name}
        />
      )}
    />
  </div>
);
