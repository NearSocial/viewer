const { Avatar, Hashtag, Button } = VM.require(
  "buildhub.near/widget/components"
) || {
  Hashtag: () => <></>,
  Avatar: () => <></>,
  Button: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const { ProfileImages } = VM.require(
  "buildhub.near/widget/components.ProfileImages"
) || {
  ProfileImages: () => <></>,
};

const Card = styled.div`
  border-radius: 16px;
  background: var(--bg-2, #23242b);

  display: flex;
  padding: 24px 29px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  color: var(--text-color, #fff);
  justify-content: space-between;

  .info {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;

    h4 {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
    }

    span {
      color: var(--white-50, #b0b0b0);
      font-size: 13px;
      font-weight: 700;
    }
  }
  .c-top {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }
  .bt-w {
    flex: 1;
    button {
      width: 90%;
    }
  }
`;

const ProjectCard = ({ project, type, app }) => {
  const { title, accountId, tags, collaborators, metadata } = project;
  return (
    <Card>
      <div className="c-top">
        <Avatar accountId={accountId} />
        <div className="info">
          <h4>
            {metadata.title.length > 30
              ? `${metadata.title.slice(0, 25)}...`
              : metadata.title}
          </h4>
          <span>{`@${
            accountId.length > 30
              ? `${accountId.slice(0, 20)}...${accountId.slice(
                  accountId.length - 4
                )}`
              : accountId
          }`}</span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {tags.map((tag) => (
            <Hashtag>
              <span className="fw-bold">{tag}</span>
            </Hashtag>
          ))}
        </div>
        <div>
          <ProfileImages accountIds={collaborators} />
        </div>
      </div>
      <div className="w-100">
        <Button
          href={
            // `/buildhub.near/widget/app?page=project&id=${accountId}/${app}/${type}/${title}`
            href({
              widgetSrc: `buildhub.near/widget/app`,
              params: {
                page: "project",
                id: `${accountId}/${app}/${type}/${title}`,
              },
            })
          }
          // className="align-self-stretch"
          linkClassName="align-self-stretch bt-w"
          variant="outline"
        >
          Open
        </Button>
      </div>
    </Card>
  );
};

return { ProjectCard };
