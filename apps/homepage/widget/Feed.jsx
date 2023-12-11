const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

const profile =
  props.profile || Social.get(`${context.accountId}/profile/**`, "final") || {};

const StyledPost = styled.div`
  margin: 1rem 0;
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

const NewPost = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  gap: 24px;
  align-self: stretch;

  border-radius: 12px;
  background: var(--bg-2, #23242b);

  img.logo {
    width: 40px;
    height: 40px;

    border-radius: 40px;
    background: lightgray 50% / cover no-repeat;
  }

  textarea {
    flex: 1 1 0;
    border: 0;
    background-color: #23242b;
    width: 100%;
  }

  button.post {
    all: unset;
    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    background: var(--Yellow, #ffaf51);

    color: var(--black-100, #000);

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: start;
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

const feed = () => {
  if (currentFeed === "updates")
    return (
      <Feed
        index={[
          {
            action: "post",
            key: "main",
            options: {
              limit: 10,
              order: "desc",
              accountId: props.accounts,
            },
            cacheOptions: {
              ignoreCache: true,
            },
          },
          {
            action: "repost",
            key: "main",
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
              src="buildhub.near/widget/components.post.post"
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
  else if (currentFeed === "bugs") return "Bugs Feed";
  else if (currentFeed === "resources") return "Resource Feed";
};

return (
  <Container>
    <Aside>
      <Widget
        src="buildhub.near/widget/feed.aside"
        props={{ currentFeed: currentFeed, setCurrentFeed: setCurrentFeed }}
      />
    </Aside>
    <MainContent>
      <NewPost className="w-100">
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.image,
            alt: profile.name,
            style: {
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            },
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
          }}
        />
        <textarea placeholder="What do you have in mind?" />
        <button className="post">Create Updates</button>
      </NewPost>
      {feed()}
    </MainContent>
  </Container>
);
