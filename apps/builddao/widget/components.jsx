const StyledButton = styled.button`
  all: unset;
  display: inline-flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font: 500 14px / normal;
  transition: all 300ms;

  ${(props) =>
    props.type === "icon" &&
    `
    display: flex;
    width: 40px;
    height: 40px;
    padding: 5px;
    flex-shrink: 0;
    border-radius: 50%;
  `}

  /* Colors based on variant prop */
  background: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "#FFAF51";
      case "outline":
        return "transparent";
      default:
        return "#23242B";
    }
  }};

  color: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "#000";
      case "outline":
        return "#fff";
      default:
        return "#CDD0D5";
    }
  }};

  border: ${(props) =>
    props.variant === "outline" ? "1px solid rgba(255, 255, 255, 0.20)" : ""};

  /* Hover states */
  &:hover {
    background: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "#e49b48";
        case "outline":
          return "rgba(255, 255, 255, 0.20)";
        default:
          return "#17181c";
      }
    }};
  }
`;

function Button({ id, children, variant, type, onClick, className, style }) {
  return (
    <StyledButton
      id={id}
      key={`Button-${type ?? "Normal"}-${variant ?? "Default"}`}
      className={className}
      variant={variant}
      type={type}
      style={style}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

function Pagination({
  totalPages,
  maxVisiblePages,
  onPageClick,
  selectedPage,
}) {
  return (
    <Widget
      src="buildhub.near/widget/components.Pagination"
      props={{
        totalPages,
        maxVisiblePages,
        onPageClick,
        selectedPage,
      }}
    />
  );
}

function Post(props) {
  return (
    <Widget src={"buildhub.near/widget/components.Post"} props={{ ...props }} />
  );
}

const Progress = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 50%;
  border: ${(props) => {
    switch (props.status) {
      case "focused":
        return "1px solid var(--Yellow, #FFAF51)";
      case "error":
        return "1px solid var(--System-Red, #FD2A5C)";
      case "completed":
        return "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))";
      default:
        return "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))";
    }
  }};

  background: ${(props) => {
    switch (props.status) {
      case "focused":
        return "#2f2619";
      case "error":
        return "#2f101f";
      case "completed":
        return "#FFAF51";
      default:
        return "#23242B";
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case "focused":
        return "#fff";
      case "error":
        return "#FD2A5C";
      case "completed":
        return "#000";
      default:
        return "#fff";
    }
  }};
`;

function ProgressState({ children, status }) {
  return (
    <Progress
      status={status}
      key={`ProgressState-${status ?? "default"}-${children}`}
    >
      {status === "completed" ? (
        <i className="bi bi-check"></i>
      ) : status === "error" ? (
        <i className="bi bi-x"></i>
      ) : (
        children
      )}
    </Progress>
  );
}

function Step(props) {
  const totalSteps = props.totalSteps ?? 5;
  const currentStep = props.currentStep ?? 3;
  const currentStatus = props.currentStatus ? props.currentStatus : "focused";

  const StepContainer = styled.div`
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #000; /* Change color as needed */
      background-image: repeating-linear-gradient(
        90deg,
        #3c3d43,
        #3c3d43 2px,
        transparent 2px,
        transparent 4px
      );
      transform: translateY(-50%);
      z-index: -1;
    }
  `;

  return (
    <StepContainer
      className="d-flex align-items-center justify-content-between"
      style={{ maxWidth: "360px" }}
      key={`Step-${currentStep}-${currentStatus ?? "default"}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <ProgressState
          className="z-1"
          status={
            i + 1 === currentStep
              ? currentStatus
              : currentStep > i + 1
              ? "completed"
              : "default"
          }
        >
          {i + 1}
        </ProgressState>
      ))}
    </StepContainer>
  );
}

const InputContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Label = styled.label`
  color: var(--White-100, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const Input = styled.input`
  display: flex;
  max-width: ${(props) => props.maxWidth ?? "390px"};
  width: 100%;
  padding: 16px 12px;
  align-items: flex-start;
  gap: 10px;

  border-radius: 8px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--Bg-1, #0b0c14);

  flex: 1 0 0;

  color: var(--White-50, #cdd0d5);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function InputField({
  type,
  label,
  key,
  placeholder,
  value,
  onChange,
  maxWidth,
}) {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <Input
        key={key}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type ?? "text"}
        maxWidth={maxWidth}
      />
    </InputContainer>
  );
}

const UploadContainer = styled.div`
  display: flex;
  max-width: 390px;
  min-height: 200px;
  width: 100%;
  height: 100%;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  border-radius: 16px;
  border: 1px dashed var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: ${(props) => (props.background ? "#23242B" : "#0b0c14")};

  p {
    color: var(--White-100, #fff);
    text-align: center;

    /* Body/Medium-16px */
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0;
  }

  p.secondary {
    color: var(--White-50, #cdd0d5);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
  }

  i {
    color: white;
    font-size: 2rem;
  }
`;

