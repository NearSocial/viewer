const { Feed } = VM.require("devs.near/widget/Feed") || {
  Feed: () => <></>,
};
const { Post } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
};

const { name: feedName, template, requiredHashtags, customActions } = props;

// for modals
const [item, setItem] = useState(null);
const [showProposeModal, setShowProposeModal] = useState(false);
const toggleProposeModal = () => {
  setShowProposeModal(!showProposeModal);
};
const modalToggles = {
  propose: toggleProposeModal,
};

return (
  <div key={feedName}>
    {feedName.toLowerCase() === "request" && (
      <>
        <Widget
          src="buildhub.near/widget/components.modals.CreateProposal"
          loading=""
          props={{
            showModal: showProposeModal,
            toggleModal: toggleProposeModal,
            item: item,
          }}
        />
      </>
    )}
    {!context.accountId ? ( // if not logged in
      <Widget
        loading=""
        src="buildhub.near/widget/components.login-now"
        props={props}
      />
    ) : (
      <Widget
        loading={
          <div
            className="placeholder-glow h-100 w-100"
            style={{ height: 400 }}
          ></div>
        }
        src="buildhub.near/widget/Compose"
        props={{
          draftKey: feedName,
          template: template,
          requiredHashtags: requiredHashtags,
          feed: { ...props },
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
          modalToggles={modalToggles}
          setItem={setItem}
        />
      )}
    />
  </div>
);
