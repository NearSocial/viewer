const { Button } = VM.require("buildhub.near/widget/components.button");
const { Pagination } = VM.require("buildhub.near/widget/components.pagination");
const { ProgressState } = VM.require(
  "buildhub.near/widget/components.progress-state"
);
const { Step } = VM.require("buildhub.near/widget/components.step");
const { InputField } = VM.require(
  "buildhub.near/widget/components.input-field"
);
const { PasswordField } = VM.require(
  "buildhub.near/widget/components.password-field"
);
const { Checkbox } = VM.require("buildhub.near/widget/components.checkbox");
const { TextBox } = VM.require("buildhub.near/widget/components.text-box");
const { TextEditor } = VM.require(
  "buildhub.near/widget/components.text-editor"
);

const Heading = styled.h2`
  color: white;
`;

const [value, setValue] = useState("");
const [password, setPassword] = useState("");
const [checked, setChecked] = useState(false);
const [textBox, setTextBox] = useState("");
const [textEditor, setTextEditor] = useState("");
const [showPassword, setShowPassword] = useState(false);

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
          <ProgressState status="error">1</ProgressState>
          <ProgressState status="completed">1</ProgressState>
        </div>
      </div>
      <div className="d-flex flex-column gap-3">
        <Heading>Step</Heading>
        <div className="d-flex flex-column gap-3">
          <Step totalSteps={5} currentStep={1} />
          <Step totalSteps={4} currentStep={2} />
          <Step totalSteps={3} currentStep={3} currentStatus={"error"} />
        </div>
      </div>
      <div className="d-flex flex-column gap-3">
        <Heading>Input Field</Heading>
        <div className="d-flex flex-column gap-3">
          <InputField
            label={"Label"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={"Placeholder"}
          />
          <PasswordField
            label={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Password"}
          />
          <Checkbox
            value={checked}
            onChange={() => setChecked(!checked)}
            label="Checkbox"
          />
          <TextBox
            label={"Label"}
            placeholder={"Placeholder"}
            value={textBox}
            onChange={(e) => setTextBox(e.target.value)}
          />
          <TextEditor
            value={textEditor}
            onChange={(e) => setTextEditor(e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);
