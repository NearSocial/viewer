const { Feed } = VM.require("devs.near/widget/Feed") || {
  Feed: () => <></>,
};
const { Post, Button } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
  Button: () => <></>,
};

const LoginContainer = styled.div`
  background-color: #23242b;
  color: #fff;

  width: 100%;
  height: 16rem;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;

  margin-bottom: 1rem;
`;

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
      <LoginContainer>
        <p>Please login in order to post.</p>
        <a
          href={"https://nearbuilders.org/join"}
          style={{ textDecoration: "none" }}
        >
          <Button variant="primary">Login</Button>
        </a>
      </LoginContainer>
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
          subscribe: true,
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
