const { feeds } = VM.require("buildhub.near/widget/config.feed");

console.log(feeds);

if (!feeds) {
  return "...";
}

const defaultProps = {
  feeds: feeds,
  daoName: "Build DAO",
  feedLink: "https://nearbuilders.org/feed",
  daoTag: "build",
  pagePath: "/?page=feed",
  //hashtag: "something"
};

return (
  <div className="container-xl my-3">
    <Widget
      src="buildhub.near/widget/Feed"
      loading="Feed loading..."
      props={{ ...props, ...defaultProps }}
    />
  </div>
);
