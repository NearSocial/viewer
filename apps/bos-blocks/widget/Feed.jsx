const Feed = ({ index, typeWhitelist, Item, Layout, showCompose }) => {
  Item = Item || ((props) => <div>{JSON.stringify(props)}</div>);
  Layout = Layout || (({ children }) => children);

  const renderItem = (a, i) => {
    if (typeWhitelist && !typeWhitelist.includes(a.value.type)) {
      return false;
    }
    return (
      <div key={JSON.stringify(a)}>
        <Item
          accountId={a.accountId}
          path={a.value.path}
          blockHeight={a.blockHeight}
          type={a.value.type}
        />
      </div>
    );
  };

  const composeIndex = () => {
    const arr = Array.isArray(index) ? index : [index];

    const grouped = arr.reduce((acc, i) => {
      if (i.action !== "repost") {
        if (!acc[i.action]) {
          acc[i.action] = [];
        }
        acc[i.action].push({ key: i.key, value: { type: "md" } });
      }
      return acc;
    }, {});

    Object.keys(grouped).forEach((action) => {
      if (grouped[action].length === 1) {
        grouped[action] = grouped[action][0];
      }
      grouped[action] = JSON.stringify(grouped[action]);
    });

    return grouped;
  };

  const appendHashtags = (v) => {
    const arr = Array.isArray(index) ? index : [index];
    const hashtags = arr
      .filter((i) => i.action === "hashtag")
      .map((i) => i.key);

    hashtags.forEach((hashtag) => {
      if (v.toLowerCase().includes(`#${hashtag.toLowerCase()}`)) return;
      else v += ` #${hashtag}`;
    });

    return v;
  };

  return (
    <>
      {showCompose && (
        <Widget
          src="devs.near/widget/Compose"
          props={{ index: composeIndex(), appendHashtags }}
        />
      )}
      {Array.isArray(index) ? (
        <Widget
          src="/*__@appAccount__*//widget/PR.MergedIndexFeed"
          props={{
            index,
            renderItem,
            Layout: ({ children }) => <Layout>{children}</Layout>,
          }}
        />
      ) : (
        <Widget
          src="/*__@appAccount__*//widget/PR.FilteredIndexFeed"
          props={{
            index,
            renderItem,
            Layout: ({ children }) => <Layout>{children}</Layout>,
          }}
        />
      )}
    </>
  );
};

return { Feed };
