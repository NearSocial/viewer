/**
 * TODO: This should be more generalized.
 * Currently only supports embed plugins
 */
const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const TabContent = styled.div`
  margin-top: 1rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
`;

const Select = styled.select`
  padding: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [widgetSrc, setWidgetSrc] = useState("");
const [embedSrc, setEmbedSrc] = useState("");
const [activeTab, setActiveTab] = useState("data");

function generateUID() {
  const maxHex = 0xffffffff;
  const randomNumber = Math.floor(Math.random() * maxHex);
  return randomNumber.toString(16).padStart(8, "0");
}

const handleCreate = () => {
  Social.set({
    plugin: {
      embed: {
        [generateUID()]: {
          "": JSON.stringify({ widgetSrc, embedSrc }),
          metadata: {
            name,
            description,
            widgetSrc, // TODO: Hack.
          },
        },
      },
    },
  });
};

return (
  <Wrapper>
    <h3>create embed plugin</h3>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          Data
        </a>
      </li>
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === "metadata" ? "active" : ""}`}
          onClick={() => setActiveTab("metadata")}
        >
          Metadata
        </a>
      </li>
    </ul>

    <TabContent>
      {activeTab === "data" && (
        <Form>
          <FormGroup>
            <Label>widget source</Label>
            <Input
              type="text"
              value={widgetSrc}
              onChange={(e) => setWidgetSrc(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>embed source</Label>
            <Input
              type="text"
              value={embedSrc}
              onChange={(e) => setEmbedSrc(e.target.value)}
            />
          </FormGroup>
        </Form>
      )}
    </TabContent>
    <TabContent>
      {activeTab === "metadata" && (
        <Form>
          <FormGroup>
            <Label>name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>description</Label>
            <textarea
              className="form-control mb-3"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
        </Form>
      )}
    </TabContent>
    <FormGroup>
      <button className="btn btn-success mb-1" onClick={handleCreate}>
        Create
      </button>
    </FormGroup>
  </Wrapper>
);
