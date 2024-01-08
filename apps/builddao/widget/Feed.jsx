const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

const v = props.hashtag;

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

const [currentFeed, setCurrentFeed] = useState(v || "resolutions");
const [template, setTemplate] = useState("What did you have in mind?");

const CustomFeed = ({ name, hashtag }) => {
  return (
    <Feed
      index={[
        {
          action: "hashtag",
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
          src="/*__@appAccount__*//widget/Post"
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
  resolutions: {
    key: "resolutions",
    label: "Resolutions",
    icon: "bi-calendar3",
    name: "resolution",
    hashtag: "nearyearresolutions2024",
    template: `### 🎉 NEAR YEAR RESOLUTIONS: 2024
(posted via [Build DAO Gateway](https://nearbuilders.org/feed))

**🌟 REFLECTIONS ON THE PAST YEAR:**
- [Reflection 1 from the past year]
- [Reflection 2 from the past year]

**🎯 NEW YEAR'S RESOLUTIONS:**
- [Resolution 1]
- [Resolution 2]

**📊 MEASURING SUCCESS:**
- [Metric 1 for Success]
- [Metric 2 for Success]
`,
  },
  updates: {
    key: "updates",
    label: "Updates",
    icon: "bi-bell",
    name: "update",
    template: `### BUILDER UPDATE:  ${formatDate(new Date())}
(posted via [Build DAO Gateway](https://nearbuilders.org/feed))

**✅ DONE**
- [what'd you do]
- [link proof]

**⏩ NEXT**
- [what's next?]
- [what are you thinking about?]

**🛑 BLOCKERS**
- [what's blocking you?]
- [how can someone help?]
`,
  },
  documentation: {
    key: "documentation",
    label: "Documentation",
    icon: "bi-book",
    name: "documentation",
    template: `## TITLE
(posted via [Build DAO Gateway](https://nearbuilders.org/feed))

**WHAT IS _____?**
- [context]
- [why is it important?]

**EXAMPLE**
- [how can this be demonstrated?]
- [what is the expected outcome?]

**USAGE**
- [where is it used?]
- [how to use it]
`,
  },
  question: {
    key: "question",
    label: "Question",
    icon: "bi-question",
    name: "question",
    template: `## what is your question?
(posted via [Build DAO Gateway](https://nearbuilders.org/feed))

[what are you thinking about?]
[why are you asking?]
`,
  }
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
          feeds: feedsDict,
          feedsDict,
        }}
      />
    </Aside>
    <MainContent>
      {context.accountId ? (
        <Widget
          src="/*__@appAccount__*//widget/Compose"
          props={{
            feed: feedsDict[currentFeed],
            template: feedsDict[currentFeed].template,
          }}
        />
      ) : (
        <Widget
          src="/*__@appAccount__*//widget/components.login-now"
          props={props}
        />
      )}
      {feed()}
    </MainContent>
  </Container>
);
