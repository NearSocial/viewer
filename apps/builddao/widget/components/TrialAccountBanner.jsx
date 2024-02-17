const { Button, Avatar } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
  Avatar: () => <></>,
};

const TaglineSmall = styled.h2`
  max-width: 700px;

  text-align: center;
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 57.6px */
  margin: 0;

  text-wrap: balance;

  span.muted {
    color: rgba(255, 255, 255, 0.7);
  }

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const { networkId, accountId } = context;
// Check if the network is testnet
const isTestnet = networkId === "testnet";

const { currentGateway } = props;
return (
  <>
    {currentGateway && !isTestnet && accountId === null ? (
      <>
        <TrialAccountGenerator
          trigger={({ onClick }) => (
            <Button variant="primary" onClick={onClick}>
              Create Trial Account
            </Button>
          )}
        />
        <TaglineSmall>
          Try out the builders gateway with a trial account. <br />
          No crypto, no passphrase required.
        </TaglineSmall>
      </>
    ) : null}
  </>
);
