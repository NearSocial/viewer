const { Button } = VM.require("buildhub.near/widget/components.button");

return (
  <div className="d-flex flex-column gap-3">
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
  </div>
);
