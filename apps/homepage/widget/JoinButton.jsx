const { children } = props;
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
  const connectData = {
    graph: {
      connect: {
        [daoId]: "",
      },
    },
    index: {
      graph: JSON.stringify({
        key: "connect",
        value: {
          type: "connect",
          accountId: daoId,
        },
      }),
    },
  };

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
    {
      contractName: "social.near",
      methodName: "set",
      deposit: Big(JSON.stringify(connectData).length * 16).mul(
        Big(10).pow(20)
      ),
      args: { data: connectData },
    },
  ]);
};

return <button onClick={handleJoin}>{children}</button>;
