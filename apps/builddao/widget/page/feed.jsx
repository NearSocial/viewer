const { Feed } = VM.require("devs.near/widget/Feed") || {
  // this is being pulled from local apps/bos-blocks/widget/Feed
  Feed: () => <p>Feed loading...</p>,
};

// would a provider pattern be helpful here?
// const { items } = props;

const [activeItem, setActiveItem] = useState(null);

function Sidebar() { 
  return ( // minimal styling, classnames from Theme
    <div onClick={(v) => setActiveItem}>
      <p>sidebar</p>
    </div>
  );
}

// can we take influence from the pattern in buildhub.near/widget/app?

return (
  <>
    <Sidebar />
    <Feed
      index={[
        {
          action: "hashtag",
          key: "build",
          options: {
            limit: 10,
            order: "desc",
            accountId: undefined,
          },
          required: true, // need to add this functionality
        },
        {
          action: "hashtag",
          key: "build",
          options: {
            limit: 10,
            order: "desc",
            accountId: undefined,
          },
        },
      ]}
      Item={(p) => <p>{JSON.stringify(p)}</p>}
    />
  </>
);
