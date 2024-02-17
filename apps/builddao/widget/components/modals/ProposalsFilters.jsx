const { daos } = VM.require("buildhub.near/widget/fetch.daos") || { daos: [] };

if (!daos) {
  return "";
}
const options = daos.map((dao) => dao.contract_id);

const { Modal, Button } = VM.require("buildhub.near/widget/components") || {
  Modal: () => <></>,
  Button: () => <></>,
};

const showModal = props.showModal;
const toggleModal = props.toggleModal;
const toggle = props.toggle;
const bootstrapTheme = props.bootstrapTheme || "dark";
const parentSelectedTypes = props.parentSelectedTypes ?? [];
const parentSelectedStatus = props.parentSelectedStatus ?? [];
const applyFilters = props.applyFilters ?? (() => {});

if (!showModal) {
  return "";
}

const [selectedTypes, setSelectedTypes] = useState(parentSelectedTypes);
const [selectedStatus, setSelectedStatus] = useState(parentSelectedStatus);

const ThemeContainer =
  props.ThemeContainer ||
  styled.div`
    --primary-color: rgb(255, 175, 81);
  `;

const Wrapper = styled.div`
  .checked > span:first-child {
    background: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
  }

  .cbx:hover span:first-child {
    border-color: var(--primary-color) !important;
  }

  button[type="checkbox"]:hover {
    background: none !important;
  }
`;

const proposalTypeOptions = {
  Operations: [
    {
      title: "Transfer funds",
      value: "Transfer",
    },
    {
      title: "Voting proposal",
      value: "Vote",
    },
    {
      title: "Custom function",
      value: "FunctionCall",
    },
    {
      title: "Issue a new bounty",
      value: "AddBounty",
    },
    {
      title: "Request pay for bounty",
      value: "BountyDone",
    },
    {
      title: "Set staking contract",
      value: "SetStakingContract",
    },
    {
      title: "Text",
      value: "Text",
    },
  ],
  Policy: [
    {
      title: "Change Policy",
      value: "ChangePolicy",
    },
    {
      title: "Add or Update Role",
      value: "ChangePolicyAddOrUpdateRole",
    },
    {
      title: "Remove Role",
      value: "ChangePolicyRemoveRole",
    },
    {
      title: "ChangePolicyUpdateParameters",
      value: "ChangePolicyUpdateParameters",
    },
    {
      title: "ChangePolicyUpdateDefaultVotePolicy",
      value: "ChangePolicyUpdateDefaultVotePolicy",
    },
  ],
  "Membership & Config": [
    {
      title: "Add member to role",
      value: "AddMemberToRole",
    },
    {
      title: "Remove member from role",
      value: "RemoveMemberFromRole",
    },
    {
      title: "Change Config",
      value: "ChangeConfig",
    },
    {
      title: "Factory Info Update",
      value: "FactoryInfoUpdate",
    },
    {
      title: "Upgrade Remote",
      value: "UpgradeRemote",
    },
    {
      title: "Upgrade Self",
      value: "UpgradeSelf",
    },
  ],
};

const proposalStatusOptions = [
  {
    title: "Approved",
    value: "Approved",
  },
  {
    title: "Rejected",
    value: "Rejected",
  },
  {
    title: "In Progress",
    value: "InProgress",
  },
  {
    title: "Expired",
    value: "Expired",
  },
  {
    title: "Failed",
    value: "Failed",
  },
  {
    title: "Executed",
    value: "Executed",
  },
];

return (
  <ThemeContainer>
    <Modal
      open={showModal}
      title={"Filters"}
      onOpenChange={toggleModal}
      toggle={toggle}
    >
      <Wrapper>
        <h5 className="filter-title">Type</h5>
        <div className="d-flex flex-wrap">
          {Object.keys(proposalTypeOptions).map((key) => {
            return (
              <div className="d-flex flex-column gap-1">
                <b className="text-md mb-1">{key}</b>
                {proposalTypeOptions[key].map((item) => {
                  return (
                    <Widget
                      src="nearui.near/widget/Input.Checkbox"
                      props={{
                        checked: selectedTypes.includes(item.value) || false,
                        onChange: (checked) => {
                          setSelectedTypes(
                            checked
                              ? [...selectedTypes, item.value]
                              : selectedTypes.filter((x) => x !== item.value),
                          );
                        },
                        label: item.title,
                        id: item.value,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <h5 className="filter-title mt-4">Status</h5>
        <div className="d-flex flex-wrap">
          {proposalStatusOptions.map((item) => {
            return (
              <Widget
                src="nearui.near/widget/Input.Checkbox"
                props={{
                  checked: selectedStatus.includes(item.value) || false,
                  onChange: (checked) => {
                    setSelectedStatus(
                      checked
                        ? [...selectedStatus, item.value]
                        : selectedStatus.filter((x) => x !== item.value),
                    );
                  },
                  label: item.title,
                }}
              />
            );
          })}
        </div>
        <div className="d-flex justify-content-end mt-5 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStatus([]);
              setSelectedTypes([]);
              applyFilters({ selectedStatus: [], selectedTypes: [] });
              toggleModal();
            }}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              applyFilters({ selectedStatus, selectedTypes });
              toggleModal();
            }}
          >
            Apply
          </Button>
        </div>
      </Wrapper>
    </Modal>
  </ThemeContainer>
);
