const { Avatar, Hashtag, Button } = VM.require(
  "buildhub.near/widget/components",
) || {
  Hashtag: () => <></>,
  Avatar: () => <></>,
  Button: () => <></>,
};

const { ProfileImages } = VM.require(
  "buildhub.near/widget/components.ProfileImages",
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
`;

const ProjectCard = ({ title, tags, people, accountId }) => {
  return (
    <Card>
      <Avatar accountId={accountId} />
      <div className="info">
        <h4>{title}</h4>
        <span>@{accountId}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {tags.map((tag) => (
          <Hashtag>
            <span className="fw-bold">{tag}</span>
          </Hashtag>
        ))}
      </div>
      <div>
        <ProfileImages accountIds={people} />
      </div>
      <Button className="align-self-stretch" variant="outline">
        Open
      </Button>
    </Card>
  );
};

return { ProjectCard };
