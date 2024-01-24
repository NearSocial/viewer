// checks if the user is already dao's community/council member or has an active proposal
const checkIsMemberOrPending = (accountId) => {
  const daoId = "build.sputnik-dao.near";
  if (!accountId) {
    return false;
  }
  const alreadyJoinedRolesNames = ["community", "council"];
  const searchRange = 100;

  const lastProposalId = Near.view(daoId, "get_last_proposal_id");

  const policy = Near.view(daoId, "get_policy");
  const isDaoMember = false;
  const lastProposals =
    Near.view(daoId, "get_proposals", {
      from_index: lastProposalId - searchRange,
      limit: searchRange
    }) || [];

  const alreadyMadeAProposal =
    lastProposals.filter((proposal) => {
      return (
        proposal.proposer === accountId && proposal.status === "InProgress"
      );
    }).length > 0;

  policy.roles
    .filter((role) => alreadyJoinedRolesNames.includes(role.name))
    .map((role) => {
      if (Array.isArray(role.kind.Group) && !isDaoMember) {
        isDaoMember = role.kind.Group.includes(accountId);
      }
    });
  return isDaoMember || alreadyMadeAProposal;
};

return { checkIsMemberOrPending };
