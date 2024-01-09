const {
  Button,
  Pagination,
  ProgressState,
  Step,
  Post,
  InputField,
  UploadField,
  TextBox,
  TextEditor,
  User,
  Avatar,
  Checkbox,
} = VM.require("buildhub.near/widget/components");

// states
const [checked, setChecked] = useState(false);

const ButtonPreview = (
  <div>
    <div className="d-flex align-items-center gap-3 mb-3">
      <Button>Normal</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
    <div className="d-flex align-items-center gap-3 mb-3">
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
    <div className="d-flex align-items-center gap-3 mb-3">
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

const components = [
  {
    name: "Button",
    category: "Buttons/Navigation",
    widgetSrc: "buildhub.near/widget/components",
    description:
      "Button component with three different variants, and icon support.",
    requiredProps: {
      children: "Button Text",
      onClick: "Callback function to handle button click",
    },
    optionalProps: {
      id: "ID of the button",
      variant: "Variant of the button (default, primary, outline)",
      type: "Type of the button (normal, icon)",
      className: "Additional classnames for button",
      style: "Additional styles for button",
    },
    preview: ButtonPreview,
    embedCode: `
  const { Button } = VM.require("buildhub.near/widget/components");

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-3">
        <Button>Normal</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="d-flex align-items-center gap-3 mb-3">
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
      <div className="d-flex align-items-center gap-3 mb-3">
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
  );`,
  },
  {
    name: "Pagination",
    category: "Buttons/Navigation",
    widgetSrc: "buildhub.near/widget/components",
    description: "Pagination component for page switching.",
    requiredProps: {
      totalPages: "Total pages",
      selectedPage: "Selected page number",
      onPageClick: "Callback function to handle button click",
    },
    optionalProps: {
      maxVisiblePages: "Max visible pages at once (default: 4)",
    },
    preview: <Pagination totalPages={4} selectedPage={1} />,
    embedCode: `
  const { Pagination } = VM.require("buildhub.near/widget/components.

  return (
    <Pagination totalPages={4} selectedPage={1} />
  );`,
  },
  {
    name: "Progress State",
    category: "Buttons/Navigation",
    widgetSrc: "buildhub.near/widget/components",
    description: "Progress state for step component.",
    requiredProps: {
      children: "Children to render",
      status: "Status of the step (default, active, completed, error)",
    },
    preview: (
      <>
        {/* <div className="d-flex align-items-center gap-3 mb-3">
          <ProgressState status="default">1</ProgressState>
          <ProgressState status="focused">1</ProgressState>
          <ProgressState status="error">1</ProgressState>
          <ProgressState status="completed">1</ProgressState>
        </div> */}
      </>
    ),
    embedCode: `
  const { ProgressState } = VM.require("buildhub.near/widget/components");

  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <ProgressState status="default">1</ProgressState>
      <ProgressState status="focused">1</ProgressState>
      <ProgressState status="error">1</ProgressState>
      <ProgressState status="completed">1</ProgressState>
    </div>
  );`,
  },
  {
    name: "Step",
    category: "Buttons/Navigation",
    widgetSrc: "buildhub.near/widget/components",
    description: "Step component to show progress between steps.",
    requiredProps: {
      totalSteps: "Total number of steps",
      currentStep: "Current step number",
    },
    optionalProps: {
      currentStatus:
        "Status of the current step (default, active, completed, error)",
    },
    preview: (
      <>
        <div className="d-flex flex-column gap-3 mb-3">
          <Step totalSteps={5} currentStep={1} />
          <Step totalSteps={4} currentStep={2} />
          <Step totalSteps={3} currentStep={3} currentStatus={"error"} />
        </div>
      </>
    ),
    embedCode: `
  const { Step } = VM.require("buildhub.near/widget/components");

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <Step totalSteps={5} currentStep={1} />
      <Step totalSteps={4} currentStep={2} />
      <Step totalSteps={3} currentStep={3} currentStatus={"error"} />
    </div>
  );`,
  },
  {
    name: "Input Field",
    category: "Fields",
    widgetSrc: "buildhub.near/widget/components",
    description: "Input field for text input",
    requiredProps: {
      value: "Current Value of input",
      onChange: "Callback function to handle input change",
    },
    optionalProps: {
      label: "Label for input",
      type: "Type of input field",
      key: "Key for input field",
      placeholder: "Placeholder text",
      maxWidth: "Max width for input field",
    },
    preview: (
      <>
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
        </div>
      </>
    ),
    embedCode: `
  const { InputField } = VM.require("buildhub.near/widget/components");

  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <InputField
      key={"Input-Label"}
      label={"Label"}
      placeholder={"Placeholder"}
      value={value}
      onChange={(e) => setValue(e. target.value)}
      />
      <InputField
        key={"Input-Password"}
        label={"Password"}
        placeholder={"Password"}
        type={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );`,
  },
  {
    name: "Checkbox",
    category: "Fields",
    widgetSrc: "buildhub.near/widget/components",
    description: "Checkbox input for toggles",
    requiredProps: {
      value: "Current Value of checkbox",
      onChange: "Callback function to handle input change",
    },
    optionalProps: {
      label: "Label for checkbox",
    },
    preview: (
      <>
        <div className="d-flex flex-column gap-3 mb-3">
          <Checkbox label="Checkbox" />
        </div>
      </>
    ),
    embedCode: `
  const { Checkbox } = VM.require("buildhub.near/widget/components");

  const [checked, setChecked] = useState(false);

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <Checkbox
        label="Checkbox"
        value={checked}
        onChange={(e) => setChecked(!checked)}
      />
    </div>
  );`,
  },
  {
    name: "Textbox",
    category: "Fields",
    widgetSrc: "buildhub.near/widget/components",
    description: "Textbox for text input",
    requiredProps: {
      value: "Current Value of text box",
      onChange: "Callback function to handle input change",
    },
    optionalProps: {
      label: "Label for text box",
    },
    preview: (
      <>
        <TextBox label={"Label"} placeholder={"Placeholder"} />
      </>
    ),
    embedCode: `
  const { TextBox } = VM.require("buildhub.near/widget/components");

  const [value, setValue] = useState("");

  return (
    <div>
      <TextBox
        label={"Label"}
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        placeholder={"Placeholder"}
      />
    </div>
  );`,
  },
  {
    name: "Text Editor",
    category: "Fields",
    widgetSrc: "buildhub.near/widget/components",
    description: "Text editor for markdown input",
    requiredProps: {
      value: "Current Value of checkbox",
      onChange: "Callback function to handle input change",
    },
    optionalProps: {
      maxWidth: "Max width of text editor",
    },
    preview: (
      <>
        <TextEditor />
      </>
    ),
    embedCode: `
  const { TextEditor } = VM.require("buildhub.near/widget/components");

  const [value, setValue] = useState("");

  return (
    <div>
      <TextEditor
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    </div>
  );`,
  },
  {
    name: "Upload Field",
    category: "Fields",
    widgetSrc: "buildhub.near/widget/components",
    description: "Component for file uploads",
    optionalProps: {
      background: "Background color of upload filed (default true)",
    },
    preview: (
      <div className="d-flex flex-column gap-3 mb-3">
        <UploadField />
        <UploadField background />
      </div>
    ),
    embedCode: `
  const { UploadField } = VM.require("buildhub.near/widget/components");

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <UploadField />
      <UploadField background />
    </div>
  );`,
  },
  {
    name: "Post",
    category: "Modals",
    widgetSrc: "buildhub.near/widget/components",
    description: "Post preview component",
    requiredProps: {
      accountId: "AccountId of post creator",
      blockHeight: "Block height of post",
    },
    optionalProps: {
      hideBorder: "Hide bottom border",
      pinned: "Toggle pinned post",
      hideMenu: "Hide menu",
      hideButtons: "Hide bottom buttons",
      content: "Content to be shown",
      subscribe: "",
      raw: "Show raw MD",
      groupId: "Group ID for post",
      indexKey: "Index key for post",
      permissions: "Permissions for post",
      fullPostLink: "Link to full post",
    },
    preview: (
      <div className="d-flex flex-column gap-3 mb-3">
        <Post
          accountId={"itexpert120-contra.near"}
          blockHeight={109609914}
          noBorder={true}
        />
      </div>
    ),
    embedCode: `
  const { Post } = VM.require("buildhub.near/widget/components");

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <Post
        accountId={"itexpert120-contra.near"}
        blockHeight={109609914}
        noBorder={true}
      />
    </div>
  );`,
  },
  {
    name: "User",
    category: "Avatars/Users",
    widgetSrc: "buildhub.near/widget/components",
    description: "User component for user profile",
    requiredProps: {
      accountId: "AccountId of post creator",
      blockHeight: "Block height of post",
    },
    optionalProps: {
      variant: "Variant of user component (desktop, mobile)",
      pinned: "Toggle pinned post",
      hideMenu: "Hide menu",
      postType: "Post type",
      link: "Post link",
      isPremium: "Show badge for premium users",
    },
    preview: (
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
    ),
    embedCode: `
  const { User } = VM.require("buildhub.near/widget/components");

  return (
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
  );`,
  },
  {
    name: "Avatar",
    category: "Avatars/Users",
    widgetSrc: "buildhub.near/widget/components",
    description: "Show user avatar",
    requiredProps: {
      accountId: "AccountId of post creator",
    },
    optionalProps: {
      variant: "Variant of user component (desktop, mobile)",
    },
    preview: (
      <div className="d-flex flex-column gap-3 mb-3">
        <Avatar variant={"desktop"} />
        <Avatar variant={"mobile"} accountId={"build.sputnik-dao.near"} />
      </div>
    ),
    embedCode: `
  const { Avatar } = VM.require("buildhub.near/widget/components");

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <Avatar variant={"desktop"} />
      <Avatar variant={"mobile"} accountId={"build.sputnik-dao.near"} />
    </div>
  );`,
  },
];

const renderProps = (props, optional) => {
  return Object.entries(props || {}).map(([key, desc]) => {
    return (
      <tr key={key}>
        <td>
          <span className={`code prop-key${optional ? " optional" : ""}`}>
            {key}
          </span>
        </td>
        <td className="prop-desc">
          <Markdown text={desc} />
        </td>
      </tr>
    );
  });
};

const renderComponent = (component, index) => {
  const id = component.name.toLowerCase().replace(" ", "-");
  return (
    <div className="component">
      <div className="anchor" id={id}>
        <a href={`#${id}`}>
          <h2>{component.name}</h2>
        </a>
        <p>{component.description}</p>
        <h3>Preview</h3>
        {component.preview}
        <h3>Component</h3>
        <div className="d-flex flex-row flex-wrap justify-content-between mb-3">
          <div className="path font-monospace">
            <Widget
              src="mob.near/widget/CopyButton"
              props={{
                text: component.widgetSrc,
                label: component.widgetSrc,
              }}
            />
          </div>
          <div className="source">
            <a
              href={`/mob.near/widget/WidgetSource?src=${component.widgetSrc}`}
              target="_blank"
              className="btn btn-outline-primary border-0"
            >
              Source
            </a>
          </div>
        </div>
        <h3>Props</h3>
        <table className="props table table-bordered mb-3">
          <thead>
            <tr>
              <th>Key</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {renderProps(component.requiredProps)}
            {renderProps(component.optionalProps, true)}
          </tbody>
        </table>
        <h3>Example</h3>
        <div className="embed-code">
          <Markdown text={`\`\`\`jsx\n${component.embedCode}\n\`\`\``} />
          <div className="embed-copy">
            <Widget
              src="mob.near/widget/CopyButton"
              props={{
                text: component.embedCode,
                className: "btn btn-outline-light",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  h2,
  h3,
  label,
  p {
    color: white;
  }

  .component {
    padding: 0.5em 12px;
    padding-bottom: 0;
    margin-bottom: 3em;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    table,
    th,
    td {
      background: #0b0c13;
      color: #fff;
    }

    label {
      font-size: 20px;
    }

    .code {
      display: inline-flex;
      line-height: normal;
      border-radius: 0.3em;
      padding: 0 4px;
      border: 1px solid #ddd;
      background: rgba(0, 0, 0, 0.03);
      font-family: var(--bs-font-monospace);
    }
    .path {
    }
    .preview {
      background-color: white;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 12px;
      pre {
        margin-bottom: 0;
      }
    }
    .props {
      .prop-key {
        background: #f7f7f7;
        border: 1px solid #dddddd;
        color: black;
        border-radius: 8px;
        padding: 2px 4px;
        font-weight: 600;

        &.optional {
          font-weight: 400;
        }
      }
      .prop-desc {
        p {
          margin-bottom: 0;
          color: white;
        }
      }
    }
    .embed-code {
      position: relative;

      .embed-copy {
        position: absolute;
        top: 18px;
        right: 10px;
      }
    }
  }
`;

const renderMenuItem = (c, i) => {
  const prev = i ? components[i - 1] : null;
  const res = [];
  if (!prev || prev.category !== c.category) {
    res.push(
      <h5 className="category my-3 mb-2 text-white" key={c.category}>
        {c.category}
      </h5>
    );
  }
  const id = c.name.toLowerCase().replaceAll(" ", "-");
  res.push(
    <div className="menu-item" key={i}>
      <a href={`#${id}`}>{c.name}</a>
    </div>
  );
  return res;
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  .main {
    grid-column: span 4 / span 4;
  }

  .aside {
    grid-column: span 1 / span 1;
  }

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

return (
  <Grid className="container-xl">
    <div className="aside">
      {components.map((component, index) => renderMenuItem(component, index))}
    </div>
    <Wrapper className="main">
      {components.map((component, index) => renderComponent(component, index))}
    </Wrapper>
  </Grid>
);
