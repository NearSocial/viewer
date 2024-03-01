const { Button, Modal } = VM.require("buildhub.near/widget/components") || {
  Button: <></>,
  Modal: <></>,
};
const DaoSDK = VM.require("sdks.near/widget/SDKs.Sputnik.DaoSDK") || (() => {});

if (!DaoSDK) {
  return <></>;
}

const NotificationModalContainer = styled.div`
  .pb-4 {
    padding-bottom: 0px !important;
  }
`;

const resPerPage = 10;
const daoId = props.daoId ?? "build.sputnik-dao.near";
const proposalId = props.proposalId ?? null;
const sdk = DaoSDK(daoId);
const [currentPage, setCurrentPage] = useState(0);
const accountId = context.accountId;

const [showProposalModal, setShowModal] = useState(false);
const [showNotificationModal, setNotificationModal] = useState(false);
const [voteDetails, setVoteDetails] = useState(null);
const [showCreateProposalModal, setShowCreateProposalModal] = useState(false);
const [showFiltersModal, setFiltersModal] = useState(false);

const [selectedTypes, setSelectedTypes] = useState([]);
const [selectedStatus, setSelectedStatus] = useState([]);
const [proposals, setProposals] = useState([]);
const [filteredProposals, setFilteredProposals] = useState([]);
const [filteredLength, setFilteredLength] = useState(null);

const lastProposalId = sdk.getLastProposalId();
const reversedProposals = proposalId
  ? [
      sdk.getProposalById({
        proposalId,
      }),
    ] || []
  : sdk.getProposals({
      offset:
        currentPage === 0
          ? lastProposalId > resPerPage
            ? lastProposalId - resPerPage
            : 0
          : lastProposalId - currentPage * resPerPage,
      limit: resPerPage,
    }) || [];

setProposals(reversedProposals.reverse());

const PaginationThemeContainer = props.PaginationThemeContainer;

const ThemeContainer =
  props.ThemeContainer ||
  styled.div`
    --primary-bg-color: #23242b;
    --secondary-bg-color: #ffffff1a;
    --primary-border-color: #fff;
    --primary-text-color: #ffffff;
    --secondary-text-color: #b0b0b0;
    --primary-btn-bg-color: #eca227;
    --primary-btn-text-color: #000;
    --approve-bg-color: #82e299;
    --reject-bg-color: #c23f38;
    --spam-bg-color: #f5c518;
    --vote-button-color: #ffffff;
    --success-badge-bg-color: #38c7931a;
    --success-badge-text-color: #38c793;
    --primary-badge-bg-color: #eca22733;
    --primary-badge-text-color: #eca227;
    --info-badge-bg-color: #51b6ff33;
    --info-badge-text-color: #51b6ff;
    --danger-badge-bg-color: #fd2a5c1a;
    --danger-badge-text-color: #fd2a5c;
    --black-badge-bg-color: #ffffff1a;
    --black-badge-text-color: #fff;
  `;

const Container = styled.div`
  .ndc-card {
    border: none;
    background-color: var(--primary-bg-color);
    color: var(--primary-text-color) !important;
    padding: 2rem;
  }
`;

const NotificationModal = () => {
  return (
    <NotificationModalContainer>
      <Modal
        open={showNotificationModal}
        title={"Send Notification"}
        onOpenChange={() => {}}
        hideCloseBtn={true}
      >
        <div className="ndc-card d-flex flex-column gap-3 p-4">
          Do you want to notify proposer: {proposer} about the vote?
          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="outline danger"
              onClick={() => {
                handleVote({
                  action: voteDetails.action,
                  daoId,
                  proposalId: voteDetails.proposalId,
                  proposer: voteDetails.proposer,
                  showNotification: false,
                });
                setNotificationModal(false);
              }}
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleVote({
                  action: voteDetails.action,
                  daoId,
                  proposalId: voteDetails.proposalId,
                  proposer: voteDetails.proposer,
                  showNotification: true,
                });
                setNotificationModal(false);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </NotificationModalContainer>
  );
};

const handleVote = ({ action, proposalId, proposer, showNotification }) => {
  const customAction = action.replace("Vote", "");
  const notification = {
    [accountId]: {
      index: {
        notify: JSON.stringify([
          {
            key: proposer,
            value: {
              message: `${accountId} voted to ${customAction} your proposal for ${daoId} (Proposal ID: ${proposalId})`,
              params: {
                daoId: daoId,
                proposalId: proposalId,
              },
              type: "custom",
              widget: "buildhub.near/widget/Proposals",
            },
          },
        ]),
      },
    },
  };

  sdk.actProposal({
    proposalId,
    action,
    gas: 200000000000000,
    additionalCalls: showNotification
      ? [
          {
            contractName: "social.near",
            methodName: "set",
            args: {
              data: notification,
              options: { refund_unused_deposit: true },
            },
            deposit: 100000000000000000000000,
          },
        ]
      : null,
  });
};

