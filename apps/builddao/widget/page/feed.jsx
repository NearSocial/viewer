const { feeds } = VM.require("buildhub.near/widget/config.feed") || {}; // this is the thing, which works better as a module if it needs to be provided with context

console.log(feeds);

if (!feeds) {
  return "...";
}

const defaultProps = {
  feeds: feeds,
  daoName: "Build DAO", // I think we could take this out, not specific to feeds
  feedLink: "https://nearbuilders.org/feed", // this is good idea, could be used for the "share post" button
  daoTag: "build", // maybe we can make this an array of "required hashtags"
  pagePath: "/?page=feed", // great idea, @mattb.near RoutesManager 
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
