const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

const profile =
  props.profile || Social.get(`${context.accountId}/profile/**`, "final") || {};

const StyledPost = styled.div`
  margin-bottom: 1rem;
  .post {
    border-radius: 16px;
    border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
    color: #b6b6b8;
    padding: 24px !important;
    background-color: #0b0c14;
    transition: all 300ms;

    &:hover {
      background-color: #171929 !important;
      .expand-post {
        background-image: linear-gradient(
          to bottom,
          rgb(23, 25, 41, 0),
          rgb(23, 25, 41, 1) 25%
        ) !important;
      }
    }

    .post-header {
      span,
      .text-muted {
        color: #fff !important;
      }
    }

    .buttons {
      border-top: 1px solid #3c3d43;
      padding: 0.5rem;
    }

    .expand-post {
      background-image: linear-gradient(
        to bottom,
        rgb(11, 12, 20, 0),
        rgb(11, 12, 20, 1) 25%
      ) !important;
    }
  }

  .dropdown-menu {
    background-color: #0b0c14 !important;
    color: #fff !important;

    li.dropdown-item {
      color: #fff !important;
      &:hover {
        a {
          color: #0b0c14 !important;
        }
      }
    }

    .link-dark,
    .dropdown-item {
      color: #fff !important;

      &:hover {
        color: #0b0c14 !important;

        span {
          color: #0b0c14 !important;
        }
      }
    }
  }

  textarea {
    color: #b6b6b8 !important;
  }
`;

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
  name = !!name ? name : 'main'
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
        <StyledPost>
          <Widget
            loading={<div className="w-100" style={{ height: "200px" }} />}
            src="/*__@appAccount__*//widget/components.post.post"
            props={{
              accountId: p.accountId,
              blockHeight: p.blockHeight,
              noBorder: true,
            }}
          />
        </StyledPost>
      )}
    />
  );
}

const feedsDict = {
  "updates": {
    key: "updates",
    name: "update",
    template: 
`🔔 DAILY UPDATE:  TODAY's DATE

📆 YESTERDAY:
- yesterday I did this (hyperlink proof)
- I also did this

💻 WHAT I AM DOING TODAY:
- task 1

🛑  BLOCKERS: 
- @anyone that is causing a blocker or outline any blockers in general`,
  },
}

const feeds = Object.keys(feedsDict)

const feed = () => {
  if (!!feedsDict[currentFeed]) {
    return CustomFeed(feedsDict[currentFeed])
  }
  return CustomFeed('main')
};

return (
  <Container>
    <Aside>
      <Widget
        src="/*__@appAccount__*//widget/aside"
        props={{ currentFeed: currentFeed, setCurrentFeed: setCurrentFeed, feeds }}
      />
    </Aside>
    <MainContent>
      {context.accountId && (
        <Widget 
          src="/*__@appAccount__*//widget/compose"
          props={{ key: feedsDict[currentFeed], template: feedsDict[currentFeed].template }}
        />
      )}
      {feed()}
    </MainContent>
  </Container>
);
