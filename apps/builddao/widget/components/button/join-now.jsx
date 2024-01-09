const daoId = "build.sputnik-dao.near";
const accountId = context.accountId;

// get DAO policy, deposit, and group
const policy = Near.view(daoId, "get_policy");

if (policy === null) {
  return "";
}

const alreadyJoinedRolesNames = ["community", "council"];

const group = policy.roles
  .filter((role) => alreadyJoinedRolesNames.includes(role.name))
  .map((role) => {
    return role.kind.Group;
  });

const accounts = new Set(group[0].concat(group[1]));

const isCommunityOrCouncilMember = accounts.has(accountId);

const proposalId = Near.view(daoId, "get_last_proposal_id") - 1;

// get data from last proposal
const proposal = Near.view(daoId, "get_proposal", {
  id: proposalId,
});

if (proposal === null) {
  return "";
}

// check if the potential member submitted last proposal
const canJoin =
  accountId && accountId !== proposal.proposer && !isCommunityOrCouncilMember;

const Bullet = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  background: rgba(81, 255, 234, 0.20);
  color: rgba(81, 255, 234, 1);
  border: 1px solid rgba(81, 255, 234, 0.20);
  font-family: Satoshi, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
`;


const Button = styled.a`
  width: max-content;
  all: unset;
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: none;
    color: #000 !important;
    cursor: pointer;
    background: var(--Yellow, #ffaf51);
  }

  border-radius: 8px;
  background: var(--Yellow, #ffaf51);

  color: var(--black-100, #000);

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media screen and (max-width: 768px) {
    flex: 1 1 0;
  }
`;

const Container = styled.div`
  width: max-content;
  margin-left: auto;

  @media screen and (max-width: 768px) {
    margin: 0;
    width: 100%;

    display: flex;
    justify-content: center;
  }
`;

return (
  <Container>
    {canJoin ? (
      <Button href={"/join"}>Join Now</Button>
    ) : <Bullet>Joined</Bullet>}
  </Container>
);
