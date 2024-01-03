const { Button } = VM.require("buildhub.near/widget/components.button");
const { Pagination } = VM.require("buildhub.near/widget/components.pagination");
const { ProgressState } = VM.require(
  "buildhub.near/widget/components.progress-state"
);

const Heading = styled.h2`
  color: white;
`;

return (
  <div className="container-xl">
    <div className="d-flex flex-column gap-3">
      <Heading>Buttons</Heading>
      <div className="d-flex align-items-center gap-3">
        <Button>Normal</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Button>
          Normal <i className="bi bi-arrow-right"></i>
        </Button>
        <Button variant="primary">
          Primary <i className="bi bi-arrow-right"></i>
        </Button>
        <Button variant="outline">
          Outline <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Button type="icon">
          <i className="bi bi-arrow-right"></i>
        </Button>
        <Button variant="primary" type="icon">
          <i className="bi bi-arrow-right"></i>
        </Button>
        <Button variant="outline" type="icon">
          <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
      <div className="d-flex flex-column gap-3">
        <Heading>Pagination</Heading>
        <Pagination totalPages={4} selectedPage={1} />
      </div>
      <div className="d-flex flex-column gap-3">
        <Heading>Progress State</Heading>
        <div className="d-flex align-items-center gap-3">
          <ProgressState status="default">1</ProgressState>
          <ProgressState status="focused">1</ProgressState>
          <ProgressState status="error">
            <i className="bi bi-x"></i>
          </ProgressState>
          <ProgressState status="completed">1</ProgressState>
        </div>
      </div>
    </div>
  </div>
);
