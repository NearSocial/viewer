const { daos } = VM.require("buildhub.near/widget/fetch.daos");
const { Modal, Button, User } = VM.require("buildhub.near/widget/components");

const [selectedDAO, setSelectedDAO] = useState(
  props.daoId || "build.sputnik-dao.near"
);
const [daoName, setDAOName] = useState("");
const [selectedOption, setSelectedOption] = useState("");
const [text, setText] = useState("");

const options = daos.map((dao) => dao.contract_id);

useEffect(() => {
  const name = Social.get(`${selectedDAO}/profile/name`);
  setDAOName(name);
}, [selectedDAO]);

const [editorKey, setEditorKey] = useState(0);
const memoizedKey = useMemo((editorKey) => editorKey, [editorKey]);

useEffect(() => {
  const { path, blockHeight } = props.item;
  setText(`[EMBED](${path}@${blockHeight})`);
  setEditorKey((editorKey) => editorKey + 1);
}, [props.item]);

const StyledTypeahead = styled.div`
  input,
  input:focus,
  .rbt-input-hint {
    background: #23242b;
    color: #fff;

    &::placeholder {
      color: #fff;
      opacity: 1; /* Firefox */
    }
  }

  .rbt-menu,
  .dropdown-item {
    background: #23242b;
    color: #fff;
  }
`;

const MarkdownEditor = `
  html {
    background: #23242b;
  }

  * {
    border: none !important;
  }

  .rc-md-editor {
    background: #4f5055;
    border-top: 1px solid #4f5055 !important;
    border-radius: 8px;
  }

  .editor-container {
    background: #4f5055;
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
    background: #23242b !important;
    color: #fff !important;

    font-family: sans-serif !important;
    font-size: 1rem;

    border: 1px solid #4f5055 !important;
    border-top: 0 !important;
    border-radius: 0 0 8px 8px;
  }

  .rc-md-navigation {
    background: #23242b !important;
    border: 1px solid #4f5055 !important;
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

const TextareaWrapper = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;
  width: 100%;

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

const showModal = props.showModal;
const toggleModal = props.toggleModal;
const toggle = props.toggle;

return (
  <Modal
    open={showModal}
    title={"Create Proposal"}
    onOpenChange={toggleModal}
    toggle={toggle}
    style={{ zIndex: 9999 }}
  >
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex flex-column align-items-start">
        <p>DAO</p>
        <User
          accountId={selectedDAO}
          name={daoName}
          showTime={false}
          hideMenu={true}
        />
      </div>
      <div className="d-flex flex-column align-items-start">
        <p>Proposer</p>
        <User accountId={context.accountId} showTime={false} hideMenu={true} />
      </div>
    </div>

    <StyledTypeahead className="mb-3">
      <Typeahead
        options={options}
        onChange={(v) => setSelectedDAO(v)}
        placeholder="Search DAO Contract ID"
        defaultSelected={
          selectedDAO !== "testdao.near" ? selectedDAO : undefined
        }
      />
    </StyledTypeahead>

    <div className="mb-3">
      <label htmlFor="proposal-type">Proposal Type</label>
      <select
        name="proposal-type"
        id="proposal-type"
        data-bs-theme="dark"
        class="form-select"
        aria-label="Default select example"
        onChange={(e) => setSelectedOption(e.target.value)}
        selected={selectedOption}
      >
        <option selected>Open this select menu</option>
        <option value="text">Text</option>
        <option value="transfer">Transfer</option>
        <option value="functionCall">Function Call</option>
        <option value="addMember">Add Member To Role</option>
        <option value="removeMember">Remove Member From Role</option>
      </select>
    </div>

    <div className="mb-3">
      {selectedOption === "text" && (
        <>
          <label>Proposal Description</label>
          <TextareaWrapper
            className="markdown-editor mb-3"
            data-value={text || ""}
            key={memoizedKey}
          >
            <Widget
              src="mob.near/widget/MarkdownEditorIframe"
              props={{
                initialText: text,
                embedCss: MarkdownEditor,
                onChange: (v) => {
                  setText(v);
                },
              }}
            />
          </TextareaWrapper>
          <div className="w-100">
            <Button
              className="ms-auto"
              variant="primary"
              onClick={() =>
                Near.call(selectedDAO, "add_proposal", {
                  proposal: {
                    description: text,
                    kind: "Vote",
                  },
                })
              }
            >
              Next
            </Button>
          </div>
        </>
      )}
      {selectedOption === "transfer" && "transfer"}
      {selectedOption === "functionCall" && "functionCall"}
      {selectedOption === "addMember" && "addMember"}
      {selectedOption === "removeMember" && "removeMember"}
    </div>
  </Modal>
);
