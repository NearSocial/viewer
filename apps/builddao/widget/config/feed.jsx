const { Post, Button } = VM.require("${config_account}/widget/components") || {
  Post: () => <></>,
  Button: () => <></>,
};

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const daoName = "Build DAO";
const feedLink = "https://nearbuilders.org/feed";

return {
  type: "app", // every.near/type/app
  header: {
    children: (
      <Button
        variant="outline"
        href="/${config_account}/widget/app?page=feed&tab=addNew"
        className="align-self-stretch flex-shrink-0 px-3 py-0 mb-md-3 px-md-3 py-md-1"
        linkClassName="d-flex col-md-12 flex-shrink-0 justify-content-start fw-medium align-self-stretch"
        style={{
          width: "-webkit-fill-available",
          display: context.accountId === "${config_account}" ? "" : "none",
        }}
      >
        Add New <i style={{ fontSize: 24 }} className="bi bi-plus"></i>
      </Button>
    ),
    path: "${config_account}/widget/FeedEditor",
    blockHeight: "final",
  },
  routes: {
    all: {
      path: "${config_account}/widget/Feed",
      blockHeight: "final",
      init: {
        name: "All", // maybe these should be moved to navbar specific
        icon: "bi-list",
        requiredHashtags: ["build"],
      },
    },
    updates: {
      path: "${config_account}/widget/Feed",
      blockHeight: "final",
      init: {
        name: "Updates",
        icon: "bi-bell",
        requiredHashtags: ["build", "update"],
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
    },
    question: {
      path: "${config_account}/widget/Feed",
      blockHeight: "final",
      init: {
        name: "Question",
        icon: "bi-question-lg",
        requiredHashtags: ["build", "question"],
        template: `## what is your question?
(posted via [${daoName} Gateway](${feedLink}?tab=question))

[what are you thinking about?]
[why are you asking?]
`,
      },
    },
    idea: {
      path: "${config_account}/widget/Feed",
      blockHeight: "final",
      init: {
        name: "Idea",
        icon: "bi-lightbulb",
        requiredHashtags: ["build", "idea"],
        template: `## IDEA TITLE
(posted via [${daoName} Gateway](${feedLink}?tab=idea))

**What idea are you proposing?**
- [Describe the idea]

**Context or additional information:**
- [Provide any context or details]
`,
      },
    },
    feedback: {
      path: "${config_account}/widget/Feed",
      blockHeight: "final",
      init: {
        name: "Feedback",
        icon: "bi-chat-left-text",
        requiredHashtags: ["build", "feedback"],
      },
    },
    events: {
      path: "${config_account}/widget/events.Calendar",
      blockHeight: "final",
      init: {
        name: "Events",
        icon: "bi-calendar",
        app: "every",
        thing: "event",
      },
    },
    addNew: {
      path: "${config_account}/widget/FeedEditor",
      blockHeight: "final",
      hide: true,
    },
    bookmarks: {
      path: "${config_account}/widget/OrderedGraphFeed",
      blockHeight: "final",
      init: {
        name: "Bookmarks",
        icon: "bi-bookmark",
        itemType: "bookmark",
        renderItem: (item) => {
          return (
            <Post
              accountId={item.accountId}
              blockHeight={item.blockHeight}
              noBorder={true}
              hideComments={true}
            />
          );
        },
      },
    },
  },
};
