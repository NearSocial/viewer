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

const { demoLink, learning } = project;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  .link {
    display: flex;
    gap: 16px;
    flex-direction: row;
    align-items: center;
  }
  .learning {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

return (
  <Container className="text-white">
    <div className="link">
      <h5 className="heading">Link: </h5>
      <Button variant="secondary" href={demoLink} target="_blank" noLink={true}>
        Project Demo
      </Button>
    </div>
    <div className="learning">
      <h5 className="heading">What I learned</h5>
      <p className="learning">{learning}</p>
    </div>
  </Container>
);
