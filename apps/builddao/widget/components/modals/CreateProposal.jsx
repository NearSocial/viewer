const { daos } = VM.require("buildhub.near/widget/fetch.daos") || { daos: [] };

if (!daos) {
  return "";
}
const options = daos.map((dao) => dao.contract_id);

const { Modal, Button, User } = VM.require(
  "buildhub.near/widget/components",
) || {
  Modal: () => <></>,
  Button: () => <></>,
  User: () => <></>,
};

const showModal = props.showModal;
const toggleModal = props.toggleModal;
const toggle = props.toggle;
const bootstrapTheme = props.bootstrapTheme || "dark";
const editorCSS = props.editorCSS;

if (!showModal) {
  return "";
}

const [selectedDAO, setSelectedDAO] = useState(
  props.daoId || "build.sputnik-dao.near",
);
const [daoName, setDAOName] = useState("");
const [selectedOption, setSelectedOption] = useState("");

useEffect(() => {
  const name = Social.get(`${selectedDAO}/profile/name`);
  setDAOName(name);
}, [selectedDAO]);

const policy = Near.view(selectedDAO, "get_policy") || { roles: [] };
const roles = policy.roles.map((item) => item.name) || [];

const StyledTypeahead = styled.div`
  input,
  input:focus,
  .rbt-input-hint {
    background: #212529;
    color: #fff;

    &::placeholder {
      color: #fff;
      opacity: 1; /* Firefox */
    }
    border: 1px solid #434950;
  }

  .rbt-input-hint {
    color: rgba(255, 255, 255, 0.2) !important;
  }

  .rbt-menu,
  .dropdown-item {
    background: #212529;
    color: #fff;
  }
`;

return (
  <Modal
    open={showModal}
    title={"Create Proposal"}
    onOpenChange={toggleModal}
    toggle={toggle}
    key={`${props.item.path}@${props.item.blockHeight}`}
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
      <label htmlFor="dao-selector">DAO Contract ID</label>
      <Typeahead
        id="dao-selector"
        options={options}
        onChange={(v) => {
          if (options.includes(v[0])) {
            setSelectedDAO(v[0]);
          }
        }}
        placeholder="Search DAO Contract ID"
        defaultSelected={[selectedDAO]}
      />
    </StyledTypeahead>

    <div className="mb-3">
      <label htmlFor="proposal-type">Proposal Type</label>
      <select
        name="proposal-type"
        id="proposal-type"
        data-bs-theme={bootstrapTheme}
        class="form-select"
        onChange={(e) => setSelectedOption(e.target.value)}
        value={selectedOption}
      >
        <option selected value="">
          Open this select menu
        </option>
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
          <Widget
            src="buildhub.near/widget/components.modals.propose.Text"
            props={{
              selectedDAO: selectedDAO,
              item: props.item,
              bootstrapTheme: bootstrapTheme,
              customCSS: editorCSS,
            }}
          />
        </>
      )}
      {selectedOption === "transfer" && (
        <>
          <Widget
            src="buildhub.near/widget/components.modals.propose.Transfer"
            props={{
              selectedDAO: selectedDAO,
              item: props.item,
              bootstrapTheme: bootstrapTheme,
              customCSS: editorCSS,
            }}
          />
        </>
      )}
      {selectedOption === "functionCall" && (
        <>
          <Widget
            src="buildhub.near/widget/components.modals.propose.FunctionCall"
            props={{
              selectedDAO: selectedDAO,
              item: props.item,
              bootstrapTheme: bootstrapTheme,
              customCSS: editorCSS,
            }}
          />
        </>
      )}
      {selectedOption === "addMember" && (
        <>
          <Widget
            src="buildhub.near/widget/components.modals.propose.AddMember"
            props={{
              roles: roles,
              selectedDAO: selectedDAO,
              item: props.item,
              bootstrapTheme: bootstrapTheme,
              customCSS: editorCSS,
            }}
          />
        </>
      )}
      {selectedOption === "removeMember" && (
        <>
          <Widget
            src="buildhub.near/widget/components.modals.propose.RemoveMember"
            props={{
              roles: roles,
              selectedDAO: selectedDAO,
              item: props.item,
              bootstrapTheme: bootstrapTheme,
              customCSS: editorCSS,
            }}
          />
        </>
      )}
    </div>
  </Modal>
);
