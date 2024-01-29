const { Button } = VM.require("buildhub.near/widget/components.Button") || {
  Button: <></>
};
const DaoSDK = VM.require("sdks.near/widget/SDKs.Sputnik.DaoSDK");

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
const proposals = proposalId
  ? [
      sdk.getProposalById({
        proposalId
      })
    ] || []
  : sdk.getProposals({
      offset:
        currentPage === 0
          ? lastProposalId - resPerPage
          : lastProposalId - currentPage * resPerPage,
      limit: resPerPage
    }) || [];

const Container = styled.div`
  .ndc-card {
    border: none;
    background-color: #23242b;
    color: white !important;
    padding: 2rem;
  }
`;

const handleVote = ({ action, proposalId, proposer }) => {
  let args = {};
  args["id"] = JSON.parse(proposalId);
  args["action"] = action;
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
                proposalId: proposalId
              },
              type: "custom",
              widget: "buildhub.near/widget/Proposals"
            }
          }
        ])
      }
    }
  };
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: args,
      gas: 200000000000000
    },
    {
      contractName: "social.near",
      methodName: "set",
      args: { data: notification },
      deposit: Big(JSON.stringify(notification).length * 16).mul(
        Big(10).pow(20)
      )
    }
  ]);
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

const ProposalsComponent = () => {
  return (
    <div className="d-flex flex-column gap-2">
      {Array.isArray(proposals) ? (
        proposals.map((item) => {
          const kindName =
            typeof item.kind === "string"
              ? item.kind
              : Object.keys(item.kind)[0];

          const comments = Social.index("comment", {
            type: "dao_proposal_comment",
            path: `${daoId}/proposal/main`,
            proposal_id: item.id + "-beta"
          });
          const permissionKind = proposalKinds[kindName];
          let totalVotesNeeded = 0;
          const isAllowedToVote = [
            sdk.hasPermission({
              accountId,
              permissionKind,
              actionType: actions.VoteApprove
            }),
            sdk.hasPermission({
              accountId,
              permissionKind,
              actionType: actions.VoteReject
            }),

            sdk.hasPermission({
              accountId,
              permissionKind,
              actionType: actions.VoteRemove
            })
          ];

          policy.roles.forEach((role) => {
            const isRoleAllowedToVote =
              role.permissions.includes(
                `${proposalKinds[kindName]}:VoteApprove`
              ) ||
              role.permissions.includes(
                `${proposalKinds[kindName]}:VoteReject`
              ) ||
              role.permissions.includes(`${proposalKinds[kindName]}:*`) ||
              role.permissions.includes(`*:VoteApprove`) ||
              role.permissions.includes(`*:VoteReject`) ||
              role.permissions.includes("*:*");
            if (isRoleAllowedToVote) {
              const threshold = (role.vote_policy &&
                role.vote_policy[proposalKinds[kindName]]?.threshold) ||
                policy["default_vote_policy"]?.threshold || [0, 0];
              const eligibleVoters = role.kind.Group
                ? role.kind.Group.length
                : 0;

              // Apply the threshold
              if (eligibleVoters === 0) {
                return;
              }

              const votesNeeded =
                Math.floor((threshold[0] / threshold[1]) * eligibleVoters) + 1;
              console.log(item.id, "votesNeeded", votesNeeded);
              totalVotesNeeded += votesNeeded;
            }
          });

          let totalVotes = {
            yes: 0,
            no: 0,
            spam: 0,
            total: 0
          };
          for (const vote of Object.values(item.votes)) {
            if (vote === "Approve") {
              totalVotes.yes++;
            } else if (vote === "Reject") {
              totalVotes.no++;
            } else if (vote === "Spam") {
              totalVotes.spam++;
            }
          }
          totalVotes.total = totalVotes.yes + totalVotes.no + totalVotes.spam;

          let expirationTime = Big(item.submission_time).add(
            Big(proposalPeriod)
          );

          return (
            <Widget
              src="buildhub.near/widget/components.ProposalCard"
              props={{
                proposalData: {
                  ...item,
                  typeName: kindName.replace(/([A-Z])/g, " $1").trim(),
                  totalVotesNeeded,
                  totalVotes,
                  expirationTime
                },
                daoId: daoId,
                comments: comments,
                isAllowedToVote,
                handleVote
              }}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

return (
  <Container className="d-flex flex-column gap-4">
    <Widget
      src="buildhub.near/widget/components.modals.CreateProposal"
      props={{
        showModal: showProposalModal,
        toggleModal: () => setShowModal(!showProposalModal)
      }}
    />
    <div className="d-flex justify-content-between">
      <h3>Proposals</h3>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Create Proposal
      </Button>
    </div>
    <div className="d-flex flex-column gap-4">
      <ProposalsComponent />
    </div>
    {!proposalId && (
      <div className="d-flex justify-content-center my-4">
        <Widget
          src="nearui.near/widget/Navigation.PrevNext"
          props={{
            hasPrev: currentPage > 0,
            hasNext: proposals?.[0].id !== resPerPage,
            onPrev: () => {
              setCurrentPage(currentPage - 1);
            },
            onNext: () => {
              setCurrentPage(currentPage + 1);
            }
          }}
        />
      </div>
    )}
  </Container>
);
