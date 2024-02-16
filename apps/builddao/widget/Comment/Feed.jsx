const index = {
  action: "comment",
  key: props.item,
  options: {
    limit: props.limit ?? 3,
    order: "desc",
    accountId: props.accounts,
    subscribe: props.subscribe,
  },
};

const groupId = props.groupId;
const permissions = props.permissions;
const raw = !!props.raw;

const renderItem = (a) =>
  a.value.type === "md" && (
    <Widget
      key={JSON.stringify(a)}
      loading={<div className="w-100 mb-2" style={{ minHeight: "200px" }} />}
      src="buildhub.near/widget/Comment.Comment"
      props={{
        accountId: a.accountId,
        blockHeight: a.blockHeight,
        highlight:
          a.accountId === props.highlightComment?.accountId &&
          a.blockHeight === props.highlightComment?.blockHeight,
        raw,
        groupId,
        permissions,
      }}
    />
  );

const ShowMore = styled.div`
  padding: 4px 0px 4px 64px;
  line-height: 24px;
  position: relative;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  :before {
    content: "";
    position: absolute;
    left: 30px;
    top: 2px;
    height: 24px;
    width: 2px;
    background-image: linear-gradient(to bottom, transparent 75%, #ddd 75%);
    background-size: 100% 8px;
    background-repeat: repeat-y;
    z-index: -1;
  }
`;

return (
  <Widget
    loading={false}
    src="mob.near/widget/FilteredIndexFeed"
    props={{
      loading: false,
      index,
      reverse: true,
      manual: true,
      renderItem,
      nextLimit: 10,
      loadMoreText: <ShowMore>Show earlier comments...</ShowMore>,
    }}
  />
);
