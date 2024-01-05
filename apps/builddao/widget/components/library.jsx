const { Button } = VM.require("buildhub.near/widget/components.button");
const { Pagination } = VM.require("buildhub.near/widget/components.pagination");
const { ProgressState } = VM.require(
  "buildhub.near/widget/components.progress-state"
);
const { Step } = VM.require("buildhub.near/widget/components.step");
const { InputField } = VM.require(
  "buildhub.near/widget/components.input-field"
);
const { Checkbox } = VM.require("buildhub.near/widget/components.checkbox");
const { TextBox } = VM.require("buildhub.near/widget/components.text-box");
const { TextEditor } = VM.require(
  "buildhub.near/widget/components.text-editor"
);

const { UploadField } = VM.require(
  "buildhub.near/widget/components.upload-field"
);
const { User } = VM.require("buildhub.near/widget/components.user");
const { Avatar } = VM.require("buildhub.near/widget/components.avatar");
const { Post } = VM.require("buildhub.near/widget/components.post");

const [checked, setChecked] = useState(false);

const Heading = styled.h2`
  color: white;
`;

return (
  <div className="container-xl">
    <div className="d-flex flex-column gap-3 mb-3">
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
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Pagination</Heading>
      <Pagination totalPages={4} selectedPage={1} />
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Progress State</Heading>
      <div className="d-flex align-items-center gap-3 mb-3">
        <ProgressState status="default">1</ProgressState>
        <ProgressState status="focused">1</ProgressState>
        <ProgressState status="error">1</ProgressState>
        <ProgressState status="completed">1</ProgressState>
      </div>
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Step</Heading>
      <div className="d-flex flex-column gap-3 mb-3">
        <Step totalSteps={5} currentStep={1} />
        <Step totalSteps={4} currentStep={2} />
        <Step totalSteps={3} currentStep={3} currentStatus={"error"} />
      </div>
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Input Field</Heading>
      <div className="d-flex flex-column gap-3 mb-3">
        <InputField
          key={"Input-Label"}
          label={"Label"}
          placeholder={"Placeholder"}
        />
        <InputField
          key={"Input-Password"}
          label={"Password"}
          placeholder={"Password"}
          type={"password"}
        />
        <Checkbox
          label="Checkbox"
          value={checked}
          onChange={(e) => setChecked(!checked)}
        />
        <TextBox label={"Label"} placeholder={"Placeholder"} />
        <TextEditor />
      </div>
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Upload Field</Heading>
      <div className="d-flex flex-column gap-3 mb-3">
        <UploadField />
        <UploadField background />
      </div>
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>User</Heading>
      <div className="d-flex flex-column gap-3 mb-3">
        <User
          accountId={"itexpert120-contra.near"}
          variant={"desktop"}
          isPremium={true}
          blockHeight={1231231231}
          hideMenu={true}
        />
        <User
          accountId={"build.sputnik-dao.near"}
          variant="mobile"
          blockHeight={"now"}
          pinned={true}
        />
      </div>
      <Heading>Avatar</Heading>
      <div className="d-flex flex-column gap-3 mb-3">
        <Avatar variant={"desktop"} />
        <Avatar variant={"mobile"} accountId={"build.sputnik-dao.near"} />
      </div>
    </div>
    <div className="d-flex flex-column gap-3 mb-3">
      <Heading>Post</Heading>
      <div className="d-flex flex-column gap-3">
        <Post
          accountId={"pichtran.near"}
          blockHeight={109572965}
          noBorder={true}
        />
        <Post
          accountId={"itexpert120-contra.near"}
          blockHeight={109609914}
          noBorder={true}
        />
      </div>
    </div>
  </div>
);
