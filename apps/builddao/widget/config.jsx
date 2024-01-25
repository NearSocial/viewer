function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const theme = `
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

return {
  type: "app",
  routes: {
    home: {
      path: "buildhub.near/widget/page.home",
      blockHeight: "final",
      init: {
        name: "Home",
      },
    },
    feed: {
      path: "buildhub.near/widget/page.feed",
      blockHeight: "final",
      init: {
        name: "Feed",
        feeds: feeds,
        daoName: "Build DAO",
        feedLink: "https://nearbuilders.org/feed",
        daoTag: "build",
        pagePath: "/?page=feed",
        //hashtag: "something"
      },
    },
    inspect: {
      path: "mob.near/widget/WidgetSource",
      blockHeight: "final",
      hide: true,
    },
    notifications: {
      path: "mob.near/widget/NotificationFeed",
      blockHeight: "final",
      hide: true,
    },
  },
  theme: theme,
};
