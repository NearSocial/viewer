const { Feed } = VM.require("devs.near/widget/Module.Feed") || (() => <></>);
const { Post, ButtonLink } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
  ButtonLink: () => <></>,
};

const Theme = styled.div`
  --stroke-color: rgba(255, 255, 255, 0.2);
  --bg-1: #0b0c14;
  --bg-1-hover: #17181c;
  --bg-1-hover-transparent: rgba(23, 24, 28, 0);
  --bg-2: ##23242b;
  --label-color: #fff;
  --font-color: #fff;
  --font-muted-color: #cdd0d5;
  --black: #000;
  --system-red: #fd2a5c;
  --yellow: #ffaf51;

  --compose-bg: #23242b;

  --post-bg: #0b0c14;
  --post-bg-hover: #17181c;
  --post-bg-transparent: rgba(23, 24, 28, 0);

  --button-primary-bg: #ffaf51;
  --button-outline-bg: transparent;
  --button-default-bg: #23242b;

  --button-primary-color: #000;
  --button-outline-color: #fff;
  --button-default-color: #cdd0d5;

  --button-primary-hover-bg: #e49b48;
  --button-outline-hover-bg: rgba(255, 255, 255, 0.2);
  --button-default-hover-bg: #17181c;
`;

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const daoName = "Build DAO";
const feedLink = "https://nearbuilders.org/feed";
const daoTag = "build";

const feeds = {
  resolutions: {
    label: "Resolutions",
    icon: "bi-calendar3",
    name: "resolution",
    hashtag: "nearyearresolutions2024",
    template: `### 🎉 NEAR YEAR RESOLUTIONS: 2024
  (posted via [${daoName} Gateway](${feedLink}))
  
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
    hashtag: "update",
    template: `### BUILDER UPDATE:  ${formatDate(new Date())}
  (posted via [${daoName} Gateway](${feedLink}?tab=update))
  
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
    hashtag: "documentation",
    template: `## TITLE
  (posted via [${daoName} Gateway](${feedLink}?tab=documentation))
  
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
    icon: "bi-question-lg",
    name: "question",
    hashtag: "question",
    template: `## what is your question?
  (posted via [${daoName} Gateway](${feedLink}?tab=question))
  
  [what are you thinking about?]
  [why are you asking?]
  `,
  },
  answer: {
    label: "Answer",
    icon: "bi-journal-code",
    name: "answer",
    hashtag: "answer",
    template: `## Share an answer
  (posted via [${daoName} Gateway](${feedLink}?tab=answer))
  
  [please restate the question you are answering]
  
  [your answer]
  
  [link to relevant docs, examples, or resources]
  `,
  },
  opportunity: {
    label: "Opportunity",
    icon: "bi-briefcase",
    name: "opportunity",
    hashtag: "opportunity",
    template: `## TITLE
  (posted via [${daoName} Gateway](${feedLink}?tab=opportunity))
  
  [what is the opportunity?]
  
  [explain the motivation or reason]
  
  `,
  },
  idea: {
    label: "Idea",
    icon: "bi-lightbulb",
    name: "idea",
    hashtag: "idea",
    template: ``,
  },
  task: {
    label: "Task",
    icon: "bi-check-lg",
    name: "task",
    template: `## TASK TITLE
  (posted via [${daoName} Gateway](${feedLink}?tab=task))
  
  **What needs to be done?**
  - [Describe the task or action steps]
  
  **Context or additional information:**
  - [Provide any context or details]
  `,
  },
  bookmarks: {
    label: "Bookmarks",
    icon: "bi-bookmark",
    name: "bookmark",
  },
};

if (!feeds) {
  return "";
}

const tab = props.tab || Object.keys(feeds)[0];
if (Object.keys(feeds).includes(props.hashtag)) {
  tab = props.hashtag;
}
const [activeFeed, setActiveFeed] = useState(tab);

return (
  <Theme>
    <Widget
      src="buildhub.near/widget/components.AsideWithMainContent"
      props={{
        sideContent: Object.keys(feeds || {}).map((route) => {
          const data = feeds[route];
          return (
            <ButtonLink
              id={route}
              variant={activeFeed === route ? "primary" : "outline"}
              href={`?tab=${route}`}
              className={
                "align-self-stretch flex-shrink-0 justify-content-start fw-medium"
              }
              style={{
                fontSize: "14px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <i className={`bi ${data.icon} `}></i>
              {data.label}
            </ButtonLink>
          );
        }),
        mainContent: (
          <>
            {context.accountId ? (
              activeFeed !== "bookmarks" ? (
                <Widget
                  src="buildhub.near/widget/Compose"
                  props={{
                    feed: feeds[activeFeed],
                    template: feeds[activeFeed].template,
                    requiredHashtags: [daoTag],
                  }}
                />
              ) : (
                <Widget src="buildhub.near/widget/Bookmarks" />
              )
            ) : (
              <Widget
                src="buildhub.near/widget/components.login-now"
                props={props}
              />
            )}
            {activeFeed !== "bookmarks" && (
              <Feed
                index={[
                  {
                    action: "hashtag",
                    key: feeds[activeFeed].hashtag,
                    options: {
                      limit: 10,
                      order: "desc",
                    },
                    cacheOptions: {
                      ignoreCache: true,
                    },
                    required: true,
                  },
                ]}
                Item={(p) => (
                  <Post
                    accountId={p.accountId}
                    blockHeight={p.blockHeight}
                    noBorder={true}
                  />
                )}
              />
            )}
          </>
        ),
      }}
    />
  </Theme>
);
