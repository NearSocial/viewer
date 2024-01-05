const { Feed } = VM.require("devs.near/widget/Module.Feed");
const { Aside } = VM.require("buildhub.near/widget/Aside");

Feed = Feed || (() => <></>); // ensure it's defined or set to a default component
Aside = Aside || (() => <></>); // ensure it's defined or set to a default component

const { type, hashtag } = props;
type = hashtag;
hashtag = type;

const { Post } = VM.require("buildhub.near/widget/components.post");
Post = Post || (() => <></>);

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const StyledAside = styled.div`
  grid-column: span 1 / span 1;
`;

const MainContent = styled.div`
  grid-column: span 4 / span 4;
`;

const [activeFeed, setActiveFeed] = useState(type || "resolutions");
const [template, setTemplate] = useState("What did you have in mind?");

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const feeds = {
  resolutions: {
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
    label: "Updates",
    icon: "bi-bell",
    name: "update",
    template: `### BUILDER UPDATE:  ${formatDate(new Date())}
(posted via [Build DAO Gateway](https://nearbuilders.org/feed?hashtag=update))

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
    label: "Documentation",
    icon: "bi-book",
    name: "documentation",
    template: `## TITLE
(posted via [Build DAO Gateway](https://nearbuilders.org/feed?hashtag=documentation))

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
    label: "Question",
    icon: "bi-question",
    name: "question",
    template: `## what is your question?
(posted via [Build DAO Gateway](https://nearbuilders.org/feed?hashtag=question))

[what are you thinking about?]
[why are you asking?]
`,
  },
  opportunity: {
    label: "Opportunity",
    icon: "bi-suitcase-lg",
    name: "opportunity",
    template: `## TITLE
(posted via [Build DAO Gateway](https://nearbuilders.org/feed?hashtag=opportunity))

[what is the opportunity?]

[explain the motivation or reason]

`,
  },
  idea: {
    label: "Idea",
    icon: "bi-lightbulb",
    name: "idea",
    template: ``,
  },
  task: {
    label: "Task",
    icon: "bi-check",
    name: "task",
    template: `## TASK TITLE
(posted via [Build DAO Gateway](https://nearbuilders.org/feed?hashtag=task))

**What needs to be done?**
- [Describe the task or action steps]

**Context or additional information:**
- [Provide any context or details]
`,
  },
};

return (
  <Container>
    <StyledAside>
      <Aside
        active={activeFeed}
        setActiveRoute={setActiveFeed}
        routes={feeds}
      />
    </StyledAside>
    <MainContent>
      {context.accountId ? (
        <Widget
          src="/*__@appAccount__*//widget/Compose"
          props={{
            feed: feeds[activeFeed],
            template: feeds[activeFeed].template,
          }}
        />
      ) : (
        <Widget
          src="/*__@appAccount__*//widget/components.login-now"
          props={props}
        />
      )}
      <Feed
        index={[
          {
            action: "hashtag",
            key: activeFeed,
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
    </MainContent>
  </Container>
);