const policy = sdk.getPolicy();
const proposalKinds = sdk.proposalKinds;
const actions = sdk.voteActions;
const userRoles = [];
if (Array.isArray(policy.roles)) {
  for (const role of policy.roles) {
    if (role.kind === "Everyone") {
      userRoles.push(role);
      continue;
    }
    if (!role.kind.Group) continue;
    if (accountId && role.kind.Group && role.kind.Group.includes(accountId)) {
      userRoles.push(role);
    }
  }
}

const proposalPeriod = policy.proposal_period;

useEffect(() => {
  if (selectedStatus.length > 0 || selectedTypes.length > 0) {
    const offset =
      currentPage === 0
        ? lastProposalId > resPerPage
          ? lastProposalId - resPerPage
          : lastProposalId ?? resPerPage
        : filteredProposals[0].id - currentPage * resPerPage;

    sdk
      .getFilteredProposalsByStatusAndkind({
        resPerPage,
        reverse: true,
        filterStatusArray: selectedStatus,
        filterKindArray: selectedTypes,
        offset: offset,
      })
      .then(({ filteredProposals, totalLength }) => {
        setFilteredProposals(filteredProposals);
        setFilteredLength(totalLength);
      });
  } else if (filteredProposals.length) {
    setFilteredProposals([]);
    setFilteredLength(null);
  }
}, [selectedStatus, selectedTypes, currentPage]);

const proposalsComponent = useMemo(() => {
  const proposalsToShow =
    selectedStatus.length > 0 || selectedTypes.length > 0
      ? Array.isArray(filteredProposals)
        ? filteredProposals
        : []
      : Array.isArray(proposals)
        ? proposals
        : [];
  return (
    <div className="d-flex flex-column gap-2">
      {proposalsToShow.length > 0 ? (
        proposalsToShow.map((item) => {
          const kindName =
            typeof item.kind === "string"
              ? item.kind
              : Object.keys(item.kind)[0];

          const comments = sdk.getCommentsByProposalId({ proposalId: item.id });

          const isAllowedToVote = [
            sdk.hasPermission({
              accountId,
              kindName,
              actionType: actions.VoteApprove,
            }),
            sdk.hasPermission({
              accountId,
              kindName,
              actionType: actions.VoteReject,
            }),

            sdk.hasPermission({
              accountId,
              kindName,
              actionType: actions.VoteRemove,
            }),
          ];

          const { thresholdVoteCount } =
            sdk.getVotersAndThresholdForProposalKind({
              kindName,
            });
          const totalVotes = sdk.calculateVoteCountByType({
            votes: item.votes,
          });
          let expirationTime = sdk.getProposalExpirationTime({
            submissionTime: item.submission_time,
          });

          return (
            <Widget
              src="buildhub.near/widget/components.ProposalCard"
              props={{
                proposalData: {
                  ...item,
                  typeName: kindName.replace(/([A-Z])/g, " $1").trim(),
                  totalVotesNeeded: thresholdVoteCount,
                  totalVotes: {
                    ...totalVotes,
                    yes: totalVotes.approve,
                    no: totalVotes.reject,
                  },
                  expirationTime,
                },
                daoId: daoId,
                comments: comments,
                isAllowedToVote,
                handleVote: (data) => {
                  setVoteDetails(data);
                  setNotificationModal(true);
                },
              }}
            />
          );
        })
      ) : (
        <>No proposals found.</>
      )}
    </div>
  );
}, [proposals, filteredProposals]);

return (
  <ThemeContainer>
    <Container className="d-flex flex-column gap-4">
      <Widget
        src="buildhub.near/widget/components.modals.CreateProposal"
        props={{
          showModal: showProposalModal,
          toggleModal: () => setShowModal(!showProposalModal),
        }}
      />
      <Widget
        src="buildhub.near/widget/components.modals.ProposalsFilters"
        props={{
          parentSelectedTypes: selectedTypes,
          parentSelectedStatus: selectedStatus,
          applyFilters: ({ selectedStatus, selectedTypes }) => {
            setCurrentPage(0);
            setSelectedStatus(selectedStatus);
            setSelectedTypes(selectedTypes);
          },
          showModal: showFiltersModal,
          toggleModal: () => setFiltersModal(!showFiltersModal),
        }}
      />
      <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <h3 className="text-white m-0">Proposals</h3>
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline" onClick={() => setFiltersModal(true)}>
            Filters
          </Button>
          <Button
            variant="primary"
            disabled={!context.accountId}
            onClick={() => setShowModal(true)}
          >
            Create Proposal
          </Button>
        </div>
      </div>
      <NotificationModal />
      <div className="d-flex flex-column gap-4">{proposalsComponent}</div>
      {!proposalId && (
        <div className="d-flex justify-content-center my-4">
          <Widget
            src={"buildhub.near/widget/components.Pagination"}
            props={{
              maxVisiblePages: 5,
              totalPages:
                selectedStatus.length > 0 || selectedTypes.length > 0
                  ? Math.round(filteredLength / resPerPage)
                  : Math.round(lastProposalId / resPerPage),
              onPageClick: (v) => setCurrentPage(v),
              selectedPage: currentPage,
              ThemeContainer: PaginationThemeContainer,
            }}
          />
        </div>
      )}
    </Container>
  </ThemeContainer>
);
