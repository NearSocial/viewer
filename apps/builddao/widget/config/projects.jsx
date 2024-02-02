const { Post } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
};

function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const daoName = "Build DAO";
const feedLink = "https://nearbuilders.org/feed";

return {
  type: "app", // every.near/type/app
  routes: {
    request: {
      path: "buildhub.near/widget/Feed",
      blockHeight: "final",
      init: {
        name: "Request",
        icon: "bi-file-earmark-text",
        requiredHashtags: ["build", "request"],
        customActions: [
          {
            type: "modal",
            icon: "bi-file-earmark-text",
            label: "Propose",
            onClick: (modalToggles) => {
              const toggle = modalToggles.propose;
              toggle();
            },
          },
        ],
        template: `## REQUEST TITLE
(posted via [${daoName} Gateway](${feedLink}?tab=request))

#### Description
[Detailed description of what the proposal is about.]

#### Why This Proposal?
[Explanation of why this proposal is necessary or beneficial.]
`,
      },
    },
    proposals: {
      path: "buildhub.near/widget/Proposals",
      blockHeight: "final",
      init: {
        name: "Proposals",
        icon: "bi-file-earmark-text",
        daoId: "build.sputnik-dao.near",
      },
    },
  },
};
