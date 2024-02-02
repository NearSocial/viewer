const { Button } = VM.require("buildhub.near/widget/components.Button") || {
  Button: <></>,
};
const DaoSDK = VM.require("sdks.near/widget/SDKs.Sputnik.DaoSDK") || (() => {});

if (!DaoSDK) {
  return <></>;
}

const resPerPage = 10;
const daoId = props.daoId ?? "build.sputnik-dao.near";
const proposalId = props.proposalId ?? null;
const sdk = DaoSDK(daoId);
const [currentPage, setCurrentPage] = useState(0);
const accountId = context.accountId;

const [showProposalModal, setShowModal] = useState(false);
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
          ? lastProposalId > 10
            ? lastProposalId - resPerPage
            : lastProposalId ?? 10
          : lastProposalId - currentPage * resPerPage,
      limit: resPerPage,
    }) || [];

const proposals = reversedProposals.reverse();
const PaginationThemeContainer = props.PaginationThemeContainer;

const ThemeContainer =
  props.ThemeContainer ||
  styled.div`
    --primary-bg-color: #23242b;
    --secondary-bg-color: #ffffff1a;
    --primary-border-color: #fff;
    --primary-text-color: #ffffff;
    --secondary-text-color: #b0b0b0;
    --primary-btn-bg-color: #ffaf51;
    --primary-btn-text-color: #000;
    --approve-bg-color: #82e299;
    --reject-bg-color: #c23f38;
    --spam-bg-color: #f5c518;
    --vote-button-color: #ffffff;
    --success-badge-bg-color: #38c7931a;
    --success-badge-text-color: #38c793;
    --primary-badge-bg-color: #ffaf5133;
    --primary-badge-text-color: #ffaf51;
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

const handleVote = ({ action, proposalId, proposer }) => {
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
    additionalCalls: [
      {
        contractName: "social.near",
        methodName: "set",
        args: { data: notification },
        deposit: Big(JSON.stringify(notification).length * 16)
          .mul(Big(10).pow(20))
          .toString(),
      },
    ],
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

const proposalsComponent = useMemo(() => {
  return (
    <div className="d-flex flex-column gap-2">
      {Array.isArray(proposals) ? (
        proposals.map((item) => {
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
                handleVote,
              }}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}, [proposals]);

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
      <div className="d-flex justify-content-between">
        <h3 className="text-white">Proposals</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create Proposal
        </Button>
      </div>
      <div className="d-flex flex-column gap-4">{proposalsComponent}</div>
      {!proposalId && (
        <div className="d-flex justify-content-center my-4">
          <Widget
            src={"buildhub.near/widget/components.Pagination"}
            props={{
              maxVisiblePages: 5,
              totalPages: Math.round(lastProposalId / resPerPage),
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
