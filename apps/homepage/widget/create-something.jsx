const [isMember, setIsMember] = useState(false);

if (!context.accountId) {
  return "Login to continue...";
}

const JoinContainer = styled.div`
  padding: 3rem;
  background-color: #0b0c14;
  color: #fff;
  height: 100%;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  display: flex;
  max-width: 500px;
  width: 100%;
  max-height: 550px;
  padding: 80px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;

  border-radius: 32px;
  background: var(--bg-2, #23242b);

  img {
    width: auto;
    height: 54px;
  }

  h1 {
    color: var(--white-100, #fff);
    text-align: center;

    /* H1/small */
    font-size: 2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 32px */
  }
`;

const CTASection = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  align-self: stretch;

  h3 {
    color: var(--white-50, rgba(255, 255, 255, 0.7));
    text-align: center;

    /* H3/Small */
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 28px */
  }

  a,
  button {
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
  }

  span.pending {
    display: flex;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    border: 1px solid rgba(81, 182, 255, 0.2);
    background: rgba(81, 182, 255, 0.2);

    color: var(--Blue, #51b6ff);

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  span.joined {
    display: flex;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    border: 1px solid rgba(81, 255, 234, 0.2);
    background: rgba(81, 255, 234, 0.2);

    color: var(--Sea-Blue, #51ffea);

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const userWidgets = Social.keys(`${context.accountId}/widget/**`) || [];

const daoId = "build.sputnik-dao.near";
const accountId = context.accountId;

// get DAO policy, deposit, and group
const policy = Near.view(daoId, "get_policy");

if (policy === null) {
  return "";
}

const deposit = policy.proposal_bond;
const roleId = "community";
const group = policy.roles
  .filter((role) => role.name === roleId)
  .map((role) => role.kind.Group);

const handleJoin = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `add ${accountId} to the ${roleId} group`,
          kind: {
            AddMemberToRole: {
              member_id: accountId,
              role: roleId,
            },
          },
        },
      },
      gas: 219000000000000,
      deposit: deposit,
    },
  ]);
};

const proposalId = Near.view(daoId, "get_last_proposal_id") - 1;

// get data from last proposal
const proposal = Near.view(daoId, "get_proposal", {
  id: proposalId,
});

if (proposal === null) {
  return "";
}

// check if the potential member submitted last proposal
const canJoin = accountId && accountId !== proposal.proposer;

const groupMembers = group.join(", ");

const checkMembership = (groupMembers) => {
  if (groupMembers.indexOf(accountId) !== -1) {
    return setIsMember(true);
  }
};

const validMember = checkMembership(groupMembers);

const CreateSomethingView = (props) => {
  return (
    <JoinContainer>
      <Card>
        {" "}
        <img src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya" />
        <h1>
          Designed to connect and empower builders in a multi-chain ecosystem
        </h1>
        <CTASection>
          {userWidgets.length === 0 ? (
            <>
              <h3>In order to join Build DAO, you need to create a widget</h3>
              <a href="/edit">
                Create Something{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M10.7809 7.83327L7.2049 4.25726L8.1477 3.31445L13.3332 8.49993L8.1477 13.6853L7.2049 12.7425L10.7809 9.1666H2.6665V7.83327H10.7809Z"
                    fill="black"
                  />
                </svg>
              </a>
            </>
          ) : (
            <>
              {canJoin ? (
                <button onClick={handleJoin}>
                  Join Build DAO{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M10.7809 7.83327L7.2049 4.25726L8.1477 3.31445L13.3332 8.49993L8.1477 13.6853L7.2049 12.7425L10.7809 9.1666H2.6665V7.83327H10.7809Z"
                      fill="black"
                    />
                  </svg>
                </button>
              ) : (
                <>
                  <span className={!validMember ? "pending" : "joined"}>
                    {!validMember ? "Pending..." : "Joined"}
                  </span>
                  <a href={"/propose"}>
                    Propose Changes{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M10.7809 7.83327L7.2049 4.25726L8.1477 3.31445L13.3332 8.49993L8.1477 13.6853L7.2049 12.7425L10.7809 9.1666H2.6665V7.83327H10.7809Z"
                        fill="black"
                      />
                    </svg>
                  </a>
                </>
              )}
            </>
          )}{" "}
        </CTASection>
      </Card>
    </JoinContainer>
  );
};

return <CreateSomethingView {...props} />;
