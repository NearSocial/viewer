const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { getProjectMeta } = VM.require(
  "buildhub.near/widget/lib.project-data"
) || {
  getProjectMeta: () => {},
};

const { id } = props;

const project = getProjectMeta(id);

const { projectLink } = project;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

return (
  <Container className="text-white">
    <Button
      variant="secondary"
      href={projectLink}
      target="_blank"
      noLink={true}
    >
      GitHub Repo
    </Button>
  </Container>
);
