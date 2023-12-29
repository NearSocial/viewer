const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const Aside = styled.div`
  grid-column: span 1 / span 1;
`;

const MainContent = styled.div`
  grid-column: span 4 / span 4;
`;

const [currentFeed, setCurrentFeed] = useState("updates");
const [template, setTemplate] = useState("What did you have in mind?");

const CustomFeed = ({ name }) => {
  name = !!name ? name : "update";
  return (
    <Feed
      index={[
        {
          action: "every",
          key: name,
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
          src="/*__@appAccount__*//widget/components.post.post"
          props={{
            accountId: p.accountId,
            blockHeight: p.blockHeight,
            noBorder: true,
          }}
        />
      )}
    />
  );
};

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const feedsDict = {
  updates: {
    key: "updates",
    name: "update",
    template: `🔔 DAILY UPDATE:  ${formatDate(new Date())}

📆 YESTERDAY:
- yesterday I did this (hyperlink proof)
- I also did this

💻 WHAT I AM DOING TODAY:
- task 1

🛑  BLOCKERS: 
- @anyone that is causing a blocker or outline any blockers in general`,
  },
};

const feeds = Object.keys(feedsDict);

const feed = () => {
  if (!!feedsDict[currentFeed]) {
    return CustomFeed(feedsDict[currentFeed]);
  }
};

return (
  <Container>
    <Aside>
      <Widget
        src="/*__@appAccount__*//widget/aside"
        props={{
          currentFeed: currentFeed,
          setCurrentFeed: setCurrentFeed,
          feeds,
        }}
      />
    </Aside>
    <MainContent>
      {context.accountId && (
        <Widget
          src="/*__@appAccount__*//widget/Compose"
          props={{
            key: feedsDict[currentFeed],
            template: feedsDict[currentFeed].template,
          }}
        />
      )}
      {feed()}
    </MainContent>
  </Container>
);