function UploadField({ background }) {
  return (
    <UploadContainer background={background}>
      <i class="bi bi-cloud-upload"></i>
      <div className="d-flex flex-column gap-2">
        <p>Choose a file or drag & drop it here.</p>
        <p className="secondary">
          JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
        </p>
      </div>
      <Button variant="outline" style={{ background: background && "#23242b" }}>
        Browse Files
      </Button>
    </UploadContainer>
  );
}

const TextArea = styled.textarea`
  display: flex;
  min-height: 100px;
  padding: 16px 12px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--Bg-1, #0b0c14);

  color: var(--White-50, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function TextBox({ label, value, onChange, placeholder, maxWidth }) {
  return (
    <div
      className="d-flex flex-column gap-1 w-100"
      style={{ maxWidth: maxWidth ? maxWidth : "550px" }}
    >
      <Label>{label}</Label>
      <TextArea placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

const TextareaWrapper = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;

  textarea {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  textarea::placeholder {
    padding-top: 4px;
    font-size: 20px;
  }

  textarea:focus::placeholder {
    font-size: inherit;
    padding-top: 0px;
  }

  &::after,
  textarea,
  iframe {
    width: 100%;
    min-width: 1em;
    height: unset;
    min-height: 3em;
    font: inherit;
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: 0px solid #eee;
    grid-area: 1 / 1;
    overflow: hidden;
    outline: none;
  }

  iframe {
    padding: 0;
  }

  textarea:focus,
  textarea:not(:empty) {
    border-bottom: 1px solid #eee;
    min-height: 5em;
  }

  &::after {
    content: attr(data-value) " ";
    visibility: hidden;
    white-space: pre-wrap;
  }
  &.markdown-editor::after {
    padding-top: 66px;
    font-family: monospace;
    font-size: 14px;
  }
`;

const MarkdownEditor = `
  html {
    background: #0b0c14;
  }
  
  * {
    border: none !important;
  }

  .rc-md-editor {
    background: #3c3d43;
    border-top: 1px solid #3c3d43 !important; 
    border-radius: 8px;
  }

  .editor-container {
    background: #3c3d43;
  }
  
  .drop-wrap {
    top: -110px !important;
    border-radius: 0.5rem !important;
  }

  .header-list {
    display: flex;
    align-items: center;
  }

  textarea {
    background: #0b0c14 !important;
    color: #fff !important;

    font-family: sans-serif !important;
    font-size: 1rem;

    border: 1px solid #3c3d43 !important;
    border-top: 0 !important;
    border-radius: 0 0 8px 8px;
  }

  .rc-md-navigation {
    background: #0b0c14 !important;
    border: 1px solid #3c3d43 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
    border-radius: 8px 8px 0 0;
  
    i {
      color: #cdd0d5;
    }
  }

  .editor-container {
    border-radius: 0 0 8px 8px;
  }

  .rc-md-editor .editor-container .sec-md .input {
    overflow-y: auto;
    padding: 8px !important;
    line-height: normal;
    border-radius: 0 0 8px 8px;
  }
`;

function TextEditor({ value, onChange, maxWidth }) {
  return (
    <TextareaWrapper
      className="markdown-editor"
      data-value={value || ""}
      style={{ maxWidth: maxWidth ? maxWidth : "550px" }}
    >
      <Widget
        src="mob.near/widget/MarkdownEditorIframe"
        props={{
          initialText: value,
          embedCss: MarkdownEditor,
          onChange,
        }}
      />
    </TextareaWrapper>
  );
}

const CheckboxInput = styled.input`
  display: none;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  padding: 12px;
  align-items: center;
  gap: 8px;

  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function Checkbox({ value, onChange, label }) {
  return (
    <div key={`Checkbox-${label ?? "No-label"}`}>
      <CheckboxLabel>
        <CheckboxInput type="checkbox" checked={value} onChange={onChange} />
        {value ? (
          <i className="bi bi-check-square"></i>
        ) : (
          <i className="bi bi-square"></i>
        )}
        {label}
      </CheckboxLabel>
    </div>
  );
}

const ImageWrapper = styled.div`
  img {
    width: ${(props) =>
      props.variant === "mobile" ? "40px" : "52px"} !important;
    height: ${(props) =>
      props.variant === "mobile" ? "40px" : "52px"} !important;
    flex-shrink: 0 !important;
    border-radius: 100px !important;
    background: lightgray 50% / cover no-repeat !important;
  }

  .profile-image {
    width: auto !important;
    height: auto !important;
  }

  @media screen and (max-width: 768px) {
    ${(props) =>
      !props.variant &&
      `
      img {
        width: 40px !important;
        height: 40px !important;
      }
    `}
  }
`;

function Avatar(props) {
  const accountId = props.accountId ?? context.accountId;

  return (
    <ImageWrapper variant={props.variant}>
      <Widget src="mob.near/widget/ProfileImage" props={{ accountId }} />
    </ImageWrapper>
  );
}

function User(props) {
  return (
    <Widget
      src="buildhub.near/widget/components.User"
      props={{ ...props }}
    />
  );
}

return {
  Button,
  Pagination,
  Post,
  ProgressState,
  Step,
  InputField,
  UploadField,
  TextBox,
  TextEditor,
  Checkbox,
  Avatar,
  User
};
